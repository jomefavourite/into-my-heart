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
    v.literal('note')
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

const getOwnedDocument = async <TableName extends 'verses' | 'collections' | 'affirmations' | 'verseNotes'>(
  ctx: any,
  _tableName: TableName,
  userId: Id<'users'>,
  remoteId?: string
) => {
  if (!remoteId) {
    return null;
  }

  const record = await ctx.db.get(remoteId as Id<TableName>);
  if (!record || record.userId !== userId) {
    return null;
  }

  return record;
};

const getVerseBySyncKey = async (
  ctx: any,
  userId: Id<'users'>,
  syncId: string,
  remoteId?: string
) => {
  const remoteRecord =
    (await getOwnedDocument(ctx, 'verses', userId, remoteId)) ??
    (await getOwnedDocument(ctx, 'verses', userId, syncId));
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
  const remoteRecord =
    (await getOwnedDocument(ctx, 'collections', userId, remoteId)) ??
    (await getOwnedDocument(ctx, 'collections', userId, syncId));
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
  const remoteRecord =
    (await getOwnedDocument(ctx, 'affirmations', userId, remoteId)) ??
    (await getOwnedDocument(ctx, 'affirmations', userId, syncId));
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
  const remoteRecord =
    (await getOwnedDocument(ctx, 'verseNotes', userId, remoteId)) ??
    (await getOwnedDocument(ctx, 'verseNotes', userId, syncId));
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

    const [verses, collections, notes, affirmations, verseSuggestions, collectionSuggestions] =
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
