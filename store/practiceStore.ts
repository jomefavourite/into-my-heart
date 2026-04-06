import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  type PracticeMethod,
  type PracticeOutcome,
  type PracticeSessionSource,
} from '@/lib/offline-sync';
import { PlatformStorage } from '@/utils/PlatformStorage';

export interface Verse {
  _id: string;
  bookName: string;
  chapter: number;
  verses: string[];
  verseTexts: {
    verse: string;
    text: string;
  }[];
  reviewFreq: string;
}

export interface CollectionVerse {
  bookName: string;
  chapter: number;
  verses: string[];
  verseTexts: {
    verse: string;
    text: string;
  }[];
  reviewFreq: string;
}

export type PracticeVerse = Verse | CollectionVerse;

export interface PracticeSession {
  verses: PracticeVerse[];
  method: PracticeMethod;
  practiceType: 'verses' | 'collections';
  source: PracticeSessionSource;
  outcomesByVerseKey: Record<string, PracticeOutcome>;
  sessionId: string;
  createdAt: number;
}

interface PracticeStore {
  currentSession: PracticeSession | null;
  setPracticeSession: (
    verses: PracticeVerse[],
    practiceType: 'verses' | 'collections',
    method: PracticeMethod,
    source: PracticeSessionSource
  ) => void;
  setVerseOutcome: (verseKey: string, outcome: PracticeOutcome) => void;
  clearPracticeSession: () => void;
  getCurrentSession: () => PracticeSession | null;
}

export const usePracticeStore = create<PracticeStore>()(
  persist(
    (set, get) => ({
      currentSession: null,

      setPracticeSession: (
        verses: PracticeVerse[],
        practiceType: 'verses' | 'collections',
        method: PracticeMethod,
        source: PracticeSessionSource
      ) => {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
        set({
          currentSession: {
            verses,
            method,
            practiceType,
            source,
            outcomesByVerseKey: {},
            sessionId,
            createdAt: Date.now(),
          },
        });
      },

      setVerseOutcome: (verseKey, outcome) => {
        set(state => {
          if (!state.currentSession) {
            return state;
          }

          return {
            currentSession: {
              ...state.currentSession,
              outcomesByVerseKey: {
                ...state.currentSession.outcomesByVerseKey,
                [verseKey]: outcome,
              },
            },
          };
        });
      },

      clearPracticeSession: () => {
        set({ currentSession: null });
      },

      getCurrentSession: () => {
        return get().currentSession;
      },
    }),
    {
      name: 'practice-store',
      storage: createJSONStorage(() => PlatformStorage),
      // Only persist the current session, not the entire store
      partialize: state => ({ currentSession: state.currentSession }),
    }
  )
);
