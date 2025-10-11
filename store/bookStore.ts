import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PlatformStorage } from '@/utils/PlatformStorage';

type CollectionVerses = {
  bookName: string;
  chapter: number;
  verses: string[];
  reviewFreq?: string;
  verseTexts: {
    verse: string;
    text: string;
  }[];
};

interface BookStore {
  collectionName: string;
  bookName: string;
  chapter: number;
  chapterLength: number;
  versesLength: number;
  verses: string[];
  collectionVerses: CollectionVerses[];
  isCollectionUpdate: boolean;
  selectedVerseIds: string[]; // Add this for storing verse IDs to move
  setBookName: (name: string) => void;
  setChapter: (chapter: number) => void;
  setChapterLength: (length: number) => void;
  setVersesLength: (length: number) => void;
  setVerses: (verses: string[]) => void;
  setCollectionName: (name: string) => void;
  setCollectionVerses: (collectionVerses: CollectionVerses) => void;
  setCollectionVersesArray: (collectionVerses: CollectionVerses[]) => void; // Add this setter
  setIsCollectionUpdate: (isCollectionUpdate: boolean) => void;
  setSelectedVerseIds: (ids: string[]) => void; // Add this setter
  resetAll: () => void;
}

export const useBookStore = create<BookStore>()(
  persist(
    set => ({
      collectionName: '',
      bookName: '',
      chapter: 0,
      chapterLength: 0,
      versesLength: 0,
      verses: [], // selected verses
      collectionVerses: [],
      isCollectionUpdate: false,
      selectedVerseIds: [], // Initialize selectedVerseIds
      setBookName: name => set({ bookName: name }),
      setChapter: chapter => set({ chapter }),
      setChapterLength: length => set({ chapterLength: length }),
      setVersesLength: length => set({ versesLength: length }),
      setVerses: verses => set({ verses }),
      setCollectionName: name => set({ collectionName: name }),
      setCollectionVerses: collectionVerses =>
        set(state => ({
          collectionVerses: [...state.collectionVerses, collectionVerses],
        })),
      setCollectionVersesArray: collectionVerses => set({ collectionVerses }),
      setIsCollectionUpdate: isCollectionUpdate => set({ isCollectionUpdate }),
      setSelectedVerseIds: ids => set({ selectedVerseIds: ids }),
      resetAll: () =>
        set({
          bookName: '',
          chapter: 0,
          chapterLength: 0,
          verses: [],
          collectionName: '',
          collectionVerses: [],
          versesLength: 0,
          isCollectionUpdate: false,
          selectedVerseIds: [],
        }),
    }),
    {
      name: 'book-store',
      storage: createJSONStorage(() => PlatformStorage),
      // Only persist important data, not temporary UI state
      partialize: state => ({
        // Persist collection data (most important)
        collectionName: state.collectionName,
        collectionVerses: state.collectionVerses,
        isCollectionUpdate: state.isCollectionUpdate,

        // Persist current book selection for continuity
        bookName: state.bookName,
        chapter: state.chapter,
        chapterLength: state.chapterLength,
        versesLength: state.versesLength,

        // Don't persist temporary selection state
        // verses: [] - this should reset on each session
      }),
      // Handle migration if store structure changes
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // Handle future migrations here
        if (version === 0) {
          // Example migration from version 0 to 1
          return {
            ...persistedState,
            // Add any new fields with defaults
          };
        }
        return persistedState;
      },
      // Handle storage errors gracefully
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate book store:', error);
          // Could implement fallback behavior here
        } else {
          console.log('Book store rehydrated successfully');
        }
      },
    }
  )
);
