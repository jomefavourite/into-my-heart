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
    // const identity = await ctx.auth.getUserIdentity();
    const user = await getCurrentUserOrThrow(ctx);

    // if (!identity) {
    //   throw new Error('Unauthorized');
    // }

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
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const verses = await ctx.db
      .query('versesSuggestions')
      .order('desc')
      // .filter((q) => q.eq(q.field('authorId'), identity.subject)) // makes sure I always get the verses from the current user
      .take(50);

    return verses;
  },
});

export const deleteVerseSuggestion = mutation({
  args: {
    _id: v.id('versesSuggestions'),
  },
  handler: async (ctx, { _id }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const verseSuggestion = await ctx.db.get(_id);

    if (!verseSuggestion) {
      throw new Error('Verse suggestion not found');
    }

    if (verseSuggestion.userId !== user._id) {
      throw new Error('Unauthorized to delete this verse suggestion');
    }

    await ctx.db.delete(_id);
  },
});
