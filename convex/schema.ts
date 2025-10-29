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
  role: v.optional(v.union(v.literal('admin'), v.literal('user'))),
};

export const Verse = {
  userId: v.id('users'),
  bookName: v.string(),
  chapter: v.number(),
  verses: v.array(v.string()),
  verseTexts: v.array(
    v.object({
      verse: v.string(),
      text: v.string(),
    })
  ),
  reviewFreq: v.string(),
};

export const Collection = {
  userId: v.id('users'), // Reference to the user who created the collection
  collectionName: v.string(),
  versesLength: v.number(),
  collectionVerses: v.array(
    v.object({
      bookName: v.string(),
      chapter: v.number(),
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
};

export const VerseSuggestion = {
  bookName: v.string(),
  chapter: v.number(),
  verses: v.array(v.string()),
  verseTexts: v.array(
    v.object({
      verse: v.string(),
      text: v.string(),
    })
  ),
  reviewFreq: v.string(),
};
export const CollectionSuggestion = {
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
};

export const UserVerseSuggestion = {
  userId: v.id('users'),
  suggestionId: v.id('versesSuggestions'),
};

export const VerseNote = {
  userId: v.id('users'),
  verseId: v.id('verses'),
  content: v.string(),
  updatedAt: v.number(),
};

export default defineSchema({
  users: defineTable(User).index('byClerkId', ['clerkId']),
  verses: defineTable(Verse),
  versesSuggestions: defineTable(VerseSuggestion),
  collectionSuggestions: defineTable(CollectionSuggestion),
  collections: defineTable(Collection),
  userVerseSuggestions: defineTable(UserVerseSuggestion)
    .index('byUserId', ['userId'])
    .index('bySuggestionId', ['suggestionId']),
  verseNotes: defineTable(VerseNote)
    .index('byVerseId', ['verseId'])
    .index('byUserId', ['userId']),
});
