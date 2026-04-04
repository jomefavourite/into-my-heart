import React, { PropsWithChildren, useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useOfflineDataStore } from '@/store/offlineDataStore';

const syncPriority: Record<string, number> = {
  verse: 0,
  collection: 1,
  affirmation: 2,
  note: 3,
  practiceSession: 4,
  verseProgress: 5,
};

const resolveQueueMutationResult = (
  result: unknown
): { syncId: string; remoteId?: string } | null => {
  if (!result || typeof result !== 'object') {
    return null;
  }

  const record = result as { syncId?: string; remoteId?: string };
  if (!record.syncId) {
    return null;
  }

  return {
    syncId: record.syncId,
    remoteId: record.remoteId,
  };
};

export default function OfflineSyncProvider({ children }: PropsWithChildren) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { isAuthenticated: isConvexAuthenticated } = useConvexAuth();
  const {
    applyRemoteSnapshot,
    currentUser,
    queue,
    isSyncing,
    syncTick,
    setSyncing,
    setSyncError,
    requestSync,
    markOperationSynced,
  } = useOfflineDataStore();

  const canQueryRemote = Boolean(isLoaded && isSignedIn && isConvexAuthenticated);

  const remoteSnapshot = useQuery(
    (api as any).sync?.getUserSyncSnapshot,
    canQueryRemote ? {} : 'skip'
  );

  const upsertVerseSync = useMutation((api as any).sync?.upsertVerseSync);
  const upsertCollectionSync = useMutation((api as any).sync?.upsertCollectionSync);
  const upsertAffirmationSync = useMutation(
    (api as any).sync?.upsertAffirmationSync
  );
  const upsertNoteSync = useMutation((api as any).sync?.upsertNoteSync);
  const upsertPracticeSessionSync = useMutation(
    (api as any).sync?.upsertPracticeSessionSync
  );
  const upsertVerseProgressSync = useMutation(
    (api as any).sync?.upsertVerseProgressSync
  );

  useEffect(() => {
    if (!user) {
      return;
    }

    if (currentUser?.clerkId === user.id) {
      return;
    }

    useOfflineDataStore.setState({
      currentUser: {
        clerkId: user.id,
        email:
          user.primaryEmailAddress?.emailAddress ??
          user.emailAddresses[0]?.emailAddress ??
          '',
        first_name: user.firstName ?? undefined,
        last_name: user.lastName ?? undefined,
        imageUrl: user.imageUrl ?? undefined,
      },
    });
  }, [currentUser?.clerkId, user]);

  useEffect(() => {
    if (!remoteSnapshot) {
      return;
    }

    applyRemoteSnapshot(remoteSnapshot);
  }, [applyRemoteSnapshot, remoteSnapshot]);

  useEffect(() => {
    if (!canQueryRemote || queue.length === 0 || isSyncing) {
      return;
    }

    let cancelled = false;
    const orderedQueue = [...queue].sort((left, right) => {
      const priorityDelta =
        (syncPriority[left.entityType] ?? Number.MAX_SAFE_INTEGER) -
        (syncPriority[right.entityType] ?? Number.MAX_SAFE_INTEGER);

      if (priorityDelta !== 0) {
        return priorityDelta;
      }

      return left.createdAt - right.createdAt;
    });

    const flushQueue = async () => {
      setSyncing(true);

      try {
        for (const operation of orderedQueue) {
          if (cancelled) {
            return;
          }

          let result: unknown;

          if (operation.entityType === 'verse') {
            result = await upsertVerseSync({
              operation,
            });
          } else if (operation.entityType === 'collection') {
            result = await upsertCollectionSync({
              operation,
            });
          } else if (operation.entityType === 'affirmation') {
            result = await upsertAffirmationSync({
              operation,
            });
          } else if (operation.entityType === 'note') {
            result = await upsertNoteSync({
              operation,
            });
          } else if (operation.entityType === 'practiceSession') {
            result = await upsertPracticeSessionSync({
              operation,
            });
          } else if (operation.entityType === 'verseProgress') {
            result = await upsertVerseProgressSync({
              operation,
            });
          }

          const resolved = resolveQueueMutationResult(result);
          markOperationSynced(
            operation.entityType,
            resolved?.syncId ?? operation.syncId,
            resolved?.remoteId
          );
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to sync changes. Your edits are still stored locally.';
        setSyncError(message);
      } finally {
        setSyncing(false);
      }
    };

    flushQueue();

    return () => {
      cancelled = true;
    };
  }, [
    canQueryRemote,
    isSyncing,
    markOperationSynced,
    queue,
    syncTick,
    setSyncError,
    setSyncing,
    upsertAffirmationSync,
    upsertCollectionSync,
    upsertNoteSync,
    upsertPracticeSessionSync,
    upsertVerseSync,
    upsertVerseProgressSync,
  ]);

  useEffect(() => {
    if (!canQueryRemote || queue.length === 0 || isSyncing) {
      return;
    }

    const timeoutId = setTimeout(() => {
      requestSync();
    }, 30000);

    return () => clearTimeout(timeoutId);
  }, [canQueryRemote, isSyncing, queue.length, requestSync, syncTick]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const onOnline = () => {
        requestSync();
      };

      window.addEventListener('online', onOnline);
      return () => window.removeEventListener('online', onOnline);
    }

    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        requestSync();
      }
    });

    return () => subscription.remove();
  }, [requestSync]);

  return <>{children}</>;
}
