import { create } from 'zustand';
interface BookStore {
  collectionName: string;
  bookName: string;
  chapter: number;
  chapterLength: number;
  verses: string[];
  setBookName: (name: string) => void;
  setChapter: (chapter: number) => void;
  setChapterLength: (length: number) => void;
  setVerses: (verses: string[]) => void;
  setCollectionName: (name: string) => void;
  resetAll: () => void;
}

export const useBookStore = create<BookStore>((set) => ({
  collectionName: '',
  bookName: '',
  chapter: 0,
  chapterLength: 0,
  verses: [],
  setBookName: (name) => set({ bookName: name }),
  setChapter: (chapter) => set({ chapter }),
  setChapterLength: (length) => set({ chapterLength: length }),
  setVerses: (verses) => set({ verses }),
  setCollectionName: (name) => set({ collectionName: name }),
  resetAll: () =>
    set({ bookName: '', chapter: 0, chapterLength: 0, verses: [] }),
}));
