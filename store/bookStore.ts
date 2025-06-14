import { create } from 'zustand';

type CollectionVerses = {
  bookName: string;
  chapter: number;
  verses: string[];
  reviewFreq?: string;
};
interface BookStore {
  collectionName: string;
  bookName: string;
  chapter: number;
  chapterLength: number;
  verses: string[];
  collectionVerses: CollectionVerses[];
  setBookName: (name: string) => void;
  setChapter: (chapter: number) => void;
  setChapterLength: (length: number) => void;
  setVerses: (verses: string[]) => void;
  setCollectionName: (name: string) => void;
  setCollectionVerses: (collectionVerses: CollectionVerses) => void;
  resetAll: () => void;
}

export const useBookStore = create<BookStore>((set) => ({
  collectionName: '',
  bookName: '',
  chapter: 0,
  chapterLength: 0,
  verses: [],
  collectionVerses: [],
  setBookName: (name) => set({ bookName: name }),
  setChapter: (chapter) => set({ chapter }),
  setChapterLength: (length) => set({ chapterLength: length }),
  setVerses: (verses) => set({ verses }),
  setCollectionName: (name) => set({ collectionName: name }),
  setCollectionVerses: (collectionVerses) =>
    set((state) => ({
      collectionVerses: [...state.collectionVerses, collectionVerses],
    })),
  resetAll: () =>
    set({
      bookName: '',
      chapter: 0,
      chapterLength: 0,
      verses: [],
      collectionName: '',
      collectionVerses: [],
    }),
}));
