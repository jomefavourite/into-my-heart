import { create } from 'zustand';
interface BookStore {
  bookName: string;
  chapter: number;
  chapterLength: number;
  verses: string[];
  setBookName: (name: string) => void;
  setChapter: (chapter: number) => void;
  setChapterLength: (length: number) => void;
  setVerses: (verses: string[]) => void;
}

export const useBookStore = create<BookStore>((set) => ({
  bookName: '',
  chapter: 0,
  chapterLength: 0,
  verses: [],
  setBookName: (name) => set({ bookName: name }),
  setChapter: (chapter) => set({ chapter }),
  setChapterLength: (length) => set({ chapterLength: length }),
  setVerses: (verses) => set({ verses }),
}));
