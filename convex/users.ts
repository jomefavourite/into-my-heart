import { v } from 'convex/values';
import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from './_generated/server';

export const getUserByClerkId = query({
  args: {
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('clerkId'), clerkId))
      .unique();

    return user;
  },
});

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert('users', {
      ...args,
    });
    return userId;
  },
});

export const updateUser = mutation({
  args: {
    _id: v.id('users'),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    pushToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await getCurrentUserOrThrow(ctx);

    const { _id, ...rest } = args;
    return await ctx.db.patch(_id, rest);
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  try {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      console.error('getCurrentUser: No user identity found');
      throw new Error('Unauthorized - No user identity');
    }

    console.log(
      'getCurrentUser: Identity found for subject:',
      identity.subject
    );
    const user = await userByExternalId(ctx, identity.subject);

    if (!user) {
      console.error(
        'getCurrentUser: User not found in database for subject:',
        identity.subject
      );
      throw new Error('User not found in database');
    }

    return user;
  } catch (error) {
    console.error('getCurrentUser error:', error);
    throw error;
  }
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query('users')
    .withIndex('byClerkId', q => q.eq('clerkId', externalId))
    .unique();
}
