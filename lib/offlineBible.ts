import { BOOKS } from '@/lib/books';
import {
  loadOfflineBibleBook,
  type OfflineBibleBookData,
} from '@/lib/bible-data';

export type OfflineVerseText = {
  verse: number;
  text: string;
};

const chapterCache = new Map<string, Record<string, string>>();

const getBookId = (bookName: string) =>
  BOOKS.find(book => book.name === bookName)?.id;

const getCachedChapterKey = (bookId: string, chapter: number) =>
  `${bookId}:${chapter}`;

export const getOfflineChapter = (
  bookName: string,
  chapter: number
): Record<string, string> => {
  const bookId = getBookId(bookName);

  if (!bookId) {
    throw new Error(`Book "${bookName}" not found`);
  }

  const cacheKey = getCachedChapterKey(bookId, chapter);
  const cachedChapter = chapterCache.get(cacheKey);
  if (cachedChapter) {
    return cachedChapter;
  }

  const bookData: OfflineBibleBookData = loadOfflineBibleBook(bookId);
  const chapterData = bookData.chapters[String(chapter)];

  if (!chapterData) {
    throw new Error(`Chapter ${chapter} not found for ${bookName}`);
  }

  chapterCache.set(cacheKey, chapterData);
  return chapterData;
};

export const getOfflineVerseText = (
  bookName: string,
  chapter: number,
  verseNumber: number
): OfflineVerseText | null => {
  const chapterData = getOfflineChapter(bookName, chapter);
  const text = chapterData[String(verseNumber)];

  if (!text) {
    return null;
  }

  return {
    verse: verseNumber,
    text,
  };
};

export const getOfflineVerseTexts = (
  bookName: string,
  chapter: number,
  verseNumbers: number[]
): OfflineVerseText[] =>
  verseNumbers
    .map(verseNumber => getOfflineVerseText(bookName, chapter, verseNumber))
    .filter((entry): entry is OfflineVerseText => entry !== null);
