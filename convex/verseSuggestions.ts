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
    });
  },
});

export const getVersesSuggestion = query({
  args: {
    take: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      await getCurrentUserOrThrow(ctx); // Just check authentication

      // Get all verse suggestions (available to all users)
      const verses = await ctx.db
        .query('versesSuggestions')
        .order('desc')
        .take(args.take || 50);

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

// Admin-only query to get all verse suggestions
export const getAllVerseSuggestions = query({
  handler: async ctx => {
    const user = await getCurrentUserOrThrow(ctx);

    const verses = await ctx.db
      .query('versesSuggestions')
      .order('desc')
      .take(100);

    return verses;
  },
});

// Add verse suggestion to user's collection
export const addVerseSuggestionToUser = mutation({
  args: {
    suggestionId: v.id('versesSuggestions'),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Get the verse suggestion
    const suggestion = await ctx.db.get(args.suggestionId);
    if (!suggestion) {
      throw new Error('Verse suggestion not found');
    }

    // Check if user already has this verse
    const existingVerses = await ctx.db
      .query('verses')
      .filter(q => q.eq(q.field('userId'), user._id))
      .collect();

    // Check for duplicates
    for (const existingVerse of existingVerses) {
      if (
        existingVerse.bookName === suggestion.bookName &&
        existingVerse.chapter === suggestion.chapter
      ) {
        // Check if any of the verses we're trying to add already exist
        const existingVerseNumbers = existingVerse.verses;
        const newVerseNumbers = suggestion.verses;

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

    // Add the verse to user's collection
    await ctx.db.insert('verses', {
      bookName: suggestion.bookName,
      chapter: suggestion.chapter,
      verses: suggestion.verses,
      reviewFreq: suggestion.reviewFreq,
      verseTexts: suggestion.verseTexts,
      userId: user._id,
    });

    // Track that this user has added this suggestion
    await ctx.db.insert('userVerseSuggestions', {
      userId: user._id,
      suggestionId: args.suggestionId,
    });
  },
});

// Get verse suggestions excluding those already added by the user
export const getAvailableVerseSuggestions = query({
  args: {
    take: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      const user = await getCurrentUserOrThrow(ctx);
      const requestedTake = args.take || 50;

      // Get all verse suggestions
      const allSuggestions = await ctx.db
        .query('versesSuggestions')
        .order('desc')
        .take(requestedTake * 2); // Get more to ensure we have enough after filtering

      // Get suggestions already added by this user
      const userAddedSuggestions = await ctx.db
        .query('userVerseSuggestions')
        .filter(q => q.eq(q.field('userId'), user._id))
        .collect();

      const addedSuggestionIds = new Set(
        userAddedSuggestions.map(item => item.suggestionId)
      );

      // Filter out suggestions already added by the user
      const availableSuggestions = allSuggestions.filter(
        suggestion => !addedSuggestionIds.has(suggestion._id)
      );

      // If we don't have enough available suggestions, fall back to showing all suggestions
      // This ensures we always show at least the requested number of suggestions
      if (availableSuggestions.length < requestedTake) {
        return allSuggestions.slice(0, requestedTake);
      }

      return availableSuggestions.slice(0, requestedTake);
    } catch (error) {
      console.error('getAvailableVerseSuggestions error:', error);
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        throw new Error('Authentication required. Please sign in again.');
      }
      throw error;
    }
  },
});
