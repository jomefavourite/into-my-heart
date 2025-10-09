import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getCurrentUserOrThrow } from './users';

export const addCollectionSuggestion = mutation({
  args: {
    collectionName: v.string(),
    versesLength: v.number(),
    collectionVerses: v.array(
      v.object({
        bookName: v.string(),
        chapter: v.float64(),
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

    // Check if user has admin role
    if (user.role !== 'admin') {
      throw new Error(
        'Unauthorized - Admin access required to add collection suggestions'
      );
    }

    await ctx.db.insert('collectionSuggestions', {
      collectionName: args.collectionName,
      versesLength: args.versesLength,
      collectionVerses: args.collectionVerses,
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

// Add collection suggestion to user's collections
export const addCollectionSuggestionToUser = mutation({
  args: {
    suggestionId: v.id('collectionSuggestions'),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Get the collection suggestion
    const suggestion = await ctx.db.get(args.suggestionId);
    if (!suggestion) {
      throw new Error('Collection suggestion not found');
    }

    // Check if user already has a collection with the same name
    const existingCollections = await ctx.db
      .query('collections')
      .filter(q => q.eq(q.field('userId'), user._id))
      .collect();

    const duplicateCollection = existingCollections.find(
      collection => collection.collectionName === suggestion.collectionName
    );

    if (duplicateCollection) {
      throw new Error(
        `You already have a collection named "${suggestion.collectionName}". Please choose a different name or delete the existing collection.`
      );
    }

    // Add the collection to user's collections
    await ctx.db.insert('collections', {
      collectionName: suggestion.collectionName,
      versesLength: suggestion.versesLength,
      collectionVerses: suggestion.collectionVerses,
      userId: user._id,
    });
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
