import { v } from 'convex/values';
import { internalMutation, query } from './_generated/server';

export const getUsers = query({
  args: {},
  handler: async ({ db }) => {
    const users = await db.query('users').collect();
    return users;
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
