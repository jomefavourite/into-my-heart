import { v } from 'convex/values';

export const verseTextValidator = v.object({
  verse: v.string(),
  text: v.string(),
});

export const importSourceValidator = v.object({
  provider: v.union(v.literal('bible.com'), v.literal('unknown')),
  channel: v.union(
    v.literal('paste'),
    v.literal('nativeShare'),
    v.literal('webShareTarget')
  ),
  version: v.union(v.string(), v.null()),
  sourceUrl: v.union(v.string(), v.null()),
  sharedText: v.string(),
  textFidelity: v.optional(
    v.union(v.literal('exactImported'), v.literal('offlineFallback'))
  ),
});

export const collectionVerseValidator = v.object({
  bookName: v.string(),
  chapter: v.number(),
  verses: v.array(v.string()),
  reviewFreq: v.string(),
  verseTexts: v.array(verseTextValidator),
  importSource: v.optional(importSourceValidator),
});
