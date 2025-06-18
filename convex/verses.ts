import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getCurrentUserOrThrow } from './users';
import { paginationOptsValidator } from 'convex/server';

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
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();
    const user = await getCurrentUserOrThrow(ctx);

    // if (!identity) {
    //   throw new Error('Unauthorized');
    // }

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

export const getVerses = query({
  args: {
    take: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const verses = await ctx.db
      .query('verses')
      .order('desc')
      .filter((q) => q.eq(q.field('userId'), user._id))
      .take(args.take ?? 50);

    return verses;
  },
});

export const getAllVerses = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const verses = await ctx.db
      .query('verses')
      .order('desc')
      .filter((q) => q.eq(q.field('userId'), user._id))
      .paginate(args.paginationOpts);
    return verses;
  },
});
