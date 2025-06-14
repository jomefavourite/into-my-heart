import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getCurrentUserOrThrow } from './users';

export const addVerse = mutation({
  args: {
    bookName: v.string(),
    chapter: v.number(),
    verses: v.array(v.string()),
    reviewFreq: v.string(), // e.g., "daily", "weekly", "monthly"
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const user = await getCurrentUserOrThrow(ctx);

    if (!identity) {
      throw new Error('Unauthorized');
    }

    await ctx.db.insert('verses', {
      bookName: args.bookName,
      chapter: args.chapter,
      verses: args.verses,
      reviewFreq: args.reviewFreq,
      userId: user._id, // Reference to the user who created the verse
    });
  },
});

export const getVerses = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const verses = await ctx.db
      .query('verses')
      .order('desc')
      // .filter((q) => q.eq(q.field('authorId'), identity.subject)) // makes sure I always get the verses from the current user
      .take(50);

    return verses;
  },
});
