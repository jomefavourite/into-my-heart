import { useMemo } from 'react';
import { normalizeVerseProgress } from '@/lib/memorization';
import { useShallow } from 'zustand/react/shallow';
import { useOfflineDataStore } from '@/store/offlineDataStore';
import { sortByUpdatedAtDesc } from '@/lib/offline-sync';

export const useOfflineSyncStatus = () =>
  useOfflineDataStore(
    useShallow(state => ({
      hasHydrated: state.hasHydrated,
      currentUser: state.currentUser,
      hasCompletedInitialSync: state.hasCompletedInitialSync,
      isSyncing: state.isSyncing,
      lastSyncedAt: state.lastSyncedAt,
      lastSyncError: state.lastSyncError,
      pendingOperations: state.queue.length,
      completedPracticeSessions: state.practiceSessions.length,
    }))
  );

export const useOfflineVerses = (limit?: number) => {
  const verses = useOfflineDataStore(state => state.verses);
  return useMemo(
    () => (limit ? sortByUpdatedAtDesc(verses).slice(0, limit) : sortByUpdatedAtDesc(verses)),
    [limit, verses]
  );
};

export const useOfflineVerse = (syncId?: string | string[]) => {
  const verses = useOfflineDataStore(state => state.verses);
  const normalizedId = Array.isArray(syncId) ? syncId[0] : syncId;
  return useMemo(
    () => verses.find(record => record.syncId === normalizedId) ?? null,
    [normalizedId, verses]
  );
};

export const useOfflineFeaturedVerse = () => {
  const verses = useOfflineDataStore(state => state.verses);
  return useMemo(
    () => verses.find(record => record.isFeatured) ?? verses[0] ?? null,
    [verses]
  );
};

export const useOfflineCollections = (limit?: number) => {
  const collections = useOfflineDataStore(state => state.collections);
  return useMemo(
    () =>
      limit
        ? sortByUpdatedAtDesc(collections).slice(0, limit)
        : sortByUpdatedAtDesc(collections),
    [collections, limit]
  );
};

export const useOfflineCollection = (syncId?: string | string[]) => {
  const collections = useOfflineDataStore(state => state.collections);
  const normalizedId = Array.isArray(syncId) ? syncId[0] : syncId;
  return useMemo(
    () => collections.find(record => record.syncId === normalizedId) ?? null,
    [collections, normalizedId]
  );
};

export const useOfflineAffirmations = (limit?: number) => {
  const affirmations = useOfflineDataStore(state => state.affirmations);
  return useMemo(
    () =>
      limit
        ? sortByUpdatedAtDesc(affirmations).slice(0, limit)
        : sortByUpdatedAtDesc(affirmations),
    [affirmations, limit]
  );
};

export const useOfflineAffirmation = (syncId?: string | string[]) => {
  const affirmations = useOfflineDataStore(state => state.affirmations);
  const normalizedId = Array.isArray(syncId) ? syncId[0] : syncId;
  return useMemo(
    () => affirmations.find(record => record.syncId === normalizedId) ?? null,
    [affirmations, normalizedId]
  );
};

export const useOfflineNoteForVerse = (verseSyncId?: string | string[]) => {
  const notes = useOfflineDataStore(state => state.notes);
  const normalizedId = Array.isArray(verseSyncId) ? verseSyncId[0] : verseSyncId;
  return useMemo(
    () => notes.find(record => record.verseSyncId === normalizedId) ?? null,
    [normalizedId, notes]
  );
};

export const useOfflineVerseSuggestions = (limit?: number) => {
  const suggestions = useOfflineDataStore(state => state.verseSuggestions);
  return useMemo(
    () => (limit ? suggestions.slice(0, limit) : suggestions),
    [limit, suggestions]
  );
};

export const useOfflineCollectionSuggestions = (limit?: number) => {
  const suggestions = useOfflineDataStore(state => state.collectionSuggestions);
  return useMemo(
    () => (limit ? suggestions.slice(0, limit) : suggestions),
    [limit, suggestions]
  );
};

export const useOfflinePracticeSessions = (limit?: number) => {
  const practiceSessions = useOfflineDataStore(state => state.practiceSessions);
  return useMemo(
    () =>
      limit
        ? sortByUpdatedAtDesc(practiceSessions).slice(0, limit)
        : sortByUpdatedAtDesc(practiceSessions),
    [limit, practiceSessions]
  );
};

export const useOfflineVerseProgress = () => {
  const verseProgress = useOfflineDataStore(state => state.verseProgress);
  return useMemo(
    () => sortByUpdatedAtDesc(verseProgress).map(record => normalizeVerseProgress(record)),
    [verseProgress]
  );
};

export const useOfflineLaunchStats = () => {
  const verses = useOfflineDataStore(state => state.verses);
  const collections = useOfflineDataStore(state => state.collections);
  const practiceSessions = useOfflineDataStore(state => state.practiceSessions);

  return useMemo(
    () => ({
      savedVerses: verses.length,
      savedCollections: collections.length,
      completedPracticeSessions: practiceSessions.length,
      lastPracticeSession: sortByUpdatedAtDesc(practiceSessions)[0] ?? null,
    }),
    [collections.length, practiceSessions, verses.length]
  );
};
