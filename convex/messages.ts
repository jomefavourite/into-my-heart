import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const send = mutation({
  args: {
    content: v.string(),
    authorEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    await ctx.db.insert('messages', {
      content: args.content,
      authorId: identity.subject,
      authorEmail: args.authorEmail,
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const messages = await ctx.db
      .query('messages')
      .order('desc')
      .filter((q) => q.eq(q.field('authorId'), identity.subject)) // makes sure I always get the messages from the current user
      .take(50);

    return messages;
  },
});
