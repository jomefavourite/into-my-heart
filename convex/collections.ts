import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getCurrentUserOrThrow } from './users';
import { paginationOptsValidator } from 'convex/server';

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
    // const identity = await ctx.auth.getUserIdentity();

    // if (!identity) {
    //   throw new Error('Unauthorized');
    // }
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
  handler: async (ctx) => {
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    //   throw new Error('Unauthorized');
    // }

    const verses = await ctx.db.query('collections').order('desc').take(50);

    return verses;
  },
});

export const getAllCollections = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const verses = await ctx.db
      .query('collections')
      .order('desc')
      .paginate(args.paginationOpts);
    return verses;
  },
});
