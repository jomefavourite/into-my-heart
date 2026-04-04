import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { type Id } from './_generated/dataModel';
import { getCurrentUserOrThrow } from './users';

const queueOperationValidator = v.object({
  id: v.string(),
  entityType: v.union(
    v.literal('verse'),
    v.literal('collection'),
    v.literal('affirmation'),
    v.literal('note'),
    v.literal('practiceSession'),
    v.literal('verseProgress')
  ),
  action: v.union(v.literal('upsert'), v.literal('delete')),
  syncId: v.string(),
  payload: v.any(),
  createdAt: v.number(),
});

const mapVerse = (record: any) => ({
  syncId: record.syncId ?? String(record._id),
  remoteId: String(record._id),
  bookName: record.bookName,
  chapter: record.chapter,
  verses: record.verses,
  verseTexts: record.verseTexts,
  reviewFreq: record.reviewFreq,
  isFeatured: record.isFeatured ?? false,
  importSource: record.importSource,
  updatedAt: record.updatedAt ?? record._creationTime,
  deletedAt: record.deletedAt ?? null,
});

const mapCollection = (record: any) => ({
  syncId: record.syncId ?? String(record._id),
  remoteId: String(record._id),
  collectionName: record.collectionName,
  versesLength: record.versesLength,
  collectionVerses: record.collectionVerses,
  updatedAt: record.updatedAt ?? record._creationTime,
  deletedAt: record.deletedAt ?? null,
});

const mapAffirmation = (record: any) => ({
  syncId: record.syncId ?? String(record._id),
  remoteId: String(record._id),
  content: record.content,
  createdAt: record.createdAt ?? record._creationTime,
  updatedAt: record.updatedAt ?? record.createdAt ?? record._creationTime,
  deletedAt: record.deletedAt ?? null,
});

const mapPracticeSession = (record: any) => ({
  syncId: record.syncId ?? String(record._id),
  remoteId: String(record._id),
  method: record.method,
  practiceType: record.practiceType,
  source: record.source ?? 'manualTechnique',
  verseKeys: record.verseKeys,
  verseCount: record.verseCount,
  passedVerseKeys: record.passedVerseKeys ?? [],
  needsReviewVerseKeys: record.needsReviewVerseKeys ?? [],
  completedAt: record.completedAt ?? record._creationTime,
  updatedAt: record.updatedAt ?? record.completedAt ?? record._creationTime,
  deletedAt: record.deletedAt ?? null,
});

const mapVerseProgress = (record: any) => ({
  syncId: record.syncId ?? String(record._id),
  remoteId: String(record._id),
  verseKey: record.verseKey,
  totalCompletionCount: record.totalCompletionCount,
  flashcardsCount: record.flashcardsCount,
  fillInBlanksCount: record.fillInBlanksCount,
  recitationCount: record.recitationCount,
  lastPracticedAt: record.lastPracticedAt,
  status: record.status,
  nextMethod: record.nextMethod,
  dueAt: record.dueAt,
  successfulReviewCount: record.successfulReviewCount,
  lastOutcome: record.lastOutcome,
  lastFlashcardsAt: record.lastFlashcardsAt,
  lastFillInBlanksAt: record.lastFillInBlanksAt,
  lastRecitationAt: record.lastRecitationAt,
  updatedAt: record.updatedAt ?? record.lastPracticedAt ?? record._creationTime,
  deletedAt: record.deletedAt ?? null,
});

const getOwnedDocument = async <TableName extends
  | 'verses'
  | 'collections'
  | 'affirmations'
  | 'verseNotes'
  | 'practiceSessions'
  | 'verseProgress'>(
  ctx: any,
  _tableName: TableName,
  userId: Id<'users'>,
  remoteId?: string
) => {
  if (!remoteId) {
    return null;
  }

  let record = null;
  try {
    record = await ctx.db.get(remoteId as Id<TableName>);
  } catch {
    return null;
  }

  if (!record || record.userId !== userId) {
    return null;
  }

  return record;
};

const getPracticeSessionBySyncKey = async (
  ctx: any,
  userId: Id<'users'>,
  syncId: string,
  remoteId?: string
) => {
  const remoteRecord = await getOwnedDocument(
    ctx,
    'practiceSessions',
    userId,
    remoteId
  );
  if (remoteRecord) {
    return remoteRecord;
  }

  return ctx.db
    .query('practiceSessions')
    .withIndex('byUserIdSyncId', (q: any) =>
      q.eq('userId', userId).eq('syncId', syncId)
    )
    .unique();
};

const getVerseProgressBySyncKey = async (
  ctx: any,
  userId: Id<'users'>,
  syncId: string,
  remoteId?: string
) => {
  const remoteRecord = await getOwnedDocument(
    ctx,
    'verseProgress',
    userId,
    remoteId
  );
  if (remoteRecord) {
    return remoteRecord;
  }

  return ctx.db
    .query('verseProgress')
    .withIndex('byUserIdSyncId', (q: any) =>
      q.eq('userId', userId).eq('syncId', syncId)
    )
    .unique();
};

const getVerseBySyncKey = async (
  ctx: any,
  userId: Id<'users'>,
  syncId: string,
  remoteId?: string
) => {
  const remoteRecord = await getOwnedDocument(ctx, 'verses', userId, remoteId);
  if (remoteRecord) {
    return remoteRecord;
  }

  return ctx.db
    .query('verses')
    .withIndex('byUserIdSyncId', (q: any) =>
      q.eq('userId', userId).eq('syncId', syncId)
    )
    .unique();
};

const getCollectionBySyncKey = async (
  ctx: any,
  userId: Id<'users'>,
  syncId: string,
  remoteId?: string
) => {
  const remoteRecord = await getOwnedDocument(
    ctx,
    'collections',
    userId,
    remoteId
  );
  if (remoteRecord) {
    return remoteRecord;
  }

  return ctx.db
    .query('collections')
    .withIndex('byUserIdSyncId', (q: any) =>
      q.eq('userId', userId).eq('syncId', syncId)
    )
    .unique();
};

const getAffirmationBySyncKey = async (
  ctx: any,
  userId: Id<'users'>,
  syncId: string,
  remoteId?: string
) => {
  const remoteRecord = await getOwnedDocument(
    ctx,
    'affirmations',
    userId,
    remoteId
  );
  if (remoteRecord) {
    return remoteRecord;
  }

  return ctx.db
    .query('affirmations')
    .withIndex('byUserIdSyncId', (q: any) =>
      q.eq('userId', userId).eq('syncId', syncId)
    )
    .unique();
};

const getNoteBySyncKey = async (
  ctx: any,
  userId: Id<'users'>,
  syncId: string,
  remoteId?: string
) => {
  const remoteRecord = await getOwnedDocument(
    ctx,
    'verseNotes',
    userId,
    remoteId
  );
  if (remoteRecord) {
    return remoteRecord;
  }

  return ctx.db
    .query('verseNotes')
    .withIndex('byUserIdSyncId', (q: any) =>
      q.eq('userId', userId).eq('syncId', syncId)
    )
    .unique();
};

export const getUserSyncSnapshot = query({
  args: {},
  handler: async ctx => {
    const user = await getCurrentUserOrThrow(ctx);

    const [
      verses,
      collections,
      notes,
      affirmations,
      practiceSessions,
      verseProgress,
      verseSuggestions,
      collectionSuggestions,
    ] =
      await Promise.all([
        ctx.db
          .query('verses')
          .withIndex('byUserId', q => q.eq('userId', user._id))
          .collect(),
        ctx.db
          .query('collections')
          .withIndex('byUserId', q => q.eq('userId', user._id))
          .collect(),
        ctx.db
          .query('verseNotes')
          .withIndex('byUserId', q => q.eq('userId', user._id))
          .collect(),
        ctx.db
          .query('affirmations')
          .withIndex('byUserId', q => q.eq('userId', user._id))
          .collect(),
        ctx.db
          .query('practiceSessions')
          .withIndex('byUserId', q => q.eq('userId', user._id))
          .collect(),
        ctx.db
          .query('verseProgress')
          .withIndex('byUserId', q => q.eq('userId', user._id))
          .collect(),
        ctx.db.query('versesSuggestions').order('desc').take(20),
        ctx.db.query('collectionSuggestions').order('desc').take(20),
      ]);

    const verseMap = new Map(
      verses.map(record => [String(record._id), mapVerse(record)])
    );

    return {
      user: {
        clerkId: user.clerkId,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        imageUrl: user.imageUrl,
      },
      verses: verses.map(mapVerse),
      collections: collections.map(mapCollection),
      notes: notes
        .map(note => {
          const verse = verseMap.get(String(note.verseId));
          if (!verse) {
            return null;
          }

          return {
            syncId: note.syncId ?? String(note._id),
            remoteId: String(note._id),
            verseSyncId: verse.syncId,
            content: note.content,
            updatedAt: note.updatedAt ?? note._creationTime,
            deletedAt: note.deletedAt ?? null,
          };
        })
        .filter(Boolean),
      affirmations: affirmations.map(mapAffirmation),
      practiceSessions: practiceSessions.map(mapPracticeSession),
      verseProgress: verseProgress.map(mapVerseProgress),
      verseSuggestions: verseSuggestions.map(suggestion => ({
        syncId: String(suggestion._id),
        remoteId: String(suggestion._id),
        bookName: suggestion.bookName,
        chapter: suggestion.chapter,
        verses: suggestion.verses,
        verseTexts: suggestion.verseTexts,
        reviewFreq: suggestion.reviewFreq,
      })),
      collectionSuggestions: collectionSuggestions.map(suggestion => ({
        syncId: String(suggestion._id),
        remoteId: String(suggestion._id),
        collectionName: suggestion.collectionName,
        versesLength: suggestion.versesLength,
        collectionVerses: suggestion.collectionVerses,
      })),
      syncedAt: Date.now(),
    };
  },
});

export const upsertVerseSync = mutation({
  args: {
    operation: queueOperationValidator,
  },
  handler: async (ctx, { operation }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const payload = operation.payload as {
      syncId: string;
      remoteId?: string;
      bookName: string;
      chapter: number;
      verses: string[];
      verseTexts: { verse: string; text: string }[];
      reviewFreq: string;
      isFeatured?: boolean;
      importSource?: {
        provider: 'bible.com' | 'unknown';
        channel: 'paste' | 'nativeShare' | 'webShareTarget';
        version: string | null;
        sourceUrl: string | null;
        sharedText: string;
        textFidelity?: 'exactImported' | 'offlineFallback';
      };
      updatedAt: number;
      deletedAt?: number | null;
    };

    const existing = await getVerseBySyncKey(
      ctx,
      user._id,
      operation.syncId,
      payload.remoteId
    );

    if (operation.action === 'delete' || payload.deletedAt) {
      if (existing) {
        const notes = await ctx.db
          .query('verseNotes')
          .withIndex('byVerseId', q => q.eq('verseId', existing._id))
          .collect();

        await Promise.all(notes.map(note => ctx.db.delete(note._id)));
        await ctx.db.delete(existing._id);
      }

      return {
        syncId: operation.syncId,
        remoteId: existing ? String(existing._id) : payload.remoteId,
      };
    }

    if (payload.isFeatured) {
      const featuredVerses = await ctx.db
        .query('verses')
        .withIndex('byUserId', q => q.eq('userId', user._id))
        .collect();

      await Promise.all(
        featuredVerses
          .filter(record => record._id !== existing?._id && record.isFeatured)
          .map(record => ctx.db.patch(record._id, { isFeatured: false }))
      );
    }

    const nextRecord = {
      userId: user._id,
      syncId: operation.syncId,
      bookName: payload.bookName,
      chapter: payload.chapter,
      verses: payload.verses,
      verseTexts: payload.verseTexts,
      reviewFreq: payload.reviewFreq,
      isFeatured: payload.isFeatured ?? false,
      importSource: payload.importSource,
      updatedAt: payload.updatedAt,
    };

    if (existing) {
      await ctx.db.patch(existing._id, nextRecord);
      return { syncId: operation.syncId, remoteId: String(existing._id) };
    }

    const remoteId = await ctx.db.insert('verses', nextRecord as any);
    return { syncId: operation.syncId, remoteId: String(remoteId) };
  },
});

export const upsertCollectionSync = mutation({
  args: {
    operation: queueOperationValidator,
  },
  handler: async (ctx, { operation }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const payload = operation.payload as {
      remoteId?: string;
      collectionName: string;
      collectionVerses: Array<{
        bookName: string;
        chapter: number;
        verses: string[];
        reviewFreq: string;
        verseTexts: { verse: string; text: string }[];
        importSource?: {
          provider: 'bible.com' | 'unknown';
          channel: 'paste' | 'nativeShare' | 'webShareTarget';
          version: string | null;
          sourceUrl: string | null;
          sharedText: string;
          textFidelity?: 'exactImported' | 'offlineFallback';
        };
      }>;
      updatedAt: number;
      deletedAt?: number | null;
    };

    const existing = await getCollectionBySyncKey(
      ctx,
      user._id,
      operation.syncId,
      payload.remoteId
    );

    if (operation.action === 'delete' || payload.deletedAt) {
      if (existing) {
        await ctx.db.delete(existing._id);
      }

      return {
        syncId: operation.syncId,
        remoteId: existing ? String(existing._id) : payload.remoteId,
      };
    }

    const nextRecord = {
      userId: user._id,
      syncId: operation.syncId,
      collectionName: payload.collectionName,
      versesLength: payload.collectionVerses.length,
      collectionVerses: payload.collectionVerses,
      updatedAt: payload.updatedAt,
    };

    if (existing) {
      await ctx.db.patch(existing._id, nextRecord as any);
      return { syncId: operation.syncId, remoteId: String(existing._id) };
    }

    const remoteId = await ctx.db.insert('collections', nextRecord as any);
    return { syncId: operation.syncId, remoteId: String(remoteId) };
  },
});

export const upsertAffirmationSync = mutation({
  args: {
    operation: queueOperationValidator,
  },
  handler: async (ctx, { operation }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const payload = operation.payload as {
      remoteId?: string;
      content: string;
      createdAt: number;
      updatedAt: number;
      deletedAt?: number | null;
    };

    const existing = await getAffirmationBySyncKey(
      ctx,
      user._id,
      operation.syncId,
      payload.remoteId
    );

    if (operation.action === 'delete' || payload.deletedAt) {
      if (existing) {
        await ctx.db.delete(existing._id);
      }

      return {
        syncId: operation.syncId,
        remoteId: existing ? String(existing._id) : payload.remoteId,
      };
    }

    const nextRecord = {
      userId: user._id,
      syncId: operation.syncId,
      content: payload.content,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
    };

    if (existing) {
      await ctx.db.patch(existing._id, nextRecord as any);
      return { syncId: operation.syncId, remoteId: String(existing._id) };
    }

    const remoteId = await ctx.db.insert('affirmations', nextRecord as any);
    return { syncId: operation.syncId, remoteId: String(remoteId) };
  },
});

export const upsertNoteSync = mutation({
  args: {
    operation: queueOperationValidator,
  },
  handler: async (ctx, { operation }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const payload = operation.payload as {
      verseSyncId: string;
      verseRemoteId?: string;
      remoteId?: string;
      content: string;
      updatedAt: number;
      deletedAt?: number | null;
    };

    const existing = await getNoteBySyncKey(
      ctx,
      user._id,
      operation.syncId,
      payload.remoteId
    );

    if (operation.action === 'delete' || payload.deletedAt) {
      if (existing) {
        await ctx.db.delete(existing._id);
      }

      return {
        syncId: operation.syncId,
        remoteId: existing ? String(existing._id) : payload.remoteId,
      };
    }

    const verse = await getVerseBySyncKey(
      ctx,
      user._id,
      payload.verseSyncId,
      payload.verseRemoteId
    );

    if (!verse) {
      throw new Error('Verse must be synced before its note can be synced.');
    }

    if (existing) {
      await ctx.db.patch(existing._id, {
        syncId: operation.syncId,
        verseId: verse._id,
        content: payload.content,
        updatedAt: payload.updatedAt,
      } as any);
      return { syncId: operation.syncId, remoteId: String(existing._id) };
    }

    const remoteId = await ctx.db.insert('verseNotes', {
      userId: user._id,
      syncId: operation.syncId,
      verseId: verse._id,
      content: payload.content,
      updatedAt: payload.updatedAt,
    } as any);

    return { syncId: operation.syncId, remoteId: String(remoteId) };
  },
});

export const upsertPracticeSessionSync = mutation({
  args: {
    operation: queueOperationValidator,
  },
  handler: async (ctx, { operation }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const payload = operation.payload as {
      remoteId?: string;
      method: 'flashcards' | 'fillInBlanks' | 'recitation';
      practiceType: 'verses' | 'collections';
      source?: 'verseDetail' | 'smartQueue' | 'manualTechnique';
      verseKeys: string[];
      verseCount: number;
      passedVerseKeys?: string[];
      needsReviewVerseKeys?: string[];
      completedAt: number;
      updatedAt: number;
      deletedAt?: number | null;
    };

    const existing = await getPracticeSessionBySyncKey(
      ctx,
      user._id,
      operation.syncId,
      payload.remoteId
    );

    if (operation.action === 'delete' || payload.deletedAt) {
      if (existing) {
        await ctx.db.delete(existing._id);
      }

      return {
        syncId: operation.syncId,
        remoteId: existing ? String(existing._id) : payload.remoteId,
      };
    }

    const nextRecord = {
      userId: user._id,
      syncId: operation.syncId,
      method: payload.method,
      practiceType: payload.practiceType,
      source: payload.source ?? 'manualTechnique',
      verseKeys: payload.verseKeys,
      verseCount: payload.verseCount,
      passedVerseKeys: payload.passedVerseKeys ?? [],
      needsReviewVerseKeys: payload.needsReviewVerseKeys ?? [],
      completedAt: payload.completedAt,
      updatedAt: payload.updatedAt,
    };

    if (existing) {
      await ctx.db.patch(existing._id, nextRecord as any);
      return { syncId: operation.syncId, remoteId: String(existing._id) };
    }

    const remoteId = await ctx.db.insert('practiceSessions', nextRecord as any);
    return { syncId: operation.syncId, remoteId: String(remoteId) };
  },
});

export const upsertVerseProgressSync = mutation({
  args: {
    operation: queueOperationValidator,
  },
  handler: async (ctx, { operation }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const payload = operation.payload as {
      remoteId?: string;
      verseKey: string;
      totalCompletionCount: number;
      flashcardsCount: number;
      fillInBlanksCount: number;
      recitationCount: number;
      lastPracticedAt: number;
      status?: 'new' | 'learning' | 'strengthening' | 'mastered';
      nextMethod?: 'flashcards' | 'fillInBlanks' | 'recitation';
      dueAt?: number;
      successfulReviewCount?: number;
      lastOutcome?: 'pass' | 'needsReview';
      lastFlashcardsAt?: number;
      lastFillInBlanksAt?: number;
      lastRecitationAt?: number;
      updatedAt: number;
      deletedAt?: number | null;
    };

    const existing = await getVerseProgressBySyncKey(
      ctx,
      user._id,
      operation.syncId,
      payload.remoteId
    );

    if (operation.action === 'delete' || payload.deletedAt) {
      if (existing) {
        await ctx.db.delete(existing._id);
      }

      return {
        syncId: operation.syncId,
        remoteId: existing ? String(existing._id) : payload.remoteId,
      };
    }

    const nextRecord = {
      userId: user._id,
      syncId: operation.syncId,
      verseKey: payload.verseKey,
      totalCompletionCount: payload.totalCompletionCount,
      flashcardsCount: payload.flashcardsCount,
      fillInBlanksCount: payload.fillInBlanksCount,
      recitationCount: payload.recitationCount,
      lastPracticedAt: payload.lastPracticedAt,
      status: payload.status,
      nextMethod: payload.nextMethod,
      dueAt: payload.dueAt,
      successfulReviewCount: payload.successfulReviewCount,
      lastOutcome: payload.lastOutcome,
      lastFlashcardsAt: payload.lastFlashcardsAt,
      lastFillInBlanksAt: payload.lastFillInBlanksAt,
      lastRecitationAt: payload.lastRecitationAt,
      updatedAt: payload.updatedAt,
    };

    if (existing) {
      await ctx.db.patch(existing._id, nextRecord as any);
      return { syncId: operation.syncId, remoteId: String(existing._id) };
    }

    const remoteId = await ctx.db.insert('verseProgress', nextRecord as any);
    return { syncId: operation.syncId, remoteId: String(remoteId) };
  },
});
