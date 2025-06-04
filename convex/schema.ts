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

export const Verse = {
  userId: v.id('users'), // Reference to the user who created the verse
  bookName: v.string(),
  chapter: v.number(),
  verses: v.array(v.string()),
  reviewFreq: v.string(), // e.g., "daily", "weekly", "monthly"
};

export default defineSchema({
  users: defineTable(User),
  verses: defineTable(Verse),
  messages: defineTable({
    content: v.string(),
    authorId: v.string(),
    authorEmail: v.string(),
    createdAt: v.number(),
  }),
});
