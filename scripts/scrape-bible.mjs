import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BOOKS } from '../lib/books.js';

const FALLBACK_KJV_URL =
  'https://raw.githubusercontent.com/farskipper/kjv/master/json/verses-1769.json';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDirectory = path.resolve(__dirname, '../lib/bible-data');
const booksFilePath = path.resolve(__dirname, '../lib/books.js');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const BOOK_NAME_ALIASES = {
  'Song of Solomon': ['Song of Solomon', 'Song of Songs'],
};

const normalizeFallbackText = text =>
  String(text)
    .replace(/^#\s*/, '')
    .replace(/\[(.+?)\]/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

const fetchWithRetry = async (url, attempt = 1) => {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'IntoMyHeartOfflineImport/1.0',
    },
  });

  if (!response.ok) {
    if (attempt < 5) {
      await sleep(attempt * 2000);
      return fetchWithRetry(url, attempt + 1);
    }

    throw new Error(`Failed to fetch ${url} (status ${response.status})`);
  }

  const contentType = response.headers.get('content-type') || '';
  const responseText = await response.text();

  if (
    !contentType.includes('application/json') &&
    !contentType.includes('text/plain')
  ) {
    if (attempt < 5) {
      await sleep(attempt * 2000);
      return fetchWithRetry(url, attempt + 1);
    }

    throw new Error(
      `Expected JSON from ${url}, received ${contentType || 'unknown content type'}`
    );
  }

  try {
    return JSON.parse(responseText);
  } catch (error) {
    if (attempt < 5) {
      await sleep(attempt * 2000);
      return fetchWithRetry(url, attempt + 1);
    }

    throw error;
  }
};

const loadFallbackBible = async () => {
  console.log(`Downloading KJV verses from ${FALLBACK_KJV_URL}...`);
  return fetchWithRetry(FALLBACK_KJV_URL);
};

const buildBibleIndex = versesPayload => {
  const bibleIndex = new Map();

  for (const [reference, verseText] of Object.entries(versesPayload)) {
    const match = reference.match(/^(.*)\s+(\d+):(\d+)$/);
    if (!match) {
      continue;
    }

    const [, bookName, chapterNumber, verseNumber] = match;

    if (!bibleIndex.has(bookName)) {
      bibleIndex.set(bookName, new Map());
    }

    const chapters = bibleIndex.get(bookName);
    if (!chapters.has(chapterNumber)) {
      chapters.set(chapterNumber, {});
    }

    chapters.get(chapterNumber)[verseNumber] = normalizeFallbackText(verseText);
  }

  return bibleIndex;
};

const resolveSourceBookName = (bookName, bibleIndex) => {
  const aliases = BOOK_NAME_ALIASES[bookName] ?? [bookName];

  for (const alias of aliases) {
    if (bibleIndex.has(alias)) {
      return alias;
    }
  }

  const looseMatch = [...bibleIndex.keys()].find(candidate => {
    const normalizedCandidate = candidate.toLowerCase();
    const normalizedBookName = bookName.toLowerCase();

    return (
      normalizedCandidate.includes(normalizedBookName) ||
      normalizedBookName.includes(normalizedCandidate) ||
      (normalizedBookName.includes('song') && normalizedCandidate.includes('song'))
    );
  });

  return looseMatch ?? null;
};

const generateIndexModule = async () => {
  const lines = [
    'export type OfflineBibleBookData = {',
    '  id: string;',
    '  name: string;',
    '  chapters: Record<string, Record<string, string>>;',
    '};',
    '',
    'const loaders = {',
    ...BOOKS.map(
      book => `  ${JSON.stringify(book.id)}: () => require('./${book.id}.json'),`
    ),
    '} as const;',
    '',
    'const cache = new Map<string, OfflineBibleBookData>();',
    '',
    'export const loadOfflineBibleBook = (bookId: string): OfflineBibleBookData => {',
    '  const cached = cache.get(bookId);',
    '  if (cached) {',
    '    return cached;',
    '  }',
    '',
    '  const loader = loaders[bookId as keyof typeof loaders];',
    '  if (!loader) {',
    '    throw new Error(`Offline Bible data not found for ${bookId}`);',
    '  }',
    '',
    '  const module = loader();',
    '  const book = (module?.default ?? module) as OfflineBibleBookData;',
    '  cache.set(bookId, book);',
    '  return book;',
    '};',
    '',
  ];

  await fs.writeFile(path.join(outputDirectory, 'index.ts'), lines.join('\n'));
};

const writeBooksMetadata = async books => {
  const fileContents = `export const BOOKS = ${JSON.stringify(books, null, 2)};\n`;
  await fs.writeFile(booksFilePath, fileContents);
};

const writeBookFile = async (book, bibleIndex, mismatches) => {
  const sourceBookName = resolveSourceBookName(book.name, bibleIndex);
  const sourceChapters = sourceBookName ? bibleIndex.get(sourceBookName) : null;

  if (!sourceChapters) {
    throw new Error(`No KJV data found for ${book.name}`);
  }

  const chapters = {};
  const updatedChapters = [];

  for (const [chapterNumber, verseMap] of [...sourceChapters.entries()].sort(
    ([left], [right]) => Number(left) - Number(right)
  )) {
    chapters[chapterNumber] = verseMap;
    updatedChapters.push({
      chapterNumber: Number(chapterNumber),
      versesLength: Object.keys(verseMap).length,
    });
  }

  updatedChapters.forEach((chapter, index) => {
    const existingChapter = book.chapters[index];
    if (!existingChapter || existingChapter.versesLength !== chapter.versesLength) {
      mismatches.push({
        bookId: book.id,
        chapterNumber: chapter.chapterNumber,
        expected: existingChapter?.versesLength ?? 0,
        actual: chapter.versesLength,
      });
    }
  });

  const outputPath = path.join(outputDirectory, `${book.id}.json`);
  const payload = {
    id: book.id,
    name: book.name,
    chapters,
  };

  await fs.writeFile(outputPath, JSON.stringify(payload));
  console.log(`Bundled ${book.name}`);

  return {
    ...book,
    chaptersLength: updatedChapters.length,
    chapters: updatedChapters,
  };
};

const main = async () => {
  await fs.mkdir(outputDirectory, { recursive: true });

  const fallbackBible = await loadFallbackBible();
  const bibleIndex = buildBibleIndex(fallbackBible);
  const mismatches = [];
  const updatedBooks = [];

  for (const book of BOOKS) {
    updatedBooks.push(await writeBookFile(book, bibleIndex, mismatches));
  }

  await writeBooksMetadata(updatedBooks);
  await generateIndexModule();

  if (mismatches.length > 0) {
    console.log('\nCorrected verse-count mismatches in lib/books.js:');
    mismatches.forEach(mismatch => {
      console.log(
        `${mismatch.bookId} ${mismatch.chapterNumber}: expected ${mismatch.expected}, actual ${mismatch.actual}`
      );
    });
  }

  console.log(`Offline Bible data written to ${outputDirectory}`);
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
