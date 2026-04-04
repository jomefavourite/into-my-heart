import { useEffect, useRef } from 'react';
import { usePracticeStore } from '@/store/practiceStore';
import { useOfflineDataStore } from '@/store/offlineDataStore';
import type { PracticeMethod } from '@/lib/offline-sync';

export const usePracticeCompletion = (method: PracticeMethod) => {
  const currentSession = usePracticeStore(state => state.currentSession);
  const recordPracticeSessionLocal = useOfflineDataStore(
    state => state.recordPracticeSessionLocal
  );
  const hasRecordedRef = useRef(false);

  useEffect(() => {
    if (!currentSession || hasRecordedRef.current) {
      return;
    }

    recordPracticeSessionLocal({
      method,
      practiceType: currentSession.practiceType,
      source: currentSession.source ?? 'manualTechnique',
      outcomesByVerseKey: currentSession.outcomesByVerseKey ?? {},
      verses: currentSession.verses.map(verse =>
        '_id' in verse && typeof verse._id === 'string'
          ? {
              bookName: verse.bookName,
              chapter: verse.chapter,
              verses: verse.verses,
              reviewFreq: verse.reviewFreq,
              _id: verse._id,
            }
          : {
              bookName: verse.bookName,
              chapter: verse.chapter,
              verses: verse.verses,
              reviewFreq: verse.reviewFreq,
            }
      ),
    });

    hasRecordedRef.current = true;
  }, [currentSession, method, recordPracticeSessionLocal]);
};
