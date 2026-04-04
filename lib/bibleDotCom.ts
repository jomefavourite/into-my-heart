export const BIBLE_DOT_COM_HOST_PATTERN = /(^|\.)bible\.com$/i;

const BIBLE_DOT_COM_PATH_PATTERN =
  /\/bible\/(\d+)\/([A-Z0-9]+)\.(\d+)\.([\d,-]+)\.([A-Z0-9-]+)/i;

export type ParsedBibleDotComUrl = {
  sourceUrl: string;
  versionId: string;
  bookToken: string;
  chapter: number;
  verses: string[];
  selectionLabel: string;
  versionLabel: string;
};

export const getFirstUrl = (value: string): string | null =>
  value.match(/https?:\/\/[^\s]+/i)?.[0] ?? null;

const parseVerseSelection = (selection: string): string[] => {
  const values = new Set<number>();

  for (const segment of selection.split(',')) {
    const trimmedSegment = segment.trim();
    if (!trimmedSegment) {
      continue;
    }

    if (/^\d+$/.test(trimmedSegment)) {
      values.add(Number(trimmedSegment));
      continue;
    }

    const rangeMatch = trimmedSegment.match(/^(\d+)\s*-\s*(\d+)$/);
    if (!rangeMatch) {
      return [];
    }

    const start = Number(rangeMatch[1]);
    const end = Number(rangeMatch[2]);
    if (end < start) {
      return [];
    }

    for (let verse = start; verse <= end; verse += 1) {
      values.add(verse);
    }
  }

  return [...values].sort((left, right) => left - right).map(String);
};

export const parseBibleDotComUrlParts = (
  sourceUrl: string | null
): ParsedBibleDotComUrl | null => {
  if (!sourceUrl) {
    return null;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(sourceUrl);
  } catch {
    return null;
  }

  if (!BIBLE_DOT_COM_HOST_PATTERN.test(parsedUrl.hostname)) {
    return null;
  }

  const pathMatch = parsedUrl.pathname.match(BIBLE_DOT_COM_PATH_PATTERN);
  if (!pathMatch) {
    return null;
  }

  const verses = parseVerseSelection(pathMatch[4]);
  if (verses.length === 0) {
    return null;
  }

  return {
    sourceUrl,
    versionId: pathMatch[1],
    bookToken: pathMatch[2].toUpperCase(),
    chapter: Number(pathMatch[3]),
    verses,
    selectionLabel: pathMatch[4].replace(/\s+/g, ''),
    versionLabel: pathMatch[5].toUpperCase(),
  };
};

export const buildBibleDotComSingleVerseUrl = (
  parsedUrl: ParsedBibleDotComUrl,
  verse: string
) =>
  `https://www.bible.com/bible/${parsedUrl.versionId}/${parsedUrl.bookToken}.${parsedUrl.chapter}.${verse}.${parsedUrl.versionLabel}`;
