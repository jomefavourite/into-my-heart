import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import {
  collectionVerseValidator,
  importSourceValidator,
  verseTextValidator,
} from './sharedValidators';

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
  syncId: v.optional(v.string()),
  bookName: v.string(),
  chapter: v.number(),
  verses: v.array(v.string()),
  verseTexts: v.array(verseTextValidator),
  reviewFreq: v.string(),
  isFeatured: v.optional(v.boolean()),
  importSource: v.optional(importSourceValidator),
  updatedAt: v.optional(v.number()),
  deletedAt: v.optional(v.number()),
};

export const Collection = {
  userId: v.id('users'), // Reference to the user who created the collection
  syncId: v.optional(v.string()),
  collectionName: v.string(),
  versesLength: v.number(),
  collectionVerses: v.array(collectionVerseValidator),
  updatedAt: v.optional(v.number()),
  deletedAt: v.optional(v.number()),
};

export const VerseSuggestion = {
  bookName: v.string(),
  chapter: v.number(),
  verses: v.array(v.string()),
  verseTexts: v.array(verseTextValidator),
  reviewFreq: v.string(),
};
export const CollectionSuggestion = {
  collectionName: v.string(),
  versesLength: v.number(),
  collectionVerses: v.array(collectionVerseValidator),
};

export const UserVerseSuggestion = {
  userId: v.id('users'),
  suggestionId: v.id('versesSuggestions'),
};

export const VerseNote = {
  userId: v.id('users'),
  verseId: v.id('verses'),
  syncId: v.optional(v.string()),
  content: v.string(),
  updatedAt: v.number(),
  deletedAt: v.optional(v.number()),
};

export const Affirmation = {
  userId: v.id('users'),
  syncId: v.optional(v.string()),
  content: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
  deletedAt: v.optional(v.number()),
};

export const PracticeSession = {
  userId: v.id('users'),
  syncId: v.string(),
  method: v.union(
    v.literal('flashcards'),
    v.literal('fillInBlanks'),
    v.literal('recitation')
  ),
  practiceType: v.union(v.literal('verses'), v.literal('collections')),
  source: v.optional(
    v.union(
      v.literal('verseDetail'),
      v.literal('smartQueue'),
      v.literal('manualTechnique')
    )
  ),
  verseKeys: v.array(v.string()),
  verseCount: v.number(),
  passedVerseKeys: v.optional(v.array(v.string())),
  needsReviewVerseKeys: v.optional(v.array(v.string())),
  completedAt: v.number(),
  updatedAt: v.number(),
};

export const VerseProgress = {
  userId: v.id('users'),
  syncId: v.string(),
  verseKey: v.string(),
  totalCompletionCount: v.number(),
  flashcardsCount: v.number(),
  fillInBlanksCount: v.number(),
  recitationCount: v.number(),
  lastPracticedAt: v.number(),
  status: v.optional(
    v.union(
      v.literal('new'),
      v.literal('learning'),
      v.literal('strengthening'),
      v.literal('mastered')
    )
  ),
  nextMethod: v.optional(
    v.union(
      v.literal('flashcards'),
      v.literal('fillInBlanks'),
      v.literal('recitation')
    )
  ),
  dueAt: v.optional(v.number()),
  successfulReviewCount: v.optional(v.number()),
  lastOutcome: v.optional(v.union(v.literal('pass'), v.literal('needsReview'))),
  lastFlashcardsAt: v.optional(v.number()),
  lastFillInBlanksAt: v.optional(v.number()),
  lastRecitationAt: v.optional(v.number()),
  updatedAt: v.number(),
};

export default defineSchema({
  users: defineTable(User).index('byClerkId', ['clerkId']),
  verses: defineTable(Verse)
    .index('byUserId', ['userId'])
    .index('byUserIdSyncId', ['userId', 'syncId']),
  versesSuggestions: defineTable(VerseSuggestion),
  collectionSuggestions: defineTable(CollectionSuggestion),
  collections: defineTable(Collection)
    .index('byUserId', ['userId'])
    .index('byUserIdSyncId', ['userId', 'syncId']),
  userVerseSuggestions: defineTable(UserVerseSuggestion)
    .index('byUserId', ['userId'])
    .index('bySuggestionId', ['suggestionId']),
  verseNotes: defineTable(VerseNote)
    .index('byVerseId', ['verseId'])
    .index('byUserId', ['userId'])
    .index('byUserIdSyncId', ['userId', 'syncId']),
  affirmations: defineTable(Affirmation)
    .index('byUserId', ['userId'])
    .index('byUserIdSyncId', ['userId', 'syncId']),
  practiceSessions: defineTable(PracticeSession)
    .index('byUserId', ['userId'])
    .index('byUserIdSyncId', ['userId', 'syncId']),
  verseProgress: defineTable(VerseProgress)
    .index('byUserId', ['userId'])
    .index('byUserIdSyncId', ['userId', 'syncId'])
    .index('byUserIdVerseKey', ['userId', 'verseKey']),
});
