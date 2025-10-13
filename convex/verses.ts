import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getCurrentUserOrThrow } from './users';
import { paginationOptsValidator } from 'convex/server';
import { Id } from './_generated/dataModel';

export const addVerse = mutation({
  args: {
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
    isGroup: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Validate that verses and verseTexts arrays have the same length
    if (args.verses.length !== args.verseTexts.length) {
      throw new Error(
        `Mismatch: verses array has ${args.verses.length} items but verseTexts has ${args.verseTexts.length} items. They must have the same length.`
      );
    }

    // Only check for duplicates when adding individually (not as a group)
    if (!args.isGroup) {
      const existingVerses = await ctx.db
        .query('verses')
        .filter(q => q.eq(q.field('userId'), user._id))
        .collect();

      // Check for duplicates
      for (const existingVerse of existingVerses) {
        if (
          existingVerse.bookName === args.bookName &&
          existingVerse.chapter === args.chapter
        ) {
          // Check if any of the verses we're trying to add already exist
          const existingVerseNumbers = existingVerse.verses;
          const newVerseNumbers = args.verses;

          const duplicateVerses = newVerseNumbers.filter(verse =>
            existingVerseNumbers.includes(verse)
          );

          if (duplicateVerses.length > 0) {
            throw new Error(
              `The following verses already exist: ${duplicateVerses.join(', ')}. Please remove duplicates and try again.`
            );
          }
        }
      }
    }

    await ctx.db.insert('verses', {
      bookName: args.bookName,
      chapter: args.chapter,
      verses: args.verses,
      reviewFreq: args.reviewFreq,
      verseTexts: args.verseTexts,
      userId: user._id, // Reference to the user who created the verse
    });
  },
});

export const updateVerse = mutation({
  args: {
    id: v.id('verses'),
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
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Get the existing verse to verify ownership
    const existingVerse = await ctx.db.get(args.id);
    if (!existingVerse) {
      throw new Error('Verse not found');
    }

    if (existingVerse.userId !== user._id) {
      throw new Error('Unauthorized to modify this verse');
    }

    // Validate that verses and verseTexts arrays have the same length
    if (args.verses.length !== args.verseTexts.length) {
      throw new Error(
        `Mismatch: verses array has ${args.verses.length} items but verseTexts has ${args.verseTexts.length} items. They must have the same length.`
      );
    }

    // Check for duplicates with other verses (excluding current verse)
    const existingVerses = await ctx.db
      .query('verses')
      .filter(q => q.eq(q.field('userId'), user._id))
      .collect();

    for (const otherVerse of existingVerses) {
      if (
        otherVerse._id !== args.id && // Skip the current verse being updated
        otherVerse.bookName === args.bookName &&
        otherVerse.chapter === args.chapter
      ) {
        // Check if any of the verses we're trying to update already exist in other verses
        const existingVerseNumbers = otherVerse.verses;
        const newVerseNumbers = args.verses;

        const duplicateVerses = newVerseNumbers.filter(verse =>
          existingVerseNumbers.includes(verse)
        );

        if (duplicateVerses.length > 0) {
          throw new Error(
            `The following verses already exist in another verse: ${duplicateVerses.join(', ')}. Please remove duplicates and try again.`
          );
        }
      }
    }

    await ctx.db.patch(args.id, {
      bookName: args.bookName,
      chapter: args.chapter,
      verses: args.verses,
      reviewFreq: args.reviewFreq,
      verseTexts: args.verseTexts,
    });

    return { success: true };
  },
});

export const getVerses = query({
  args: {
    take: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      const user = await getCurrentUserOrThrow(ctx);

      const verses = await ctx.db
        .query('verses')
        .order('desc')
        .filter(q => q.eq(q.field('userId'), user._id))
        .take(args.take ?? 50);

      return verses;
    } catch (error) {
      console.error('getVerses error:', error);
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

export const getAllVerses = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    try {
      const user = await getCurrentUserOrThrow(ctx);

      const verses = await ctx.db
        .query('verses')
        .order('desc')
        .filter(q => q.eq(q.field('userId'), user._id))
        .paginate(args.paginationOpts);
      return verses;
    } catch (error) {
      console.error('getAllVerses error:', error);
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

export const getTotalVersesCount = query({
  handler: async ctx => {
    try {
      const user = await getCurrentUserOrThrow(ctx);
      const verses = await ctx.db
        .query('verses')
        .filter(q => q.eq(q.field('userId'), user._id))
        .collect();
      return verses.length;
    } catch (error) {
      console.error('getTotalVersesCount error:', error);
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

export const deleteVerses = mutation({
  args: {
    ids: v.array(v.id('verses')),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const verses = await Promise.all(
      args.ids.map(async id => {
        const verse = await ctx.db.get(id);
        return verse && verse.userId === user._id ? id : null;
      })
    );

    const validIds = verses.filter((id): id is Id<'verses'> => id !== null);

    await Promise.all(validIds.map(id => ctx.db.delete(id)));
  },
});

export const getVerseById = query({
  args: {
    id: v.id('verses'),
  },
  handler: async (ctx, args) => {
    await getCurrentUserOrThrow(ctx);

    const verse = await ctx.db.get(args.id);
    return verse;
  },
});

export const getVersesByIds = query({
  args: {
    ids: v.array(v.id('verses')),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const verses = await Promise.all(
      args.ids.map(async id => {
        const verse = await ctx.db.get(id);
        // Only return verses that belong to the user
        return verse && verse.userId === user._id ? verse : null;
      })
    );

    return verses.filter(verse => verse !== null);
  },
});
