import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getCurrentUserOrThrow } from './users';
import { paginationOptsValidator } from 'convex/server';
import { Id } from './_generated/dataModel';
import { collectionVerseValidator } from './sharedValidators';

export const addCollection = mutation({
  args: {
    collectionName: v.string(),
    collectionVerses: v.array(collectionVerseValidator),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    await ctx.db.insert('collections', {
      collectionName: args.collectionName,
      versesLength: args.collectionVerses.length, // Automatically calculate from collectionVerses
      collectionVerses: args.collectionVerses,
      userId: user._id,
    });
  },
});

export const getCollections = query({
  args: {
    take: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const collections = await ctx.db
      .query('collections')
      .filter(q => q.eq(q.field('userId'), user._id))
      .order('desc')
      .take(args.take ?? 50);

    return collections;
  },
});

export const getTotalCollectionsCount = query({
  handler: async ctx => {
    try {
      const user = await getCurrentUserOrThrow(ctx);
      const collections = await ctx.db
        .query('collections')
        .filter(q => q.eq(q.field('userId'), user._id))
        .collect();
      return collections.length;
    } catch (error) {
      console.error('getTotalCollectionsCount error:', error);
      if (error instanceof Error) {
        if (error.message.includes('Authentication required')) {
          throw new Error('Authentication required. Please sign in.');
        }
        if (error.message.includes('User account not found')) {
          throw new Error('User account not found. Please contact support.');
        }
      }
      throw error;
    }
  },
});

export const getAllCollections = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const verses = await ctx.db
      .query('collections')
      .withIndex('byUserId', q => q.eq('userId', user._id))
      .order('desc')
      .paginate(args.paginationOpts);
    return verses;
  },
});

export const deleteCollections = mutation({
  args: {
    ids: v.array(v.id('collections')),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const collections = await Promise.all(
      args.ids.map(async id => {
        const collection = await ctx.db.get(id);
        return collection && collection.userId === user._id ? id : null;
      })
    );

    const validIds = collections.filter(
      (id): id is Id<'collections'> => id !== null
    );

    await Promise.all(validIds.map(id => ctx.db.delete(id)));
  },
});

export const getCollectionById = query({
  args: {
    id: v.id('collections'),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const collection = await ctx.db.get(args.id);
    if (!collection || collection.userId !== user._id) {
      return null;
    }
    return collection;
  },
});

export const updateCollectionVerses = mutation({
  args: {
    id: v.id('collections'),
    collectionVerses: v.array(collectionVerseValidator),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const collection = await ctx.db.get(args.id);

    if (!collection || collection.userId !== user._id) {
      throw new Error('Collection not found');
    }

    await ctx.db.patch(args.id, {
      collectionVerses: args.collectionVerses,
      versesLength: args.collectionVerses.length,
    });

    return collection;
  },
});

export const updateCollection = mutation({
  args: {
    id: v.id('collections'),
    collectionName: v.string(),
    collectionVerses: v.array(collectionVerseValidator),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const collection = await ctx.db.get(args.id);
    if (!collection || collection.userId !== user._id) {
      throw new Error('Collection not found');
    }

    const updatedCollection = await ctx.db.patch(args.id, {
      collectionName: args.collectionName,
      versesLength: args.collectionVerses.length, // Automatically calculate from collectionVerses
      collectionVerses: args.collectionVerses.map(verse => ({
        ...verse,
        reviewFreq: verse.reviewFreq ?? '',
      })),
    });

    return updatedCollection;
  },
});

export const addVersesToCollection = mutation({
  args: {
    collectionId: v.id('collections'),
    verseIds: v.array(v.id('verses')),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Get the collection
    const collection = await ctx.db.get(args.collectionId);
    if (!collection) {
      throw new Error('Collection not found');
    }

    // Verify the collection belongs to the user
    if (collection.userId !== user._id) {
      throw new Error('Unauthorized to modify this collection');
    }

    // Get the verses to add
    const versesToAdd = await Promise.all(
      args.verseIds.map(async id => {
        const verse = await ctx.db.get(id);
        if (!verse || verse.userId !== user._id) {
          return null;
        }
        return verse;
      })
    );

    const validVerses = versesToAdd.filter(verse => verse !== null);

    if (validVerses.length === 0) {
      throw new Error('No valid verses found to add');
    }

    // Convert verses to collection format and filter out duplicates
    const newCollectionVerses = validVerses
      .map(verse => ({
        bookName: verse!.bookName,
        chapter: verse!.chapter,
        verses: verse!.verses,
        reviewFreq: verse!.reviewFreq ?? '',
        verseTexts: verse!.verseTexts,
        importSource: verse!.importSource,
      }))
      .filter(newVerse => {
        // Check if this verse already exists in the collection
        return !collection.collectionVerses.some(existingVerse => {
          // Check if bookName and chapter match
          if (
            existingVerse.bookName === newVerse.bookName &&
            existingVerse.chapter === newVerse.chapter
          ) {
            // Check if any verse numbers overlap
            return newVerse.verses.some(v => existingVerse.verses.includes(v));
          }
          return false;
        });
      });

    if (newCollectionVerses.length === 0) {
      throw new Error('All selected verses already exist in this collection');
    }

    // Add new verses to existing collection
    const updatedCollectionVerses = [
      ...collection.collectionVerses,
      ...newCollectionVerses,
    ];

    // Update the collection
    await ctx.db.patch(args.collectionId, {
      collectionVerses: updatedCollectionVerses,
      versesLength: updatedCollectionVerses.length,
    });

    return { success: true, addedCount: newCollectionVerses.length };
  },
});
