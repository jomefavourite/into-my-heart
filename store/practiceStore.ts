import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
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
  practiceType: 'verses' | 'collections';
  sessionId: string;
  createdAt: number;
}

interface PracticeStore {
  currentSession: PracticeSession | null;
  setPracticeSession: (
    verses: PracticeVerse[],
    practiceType: 'verses' | 'collections'
  ) => void;
  clearPracticeSession: () => void;
  getCurrentSession: () => PracticeSession | null;
}

export const usePracticeStore = create<PracticeStore>()(
  persist(
    (set, get) => ({
      currentSession: null,

      setPracticeSession: (
        verses: PracticeVerse[],
        practiceType: 'verses' | 'collections'
      ) => {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        set({
          currentSession: {
            verses,
            practiceType,
            sessionId,
            createdAt: Date.now(),
          },
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
