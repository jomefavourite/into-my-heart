import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  applyPracticeOutcomeToProgress,
  getMemorizationVerseKey,
  normalizeVerseProgress,
} from '@/lib/memorization';
import { PlatformStorage } from '@/utils/PlatformStorage';
import {
  createSyncId,
  isDeletedRecord,
  sortByUpdatedAtDesc,
  type CollectionVerseEntry,
  type OfflineAffirmation,
  type OfflineCollection,
  type OfflineCollectionSuggestion,
  type OfflineNote,
  type OfflinePracticeSession,
  type OfflineUserProfile,
  type OfflineVerse,
  type OfflineVerseProgress,
  type OfflineVerseSuggestion,
  type PracticeOutcome,
  type PracticeMethod,
  type PracticeSessionSource,
  type PracticeType,
  type SyncEntityType,
  type SyncPayload,
  type SyncQueueOperation,
  type VerseImportSource,
  type VerseTextEntry,
} from '@/lib/offline-sync';

type SaveVerseInput = {
  syncId?: string;
  remoteId?: string;
  bookName: string;
  chapter: number;
  verses: string[];
  verseTexts: VerseTextEntry[];
  reviewFreq: string;
  isFeatured?: boolean;
  importSource?: VerseImportSource;
};

type SaveCollectionInput = {
  syncId?: string;
  remoteId?: string;
  collectionName: string;
  collectionVerses: CollectionVerseEntry[];
};

type SaveAffirmationInput = {
  syncId?: string;
  remoteId?: string;
  content: string;
};

type SaveNoteInput = {
  syncId?: string;
  remoteId?: string;
  verseSyncId: string;
  content: string;
};

type RecordPracticeSessionInput = {
  method: PracticeMethod;
  practiceType: PracticeType;
  source: PracticeSessionSource;
  verses: Array<{
    bookName: string;
    chapter: number;
    verses: string[];
    reviewFreq?: string;
    _id?: string;
  }>;
  outcomesByVerseKey?: Record<string, PracticeOutcome>;
};

type OfflineDataStore = {
  hasHydrated: boolean;
  currentUser: OfflineUserProfile | null;
  verses: OfflineVerse[];
  collections: OfflineCollection[];
  notes: OfflineNote[];
  affirmations: OfflineAffirmation[];
  practiceSessions: OfflinePracticeSession[];
  verseProgress: OfflineVerseProgress[];
  verseSuggestions: OfflineVerseSuggestion[];
  collectionSuggestions: OfflineCollectionSuggestion[];
  queue: SyncQueueOperation[];
  hasCompletedInitialSync: boolean;
  isSyncing: boolean;
  syncTick: number;
  lastSyncedAt: number | null;
  lastSyncError: string | null;
  setHasHydrated: (hasHydrated: boolean) => void;
  setSyncing: (isSyncing: boolean) => void;
  setSyncError: (message: string | null) => void;
  requestSync: () => void;
  clearOfflineData: () => void;
  applyRemoteSnapshot: (payload: SyncPayload) => void;
  saveVerseLocal: (input: SaveVerseInput) => string;
  deleteVerseLocal: (syncId: string) => void;
  toggleFeaturedVerseLocal: (syncId: string, isFeatured: boolean) => void;
  saveCollectionLocal: (input: SaveCollectionInput) => string;
  deleteCollectionLocal: (syncId: string) => void;
  saveAffirmationLocal: (input: SaveAffirmationInput) => string;
  deleteAffirmationLocal: (syncId: string) => void;
  saveNoteLocal: (input: SaveNoteInput) => string;
  deleteNoteLocal: (syncId: string) => void;
  recordPracticeSessionLocal: (input: RecordPracticeSessionInput) => string | null;
  adoptVerseSuggestionLocal: (suggestionSyncId: string) => string | null;
  adoptCollectionSuggestionLocal: (suggestionSyncId: string) => string | null;
  markOperationSynced: (
    entityType: SyncEntityType,
    syncId: string,
    remoteId?: string
  ) => void;
};

const upsertArrayRecord = <T extends { syncId: string }>(
  items: T[],
  nextRecord: T
) => {
  const existingIndex = items.findIndex(item => item.syncId === nextRecord.syncId);
  if (existingIndex === -1) {
    return [...items, nextRecord];
  }

  const nextItems = [...items];
  nextItems[existingIndex] = nextRecord;
  return nextItems;
};

const enqueueOperation = (
  queue: SyncQueueOperation[],
  entityType: SyncEntityType,
  action: 'upsert' | 'delete',
  syncId: string,
  payload: Record<string, unknown>
) => {
  const operation: SyncQueueOperation = {
    id: createSyncId('op'),
    entityType,
    action,
    syncId,
    payload,
    createdAt: Date.now(),
  };

  return [
    ...queue.filter(
      item => !(item.entityType === entityType && item.syncId === syncId)
    ),
    operation,
  ];
};

const mergeRemoteRecords = <
  T extends {
    syncId: string;
    updatedAt: number;
    pendingSync?: boolean;
    remoteId?: string;
    deletedAt?: number | null;
  },
>(
  localRecords: T[] = [],
  remoteRecords: T[] = []
) => {
  const localMap = new Map(localRecords.map(record => [record.syncId, record]));

  remoteRecords.forEach(remoteRecord => {
    const localRecord = localMap.get(remoteRecord.syncId);
    if (
      localRecord &&
      localRecord.pendingSync &&
      localRecord.updatedAt >= remoteRecord.updatedAt
    ) {
      return;
    }

    localMap.set(remoteRecord.syncId, {
      ...localRecord,
      ...remoteRecord,
      pendingSync: false,
      lastSyncedAt: Date.now(),
    });
  });

  return [...localMap.values()];
};

const normalizeRemoteRecords = <T>(records: T[] | null | undefined) =>
  Array.isArray(records) ? records : [];

export const useOfflineDataStore = create<OfflineDataStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      hasHydrated: false,
      verses: [],
      collections: [],
      notes: [],
      affirmations: [],
      practiceSessions: [],
      verseProgress: [],
      verseSuggestions: [],
      collectionSuggestions: [],
      queue: [],
      hasCompletedInitialSync: false,
      isSyncing: false,
      syncTick: 0,
      lastSyncedAt: null,
      lastSyncError: null,
      setHasHydrated: hasHydrated => set({ hasHydrated }),
      setSyncing: isSyncing => set({ isSyncing }),
      setSyncError: lastSyncError => set({ lastSyncError }),
      requestSync: () =>
        set(state => ({
          syncTick: state.syncTick + 1,
        })),
      clearOfflineData: () =>
        set(state => ({
          currentUser: null,
          verses: [],
          collections: [],
          notes: [],
          affirmations: [],
          practiceSessions: [],
          verseProgress: [],
          verseSuggestions: [],
          collectionSuggestions: [],
          queue: [],
          hasCompletedInitialSync: false,
          isSyncing: false,
          syncTick: state.syncTick + 1,
          lastSyncedAt: null,
          lastSyncError: null,
        })),
      applyRemoteSnapshot: payload =>
        set(state => {
          const now = Date.now();
          const verses = normalizeRemoteRecords(payload.verses);
          const collections = normalizeRemoteRecords(payload.collections);
          const notes = normalizeRemoteRecords(payload.notes);
          const affirmations = normalizeRemoteRecords(payload.affirmations);
          const practiceSessions = normalizeRemoteRecords(
            payload.practiceSessions
          ).map(record => ({
            ...record,
            source: record.source ?? 'manualTechnique',
            passedVerseKeys: record.passedVerseKeys ?? [],
            needsReviewVerseKeys: record.needsReviewVerseKeys ?? [],
          }));
          const verseProgress = normalizeRemoteRecords(payload.verseProgress).map(
            record => normalizeVerseProgress(record, now)
          );
          const verseSuggestions = normalizeRemoteRecords(
            payload.verseSuggestions
          );
          const collectionSuggestions = normalizeRemoteRecords(
            payload.collectionSuggestions
          );

          return {
            currentUser: payload.user ?? null,
            verses: sortByUpdatedAtDesc(
              mergeRemoteRecords(state.verses, verses).filter(
                record => !isDeletedRecord(record)
              )
            ),
            collections: sortByUpdatedAtDesc(
              mergeRemoteRecords(state.collections, collections).filter(
                record => !isDeletedRecord(record)
              )
            ),
            notes: sortByUpdatedAtDesc(
              mergeRemoteRecords(state.notes, notes).filter(
                record => !isDeletedRecord(record)
              )
            ),
            affirmations: sortByUpdatedAtDesc(
              mergeRemoteRecords(state.affirmations, affirmations).filter(
                record => !isDeletedRecord(record)
              )
            ),
            practiceSessions: sortByUpdatedAtDesc(
              mergeRemoteRecords(state.practiceSessions, practiceSessions).filter(
                record => !isDeletedRecord(record)
              )
            ),
            verseProgress: sortByUpdatedAtDesc(
              mergeRemoteRecords(state.verseProgress, verseProgress)
                .filter(record => !isDeletedRecord(record))
                .map(record => normalizeVerseProgress(record, now))
            ),
            verseSuggestions,
            collectionSuggestions,
            hasCompletedInitialSync: true,
            lastSyncedAt: payload.syncedAt ?? now,
            lastSyncError: null,
          };
        }),
      saveVerseLocal: input => {
        const now = Date.now();
        const syncId = input.syncId ?? createSyncId('verse');
        const existingRecord = input.syncId
          ? get().verses.find(record => record.syncId === input.syncId)
          : null;
        const nextRecord: OfflineVerse = {
          syncId,
          remoteId: input.remoteId,
          bookName: input.bookName,
          chapter: input.chapter,
          verses: input.verses,
          verseTexts: input.verseTexts,
          reviewFreq: input.reviewFreq,
          isFeatured: input.isFeatured ?? false,
          importSource: input.importSource ?? existingRecord?.importSource,
          updatedAt: now,
          deletedAt: null,
          pendingSync: true,
        };

        set(state => {
          const nextVerses = state.verses
            .map(record =>
              nextRecord.isFeatured ? { ...record, isFeatured: false } : record
            )
            .filter(record => record.syncId !== syncId);

          return {
            verses: sortByUpdatedAtDesc([...nextVerses, nextRecord]),
            queue: enqueueOperation(state.queue, 'verse', 'upsert', syncId, nextRecord),
            syncTick: state.syncTick + 1,
            lastSyncError: null,
          };
        });

        return syncId;
      },
      deleteVerseLocal: syncId =>
        set(state => {
          const existing = state.verses.find(record => record.syncId === syncId);
          if (!existing) {
            return state;
          }

          const deletedAt = Date.now();
          const nextRecord = {
            ...existing,
            deletedAt,
            updatedAt: deletedAt,
            pendingSync: true,
          };

          const relatedNotes = state.notes.filter(note => note.verseSyncId === syncId);
          const nextQueue = enqueueOperation(state.queue, 'verse', 'delete', syncId, {
            syncId,
            remoteId: existing.remoteId,
            deletedAt,
          });

          return {
            verses: existing.remoteId
              ? sortByUpdatedAtDesc(
                  upsertArrayRecord(state.verses, nextRecord as OfflineVerse)
                )
              : state.verses.filter(record => record.syncId !== syncId),
            notes: state.notes.filter(note => note.verseSyncId !== syncId),
            queue: relatedNotes.reduce(
              (queue, note) =>
                enqueueOperation(queue, 'note', 'delete', note.syncId, {
                  syncId: note.syncId,
                  remoteId: note.remoteId,
                  deletedAt,
                }),
              nextQueue
            ),
            syncTick: state.syncTick + 1,
            lastSyncError: null,
          };
        }),
      toggleFeaturedVerseLocal: (syncId, isFeatured) =>
        set(state => {
          const now = Date.now();
          const nextVerses = state.verses.map(record => {
            if (record.syncId === syncId) {
              return {
                ...record,
                isFeatured,
                updatedAt: now,
                pendingSync: true,
              };
            }

            if (isFeatured && record.isFeatured) {
              return {
                ...record,
                isFeatured: false,
                updatedAt: now,
                pendingSync: true,
              };
            }

            return record;
          });

          const affectedVerses = nextVerses.filter(
            record =>
              record.pendingSync &&
              (record.syncId === syncId || (isFeatured && record.isFeatured === false))
          );

          return {
            verses: sortByUpdatedAtDesc(nextVerses),
            queue: affectedVerses.reduce(
              (queue, record) =>
                enqueueOperation(queue, 'verse', 'upsert', record.syncId, record),
              state.queue
            ),
            syncTick: state.syncTick + 1,
            lastSyncError: null,
          };
        }),
      saveCollectionLocal: input => {
        const now = Date.now();
        const syncId = input.syncId ?? createSyncId('collection');
        const nextRecord: OfflineCollection = {
          syncId,
          remoteId: input.remoteId,
          collectionName: input.collectionName,
          versesLength: input.collectionVerses.length,
          collectionVerses: input.collectionVerses,
          updatedAt: now,
          deletedAt: null,
          pendingSync: true,
        };

        set(state => ({
          collections: sortByUpdatedAtDesc(
            upsertArrayRecord(state.collections, nextRecord)
          ),
          queue: enqueueOperation(
            state.queue,
            'collection',
            'upsert',
            syncId,
            nextRecord
          ),
          syncTick: state.syncTick + 1,
          lastSyncError: null,
        }));

        return syncId;
      },
      deleteCollectionLocal: syncId =>
        set(state => {
          const existing = state.collections.find(
            record => record.syncId === syncId
          );
          if (!existing) {
            return state;
          }

          const deletedAt = Date.now();
          const nextRecord = {
            ...existing,
            deletedAt,
            updatedAt: deletedAt,
            pendingSync: true,
          };

          return {
            collections: existing.remoteId
              ? sortByUpdatedAtDesc(
                  upsertArrayRecord(
                    state.collections,
                    nextRecord as OfflineCollection
                  )
                )
              : state.collections.filter(record => record.syncId !== syncId),
            queue: enqueueOperation(state.queue, 'collection', 'delete', syncId, {
              syncId,
              remoteId: existing.remoteId,
              deletedAt,
            }),
            syncTick: state.syncTick + 1,
            lastSyncError: null,
          };
        }),
      saveAffirmationLocal: input => {
        const now = Date.now();
        const existing = input.syncId
          ? get().affirmations.find(item => item.syncId === input.syncId)
          : null;
        const syncId = input.syncId ?? createSyncId('affirmation');
        const nextRecord: OfflineAffirmation = {
          syncId,
          remoteId: input.remoteId,
          content: input.content,
          createdAt: existing?.createdAt ?? now,
          updatedAt: now,
          deletedAt: null,
          pendingSync: true,
        };

        set(state => ({
          affirmations: sortByUpdatedAtDesc(
            upsertArrayRecord(state.affirmations, nextRecord)
          ),
          queue: enqueueOperation(
            state.queue,
            'affirmation',
            'upsert',
            syncId,
            nextRecord
          ),
          syncTick: state.syncTick + 1,
          lastSyncError: null,
        }));

        return syncId;
      },
      deleteAffirmationLocal: syncId =>
        set(state => {
          const existing = state.affirmations.find(
            record => record.syncId === syncId
          );
          if (!existing) {
            return state;
          }

          const deletedAt = Date.now();
          const nextRecord = {
            ...existing,
            deletedAt,
            updatedAt: deletedAt,
            pendingSync: true,
          };

          return {
            affirmations: existing.remoteId
              ? sortByUpdatedAtDesc(
                  upsertArrayRecord(
                    state.affirmations,
                    nextRecord as OfflineAffirmation
                  )
                )
              : state.affirmations.filter(record => record.syncId !== syncId),
            queue: enqueueOperation(
              state.queue,
              'affirmation',
              'delete',
              syncId,
              {
                syncId,
                remoteId: existing.remoteId,
                deletedAt,
              }
            ),
            syncTick: state.syncTick + 1,
            lastSyncError: null,
          };
        }),
      saveNoteLocal: input => {
        const now = Date.now();
        const verse = get().verses.find(item => item.syncId === input.verseSyncId);
        const existing =
          input.syncId != null
            ? get().notes.find(item => item.syncId === input.syncId)
            : get().notes.find(item => item.verseSyncId === input.verseSyncId);
        const syncId = existing?.syncId ?? input.syncId ?? createSyncId('note');
        const nextRecord: OfflineNote = {
          syncId,
          remoteId: input.remoteId ?? existing?.remoteId,
          verseSyncId: input.verseSyncId,
          content: input.content,
          updatedAt: now,
          deletedAt: null,
          pendingSync: true,
        };

        set(state => ({
          notes: sortByUpdatedAtDesc(upsertArrayRecord(state.notes, nextRecord)),
          queue: enqueueOperation(state.queue, 'note', 'upsert', syncId, {
            ...nextRecord,
            verseRemoteId: verse?.remoteId,
          }),
          syncTick: state.syncTick + 1,
          lastSyncError: null,
        }));

        return syncId;
      },
      deleteNoteLocal: syncId =>
        set(state => {
          const existing = state.notes.find(record => record.syncId === syncId);
          if (!existing) {
            return state;
          }

          const deletedAt = Date.now();
          const nextRecord = {
            ...existing,
            deletedAt,
            updatedAt: deletedAt,
            pendingSync: true,
          };

          return {
            notes: existing.remoteId
              ? sortByUpdatedAtDesc(
                  upsertArrayRecord(state.notes, nextRecord as OfflineNote)
                )
              : state.notes.filter(record => record.syncId !== syncId),
            queue: enqueueOperation(state.queue, 'note', 'delete', syncId, {
              syncId,
              remoteId: existing.remoteId,
              deletedAt,
            }),
            syncTick: state.syncTick + 1,
            lastSyncError: null,
          };
        }),
      recordPracticeSessionLocal: input => {
        if (input.verses.length === 0) {
          return null;
        }

        const now = Date.now();
        const verseEntries = input.verses.map(verse => {
          const verseKey = getMemorizationVerseKey(verse);
          return {
            verse,
            verseKey,
            outcome: input.outcomesByVerseKey?.[verseKey] ?? 'pass',
          };
        });
        const verseKeys = verseEntries.map(entry => entry.verseKey);
        const sessionSyncId = createSyncId('practice-session');
        const passedVerseKeys = verseEntries
          .filter(entry => entry.outcome === 'pass')
          .map(entry => entry.verseKey);
        const needsReviewVerseKeys = verseEntries
          .filter(entry => entry.outcome === 'needsReview')
          .map(entry => entry.verseKey);
        const practiceSession: OfflinePracticeSession = {
          syncId: sessionSyncId,
          method: input.method,
          practiceType: input.practiceType,
          source: input.source,
          verseKeys,
          verseCount: verseKeys.length,
          passedVerseKeys,
          needsReviewVerseKeys,
          completedAt: now,
          updatedAt: now,
          pendingSync: true,
        };

        set(state => {
          const nextPracticeSessions = sortByUpdatedAtDesc([
            practiceSession,
            ...state.practiceSessions,
          ]);

          const nextVerseProgress = [...state.verseProgress];
          let nextQueue = enqueueOperation(
            state.queue,
            'practiceSession',
            'upsert',
            sessionSyncId,
            practiceSession
          );

          verseEntries.forEach(({ verse, verseKey, outcome }) => {
            const existingIndex = nextVerseProgress.findIndex(
              record => record.verseKey === verseKey
            );
            const existingRecord =
              existingIndex === -1 ? null : nextVerseProgress[existingIndex];
            const nextRecord: OfflineVerseProgress = {
              ...applyPracticeOutcomeToProgress({
                currentProgress: existingRecord,
                verse,
                method: input.method,
                outcome,
                now,
              }),
              syncId: existingRecord?.syncId ?? `verse-progress-${verseKey}`,
              remoteId: existingRecord?.remoteId,
              deletedAt: null,
              pendingSync: true,
            };

            if (existingIndex === -1) {
              nextVerseProgress.push(nextRecord);
            } else {
              nextVerseProgress[existingIndex] = nextRecord;
            }

            nextQueue = enqueueOperation(
              nextQueue,
              'verseProgress',
              'upsert',
              nextRecord.syncId,
              nextRecord
            );
          });

          return {
            practiceSessions: nextPracticeSessions,
            verseProgress: sortByUpdatedAtDesc(nextVerseProgress),
            queue: nextQueue,
            syncTick: state.syncTick + 1,
            lastSyncError: null,
          };
        });

        return sessionSyncId;
      },
      adoptVerseSuggestionLocal: suggestionSyncId => {
        const suggestion = get().verseSuggestions.find(
          item => item.syncId === suggestionSyncId
        );
        if (!suggestion) {
          return null;
        }

        const syncId = get().saveVerseLocal({
          bookName: suggestion.bookName,
          chapter: suggestion.chapter,
          verses: suggestion.verses,
          verseTexts: suggestion.verseTexts,
          reviewFreq: suggestion.reviewFreq,
        });

        set(state => ({
          verseSuggestions: state.verseSuggestions.filter(
            item => item.syncId !== suggestionSyncId
          ),
        }));

        return syncId;
      },
      adoptCollectionSuggestionLocal: suggestionSyncId => {
        const suggestion = get().collectionSuggestions.find(
          item => item.syncId === suggestionSyncId
        );
        if (!suggestion) {
          return null;
        }

        const syncId = get().saveCollectionLocal({
          collectionName: suggestion.collectionName,
          collectionVerses: suggestion.collectionVerses,
        });

        set(state => ({
          collectionSuggestions: state.collectionSuggestions.filter(
            item => item.syncId !== suggestionSyncId
          ),
        }));

        return syncId;
      },
      markOperationSynced: (entityType, syncId, remoteId) =>
        set(state => {
          const syncedAt = Date.now();

          const markArray = <T extends { syncId: string; remoteId?: string; deletedAt?: number | null }>(
            records: T[]
          ) =>
            records
              .map(record =>
                record.syncId === syncId
                  ? {
                      ...record,
                      remoteId: remoteId ?? record.remoteId,
                      pendingSync: false,
                      lastSyncedAt: syncedAt,
                    }
                  : record
              )
              .filter(record => !isDeletedRecord(record));

          return {
            verses:
              entityType === 'verse' ? markArray(state.verses) : state.verses,
            collections:
              entityType === 'collection'
                ? markArray(state.collections)
                : state.collections,
            notes: entityType === 'note' ? markArray(state.notes) : state.notes,
            affirmations:
              entityType === 'affirmation'
                ? markArray(state.affirmations)
                : state.affirmations,
            practiceSessions:
              entityType === 'practiceSession'
                ? markArray(state.practiceSessions)
                : state.practiceSessions,
            verseProgress:
              entityType === 'verseProgress'
                ? markArray(state.verseProgress)
                : state.verseProgress,
            queue: state.queue.filter(
              item => !(item.entityType === entityType && item.syncId === syncId)
            ),
            lastSyncedAt: syncedAt,
            lastSyncError: null,
          };
        }),
    }),
    {
      name: 'offline-data-store',
      storage: createJSONStorage(() => PlatformStorage),
      partialize: state => ({
        currentUser: state.currentUser,
        verses: state.verses,
        collections: state.collections,
        notes: state.notes,
        affirmations: state.affirmations,
        practiceSessions: state.practiceSessions,
        verseProgress: state.verseProgress,
        verseSuggestions: state.verseSuggestions,
        collectionSuggestions: state.collectionSuggestions,
        queue: state.queue,
        hasCompletedInitialSync: state.hasCompletedInitialSync,
        lastSyncedAt: state.lastSyncedAt,
        lastSyncError: state.lastSyncError,
      }),
      version: 1,
      onRehydrateStorage: () => state => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
