import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getCurrentUserOrThrow } from './users';

export const addCollection = mutation({
  args: {
    bookName: v.string(),
    chapter: v.number(),
    verses: v.array(v.string()),
    reviewFreq: v.string(), // e.g., "daily", "weekly", "monthly"
    collectionName: v.string(), // Name of the collection to which the verse belongs
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const user = await getCurrentUserOrThrow(ctx);

    if (!identity) {
      throw new Error('Unauthorized');
    }

    await ctx.db.insert('collections', {
      collectionName: args.collectionName,
      bookName: args.bookName,
      chapter: args.chapter,
      verses: args.verses,
      reviewFreq: args.reviewFreq,
      userId: user._id, // Reference to the user who created the verse
    });
  },
});

export const getCollections = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const verses = await ctx.db.query('collections').order('desc').take(50);

    return verses;
  },
});
