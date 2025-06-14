import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { verses } from '~/lib/constants';

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
  userId: v.id('users'),
  bookName: v.string(),
  chapter: v.number(),
  verses: v.array(v.string()),
  reviewFreq: v.string(),
};

export const VerseSuggestion = {
  userId: v.id('users'),
  bookName: v.string(),
  chapter: v.number(),
  verses: v.array(v.string()),
  reviewFreq: v.string(),
};

export const Collection = {
  collectionName: v.string(),
  versesLength: v.number(), // Total number of verses in the collection
  collectionVerses: v.array(
    v.object({
      bookName: v.string(),
      chapter: v.number(),
      verses: v.array(v.string()), // Array of verse numbers as strings
      reviewFreq: v.string(), // e.g., "daily", "weekly", "monthly"
    })
  ),
  userId: v.id('users'), // Reference to the user who created the collection
};

export default defineSchema({
  users: defineTable(User).index('byClerkId', ['clerkId']),
  verses: defineTable(Verse),
  versesSuggestions: defineTable(VerseSuggestion),
  collections: defineTable(Collection),
  messages: defineTable({
    content: v.string(),
    authorId: v.string(),
    authorEmail: v.string(),
    createdAt: v.number(),
  }),
});
