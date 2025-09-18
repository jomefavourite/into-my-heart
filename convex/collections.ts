import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getCurrentUserOrThrow } from './users';
import { paginationOptsValidator } from 'convex/server';
import { Id } from './_generated/dataModel';

export const addCollection = mutation({
  args: {
    collectionName: v.string(),
    versesLength: v.number(),
    collectionVerses: v.array(
      v.object({
        bookName: v.string(),
        chapter: v.number(),
        verses: v.array(v.string()),
        reviewFreq: v.string(),
        verseTexts: v.array(
          v.object({
            verse: v.string(),
            text: v.string(),
          })
        ),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    await ctx.db.insert('collections', {
      collectionName: args.collectionName,
      versesLength: args.versesLength,
      collectionVerses: args.collectionVerses,
      userId: user._id,
    });
  },
});

export const getCollections = query({
  handler: async ctx => {
    const user = await getCurrentUserOrThrow(ctx);

    const collections = await ctx.db
      .query('collections')
      .filter(q => q.eq(q.field('userId'), user._id))
      .order('desc')
      .take(50);

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
    await getCurrentUserOrThrow(ctx);

    const verses = await ctx.db
      .query('collections')
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
    await getCurrentUserOrThrow(ctx);

    const collection = await ctx.db.get(args.id);
    return collection;
  },
});

export const updateCollectionVerses = mutation({
  args: {
    id: v.id('collections'),
    collectionVerses: v.array(
      v.object({
        bookName: v.string(),
        chapter: v.number(),
        verses: v.array(v.string()),
        reviewFreq: v.string(),
        verseTexts: v.array(
          v.object({
            verse: v.string(),
            text: v.string(),
          })
        ),
      })
    ),
  },
  handler: async (ctx, args) => {
    await getCurrentUserOrThrow(ctx);

    const collection = await ctx.db.get(args.id);

    if (!collection) {
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
    versesLength: v.number(),
    collectionVerses: v.array(
      v.object({
        bookName: v.string(),
        chapter: v.number(),
        verses: v.array(v.string()),
        reviewFreq: v.string(),
        verseTexts: v.array(
          v.object({
            verse: v.string(),
            text: v.string(),
          })
        ),
      })
    ),
  },
  handler: async (ctx, args) => {
    await getCurrentUserOrThrow(ctx);

    const collection = await ctx.db.patch(args.id, {
      collectionName: args.collectionName,
      versesLength: args.versesLength,
      collectionVerses: args.collectionVerses.map(verse => ({
        ...verse,
        reviewFreq: verse.reviewFreq ?? '',
      })),
    });

    return collection;
  },
});
