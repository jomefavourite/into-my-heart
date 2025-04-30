import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const User = {
  email: v.string(),
  clerkId: v.string(),
  imageUrl: v.optional(v.string()),
  first_name: v.optional(v.string()),
  last_name: v.optional(v.string()),
  location: v.optional(v.string()),
  pushToken: v.optional(v.string()),
};

export default defineSchema({
  users: defineTable(User),
  messages: defineTable({
    content: v.string(),
    authorId: v.string(),
    authorEmail: v.string(),
    createdAt: v.number(),
  }),
});
