import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getCurrentUserOrThrow } from './users';
import { Id } from './_generated/dataModel';
import { paginationOptsValidator } from 'convex/server';

export const addAffirmation = mutation({
  args: {
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const now = Date.now();

    await ctx.db.insert('affirmations', {
      userId: user._id,
      content: args.content,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getAffirmations = query({
  args: {
    take: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const affirmations = await ctx.db
      .query('affirmations')
      .withIndex('byUserId', q => q.eq('userId', user._id))
      .order('desc')
      .take(args.take ?? 50);

    return affirmations;
  },
});

export const getAllAffirmations = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    try {
      const user = await getCurrentUserOrThrow(ctx);

      const affirmations = await ctx.db
        .query('affirmations')
        .withIndex('byUserId', q => q.eq('userId', user._id))
        .order('desc')
        .paginate(args.paginationOpts);
      return affirmations;
    } catch (error) {
      console.error('getAllAffirmations error:', error);
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

export const updateAffirmation = mutation({
  args: {
    id: v.id('affirmations'),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) {
      throw new Error('Affirmation not found');
    }

    if (affirmation.userId !== user._id) {
      throw new Error('Unauthorized to modify this affirmation');
    }

    await ctx.db.patch(args.id, {
      content: args.content,
      updatedAt: Date.now(),
    });
  },
});

export const deleteAffirmation = mutation({
  args: {
    id: v.id('affirmations'),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) {
      throw new Error('Affirmation not found');
    }

    if (affirmation.userId !== user._id) {
      throw new Error('Unauthorized to delete this affirmation');
    }

    await ctx.db.delete(args.id);
  },
});

export const getAffirmationById = query({
  args: {
    id: v.id('affirmations'),
  },
  handler: async (ctx, args) => {
    await getCurrentUserOrThrow(ctx);

    const affirmation = await ctx.db.get(args.id);
    return affirmation;
  },
});
