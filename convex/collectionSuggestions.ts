import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getCurrentUserOrThrow } from './users';

export const addCollectionSuggestion = mutation({
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
        'Unauthorized - Admin access required to add collection suggestions'
      );
    }

    await ctx.db.insert('collectionSuggestions', {
      bookName: args.bookName,
      chapter: args.chapter,
      verses: args.verses,
      reviewFreq: args.reviewFreq,
      verseTexts: args.versesTexts,
    });
  },
});

export const getCollectionsSuggestion = query({
  args: {
    take: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      await getCurrentUserOrThrow(ctx); // Just check authentication

      // Get all collection suggestions (available to all users)
      const verses = await ctx.db
        .query('collectionSuggestions')
        .order('desc')
        .take(args.take || 50);

      return verses;
    } catch (error) {
      console.error('getCollectionsSuggestion error:', error);
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        throw new Error('Authentication required. Please sign in again.');
      }
      throw error;
    }
  },
});

export const deleteCollectionSuggestion = mutation({
  args: {
    _id: v.id('collectionSuggestions'),
  },
  handler: async (ctx, { _id }) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Check if user has admin role
    if (user.role !== 'admin') {
      throw new Error(
        'Unauthorized - Admin access required to delete collection suggestions'
      );
    }

    const collectionSuggestion = await ctx.db.get(_id);

    if (!collectionSuggestion) {
      throw new Error('Collection suggestion not found');
    }

    await ctx.db.delete(_id);
  },
});

// Admin-only query to get all collection suggestions
export const getAllCollectionSuggestions = query({
  handler: async ctx => {
    const user = await getCurrentUserOrThrow(ctx);

    // Check if user has admin role
    if (user.role !== 'admin') {
      throw new Error('Unauthorized - Admin access required');
    }

    const collections = await ctx.db
      .query('collectionSuggestions')
      .order('desc')
      .take(100);

    return collections;
  },
});
