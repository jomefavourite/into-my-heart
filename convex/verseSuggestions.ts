import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getCurrentUserOrThrow } from './users';

export const addVerseSuggestion = mutation({
  args: {
    bookName: v.string(),
    chapter: v.number(),
    verses: v.array(v.string()),
    versesTexts: v.array(
      v.object({
        verse: v.string(),
        text: v.string(),
      })
    ),
    reviewFreq: v.string(), // e.g., "daily", "weekly", "monthly"
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Check if user has admin role
    if (user.role !== 'admin') {
      throw new Error(
        'Unauthorized - Admin access required to add verse suggestions'
      );
    }

    await ctx.db.insert('versesSuggestions', {
      bookName: args.bookName,
      chapter: args.chapter,
      verses: args.verses,
      reviewFreq: args.reviewFreq,
      verseTexts: args.versesTexts,
      userId: user._id, // Reference to the user who created the verse
    });
  },
});

export const getVersesSuggestion = query({
  handler: async ctx => {
    try {
      const user = await getCurrentUserOrThrow(ctx);

      const verses = await ctx.db
        .query('versesSuggestions')
        .order('desc')
        .filter(q => q.eq(q.field('userId'), user._id)) // Filter by current user
        .take(50);

      return verses;
    } catch (error) {
      console.error('getVersesSuggestion error:', error);
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        throw new Error('Authentication required. Please sign in again.');
      }
      throw error;
    }
  },
});

export const deleteVerseSuggestion = mutation({
  args: {
    _id: v.id('versesSuggestions'),
  },
  handler: async (ctx, { _id }) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Check if user has admin role
    if (user.role !== 'admin') {
      throw new Error(
        'Unauthorized - Admin access required to delete verse suggestions'
      );
    }

    const verseSuggestion = await ctx.db.get(_id);

    if (!verseSuggestion) {
      throw new Error('Verse suggestion not found');
    }

    await ctx.db.delete(_id);
  },
});
