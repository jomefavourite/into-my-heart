import { BOOKS } from '@/lib/books';
import {
  type ExactBibleDotComVerseTextsResult,
  type ExactSplitFallbackReason,
  normalizeImportedText,
} from '@/lib/bibleDotComImport';
import {
  BIBLE_DOT_COM_HOST_PATTERN,
  getFirstUrl,
  parseBibleDotComUrlParts,
} from '@/lib/bibleDotCom';
import { getOfflineVerseTexts } from '@/lib/offlineBible';
import type {
  ImportSourceChannel,
  ImportSourceProvider,
  PendingImportShare,
  VerseImportSource,
  VerseTextEntry,
} from '@/lib/offline-sync';

export type ParsedImportedVerse = {
  bookName: string;
  chapter: number;
  verses: string[];
  verseTexts: VerseTextEntry[];
  importSource: VerseImportSource;
  referenceLabel: string;
  sourceTextPreview: string | null;
  previewVersionLabel: string | null;
  storedVersionLabel: string | null;
  textFidelity: 'exactImported' | 'offlineFallback';
  exactSplitUnavailableReason:
    | 'noSourceUrl'
    | ExactSplitFallbackReason
    | null;
  storedVersePreview: string;
};

export type VerseImportParseResult =
  | { parsed: ParsedImportedVerse; error: null }
  | { parsed: null; error: string };

type ParsedReference = {
  bookName: string;
  chapter: number;
  verses: string[];
  version: string | null;
  selectionLabel: string;
  sourceUrl: string | null;
  provider: ImportSourceProvider;
};

const containsUrl = (value: string) => /https?:\/\/[^\s]+/i.test(value);
type ExactVerseTextResolver = (args: {
  sourceUrl: string;
  verses: string[];
}) => Promise<ExactBibleDotComVerseTextsResult>;

const CUSTOM_BOOK_ALIASES: Record<string, string[]> = {
  Psalm: ['Psalms', 'Psalm', 'Psalm.', 'Ps', 'Ps.'],
  Proverbs: ['Proverb', 'Proverbs', 'Prov', 'Prov.', 'Prv'],
  'Song of Solomon': ['Song of Songs', 'Song of Solomon', 'Song', 'SOS'],
  '1 John': ['I John', '1 Jn', '1 Jhn'],
  '2 John': ['II John', '2 Jn', '2 Jhn'],
  '3 John': ['III John', '3 Jn', '3 Jhn'],
  '1 Corinthians': ['I Corinthians', '1 Cor', '1 Cor.'],
  '2 Corinthians': ['II Corinthians', '2 Cor', '2 Cor.'],
  '1 Thessalonians': ['I Thessalonians', '1 Thess', '1 Thess.'],
  '2 Thessalonians': ['II Thessalonians', '2 Thess', '2 Thess.'],
  '1 Timothy': ['I Timothy', '1 Tim', '1 Tim.'],
  '2 Timothy': ['II Timothy', '2 Tim', '2 Tim.'],
  '1 Peter': ['I Peter', '1 Pet', '1 Pet.'],
  '2 Peter': ['II Peter', '2 Pet', '2 Pet.'],
  '1 Samuel': ['I Samuel', '1 Sam', '1 Sam.'],
  '2 Samuel': ['II Samuel', '2 Sam', '2 Sam.'],
  '1 Kings': ['I Kings', '1 Kgs', '1 Ki'],
  '2 Kings': ['II Kings', '2 Kgs', '2 Ki'],
  '1 Chronicles': ['I Chronicles', '1 Chron', '1 Chr'],
  '2 Chronicles': ['II Chronicles', '2 Chron', '2 Chr'],
};

const normalizeBookKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/[.]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const bookAliasMap = new Map<string, string>();

BOOKS.forEach(book => {
  const aliases = new Set<string>([
    book.name,
    book.abbreviation,
    book.id,
    ...(CUSTOM_BOOK_ALIASES[book.name] ?? []),
  ]);

  aliases.forEach(alias => {
    bookAliasMap.set(normalizeBookKey(alias), book.name);
  });
});

const bookPatterns = [...bookAliasMap.keys()]
  .sort((left, right) => right.length - left.length)
  .map(alias => escapeRegex(alias).replace(/\s+/g, '\\s+'));

const REFERENCE_PATTERN = new RegExp(
  `(?:^|[^A-Za-z0-9])(${bookPatterns.join('|')})\\s+(\\d+):(\\d+(?:\\s*[-,]\\s*\\d+)*)\\s*(?:\\(?([A-Z][A-Z0-9]{1,14})\\)?)?`,
  'gi'
);

const MULTI_CHAPTER_PATTERN = new RegExp(
  `(?:^|[^A-Za-z0-9])(${bookPatterns.join('|')})\\s+\\d+:\\d+\\s*[-–]\\s*\\d+:\\d+`,
  'i'
);

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
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);

      if (end < start) {
        throw new Error('Verse ranges must increase from left to right.');
      }

      for (let verse = start; verse <= end; verse += 1) {
        values.add(verse);
      }
      continue;
    }

    throw new Error(
      'Only same-chapter single verses, comma lists, and ranges are supported.'
    );
  }

  return [...values].sort((left, right) => left - right).map(String);
};

const resolveBookName = (candidate: string): string | null => {
  return bookAliasMap.get(normalizeBookKey(candidate)) ?? null;
};

const detectProvider = (sourceUrl: string | null, text: string): ImportSourceProvider => {
  if (sourceUrl) {
    try {
      if (BIBLE_DOT_COM_HOST_PATTERN.test(new URL(sourceUrl).hostname)) {
        return 'bible.com';
      }
    } catch {
      // Fall back to text inspection below.
    }
  }

  return /bible\.com/i.test(text) ? 'bible.com' : 'unknown';
};

const parseBibleDotComUrl = (
  sourceUrl: string | null,
  text: string
): ParsedReference | null => {
  const parsedUrl = parseBibleDotComUrlParts(sourceUrl ?? getFirstUrl(text));
  if (!parsedUrl) {
    return null;
  }

  const bookName = resolveBookName(parsedUrl.bookToken);
  if (!bookName) {
    throw new Error(`Book "${parsedUrl.bookToken}" is not supported.`);
  }

  return {
    bookName,
    chapter: parsedUrl.chapter,
    verses: parsedUrl.verses,
    version: parsedUrl.versionLabel,
    selectionLabel: parsedUrl.selectionLabel,
    sourceUrl: parsedUrl.sourceUrl,
    provider: 'bible.com',
  };
};

const parseReferenceFromText = (
  text: string,
  sourceUrl: string | null
): ParsedReference | null => {
  if (MULTI_CHAPTER_PATTERN.test(text)) {
    throw new Error(
      'Multi-chapter imports are not supported yet. Please share one chapter at a time.'
    );
  }

  let lastMatch: RegExpExecArray | null = null;
  const matcher = new RegExp(REFERENCE_PATTERN.source, REFERENCE_PATTERN.flags);
  let nextMatch = matcher.exec(text);

  while (nextMatch) {
    lastMatch = nextMatch;
    nextMatch = matcher.exec(text);
  }

  if (!lastMatch) {
    return null;
  }

  const bookName = resolveBookName(lastMatch[1]);
  if (!bookName) {
    throw new Error(`Book "${lastMatch[1]}" is not supported.`);
  }

  const selectionLabel = lastMatch[3].replace(/\s+/g, '');
  const verses = parseVerseSelection(selectionLabel);

  return {
    bookName,
    chapter: Number(lastMatch[2]),
    verses,
    version: lastMatch[4]?.toUpperCase() ?? null,
    selectionLabel,
    sourceUrl,
    provider: detectProvider(sourceUrl, text),
  };
};

const buildSourceTextPreview = (
  sharedText: string,
  referenceLabel: string,
  sourceUrl: string | null
): string | null => {
  const lines = sharedText
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .filter(line => line !== sourceUrl && !containsUrl(line));

  const referenceWithoutVersion = referenceLabel.replace(/\s+[A-Z][A-Z0-9-]{1,14}$/, '');
  const referencePatterns = [
    new RegExp(`^${escapeRegex(referenceLabel)}$`, 'i'),
    new RegExp(`^${escapeRegex(referenceWithoutVersion)}$`, 'i'),
  ];
  const genericMetadataPatterns = [
    /^bible\.com$/i,
    /^youversion$/i,
    /^verse of the day$/i,
    /^share$/i,
  ];
  const filteredLines = lines.filter(
    line =>
      !referencePatterns.some(pattern => pattern.test(line)) &&
      !genericMetadataPatterns.some(pattern => pattern.test(line))
  );
  const preview = filteredLines.join('\n').trim();

  return preview.length > 0 ? preview : null;
};

const resolveOfflineVerseTexts = (
  bookName: string,
  chapter: number,
  verses: string[]
): VerseTextEntry[] => {
  const verseTexts = getOfflineVerseTexts(bookName, chapter, verses.map(Number)).map(
    verse => ({
      verse: String(verse.verse),
      text: verse.text,
    })
  );

  if (verseTexts.length !== verses.length) {
    throw new Error(
      `Some verses in ${bookName} ${chapter}:${verses.join(',')} could not be found in the KJV data.`
    );
  }

  return verseTexts;
};

const splitPreviewIntoVerseTexts = (
  sourceTextPreview: string,
  verses: string[]
): VerseTextEntry[] | null => {
  if (verses.length === 0) {
    return null;
  }

  const preview = sourceTextPreview.trim();
  if (!preview) {
    return null;
  }

  if (verses.length === 1) {
    const verseNumber = verses[0];
    const strippedPreview = preview.replace(
      new RegExp(`^${escapeRegex(verseNumber)}\\s+`),
      ''
    );
    const normalized = normalizeImportedText(strippedPreview);
    return normalized
      ? [
          {
            verse: verseNumber,
            text: normalized,
          },
        ]
      : null;
  }

  const orderedVerses = verses.map(Number).sort((left, right) => left - right);
  const lineMatches = sourceTextPreview
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => line.match(/^(\d+)\s+(.*)$/))
    .filter(
      (match): match is RegExpMatchArray =>
        Boolean(match && orderedVerses.includes(Number(match[1])))
    );

  if (lineMatches.length === orderedVerses.length) {
    const lineMap = new Map(
      lineMatches.map(match => [match[1], normalizeImportedText(match[2])])
    );
    const resolvedFromLines = verses
      .map(verse => ({
        verse,
        text: lineMap.get(verse) ?? '',
      }))
      .filter(entry => Boolean(entry.text));

    if (resolvedFromLines.length === verses.length) {
      return resolvedFromLines;
    }
  }

  const verseNumberPattern = orderedVerses.map(String).join('|');
  const inlinePattern = new RegExp(
    `(?:^|\\s)(${verseNumberPattern})\\s+([\\s\\S]*?)(?=(?:\\s(?:${verseNumberPattern})\\s+)|$)`,
    'g'
  );
  const inlineMatches = [...preview.matchAll(inlinePattern)];

  if (inlineMatches.length >= verses.length) {
    const inlineMap = new Map(
      inlineMatches.map(match => [match[1], normalizeImportedText(match[2])])
    );
    const resolvedInline = verses
      .map(verse => ({
        verse,
        text: inlineMap.get(verse) ?? '',
      }))
      .filter(entry => Boolean(entry.text));

    if (resolvedInline.length === verses.length) {
      return resolvedInline;
    }
  }

  return null;
};

const resolveImportedVerseTexts = async ({
  bookName,
  chapter,
  verses,
  sourceTextPreview,
  provider,
  sourceUrl,
  exactVerseTextResolver,
}: {
  bookName: string;
  chapter: number;
  verses: string[];
  sourceTextPreview: string | null;
  provider: ImportSourceProvider;
  sourceUrl: string | null;
  exactVerseTextResolver?: ExactVerseTextResolver;
}) => {
  const importedVerseTexts = sourceTextPreview
    ? splitPreviewIntoVerseTexts(sourceTextPreview, verses)
    : null;

  if (importedVerseTexts && importedVerseTexts.length === verses.length) {
    return {
      verseTexts: importedVerseTexts,
      textFidelity: 'exactImported' as const,
      exactSplitUnavailableReason: null,
    };
  }

  let exactSplitUnavailableReason:
    | 'noSourceUrl'
    | ExactSplitFallbackReason
    | null = null;

  if (provider === 'bible.com' && verses.length > 1) {
    if (!sourceUrl) {
      exactSplitUnavailableReason = 'noSourceUrl';
    } else if (exactVerseTextResolver) {
      const exactResult = await exactVerseTextResolver({
        sourceUrl,
        verses,
      });

      if (exactResult.status === 'exact') {
        return {
          verseTexts: exactResult.verseTexts,
          textFidelity: 'exactImported' as const,
          exactSplitUnavailableReason: null,
        };
      }

      exactSplitUnavailableReason = exactResult.reason;
    }
  }

  return {
    verseTexts: resolveOfflineVerseTexts(bookName, chapter, verses),
    textFidelity: 'offlineFallback' as const,
    exactSplitUnavailableReason,
  };
};

const buildStoredVersePreview = (
  verseTexts: VerseTextEntry[],
  sourceTextPreview: string | null,
  textFidelity: 'exactImported' | 'offlineFallback'
) => {
  if (textFidelity === 'offlineFallback' && sourceTextPreview) {
    return sourceTextPreview;
  }

  return verseTexts.map(verseText => `${verseText.verse}. ${verseText.text}`).join('\n');
};

export const buildImportTextFromShare = (
  payload: Pick<PendingImportShare, 'title' | 'text' | 'url'>
) => {
  const parts = [payload.title, payload.text].filter(
    (value): value is string => Boolean(value?.trim())
  );

  const trimmedUrl = payload.url?.trim();
  if (trimmedUrl && !parts.some(part => part.includes(trimmedUrl))) {
    parts.push(trimmedUrl);
  }

  return parts.join('\n\n').trim();
};

export const createPendingShare = (
  payload: Omit<PendingImportShare, 'capturedAt'>
): PendingImportShare => ({
  ...payload,
  capturedAt: Date.now(),
});

export const parseImportedVerse = async ({
  channel,
  sharedText,
  sourceUrl,
  exactVerseTextResolver,
}: {
  channel: ImportSourceChannel;
  sharedText: string;
  sourceUrl?: string | null;
  exactVerseTextResolver?: ExactVerseTextResolver;
}): Promise<VerseImportParseResult> => {
  const normalizedText = sharedText.trim();
  const resolvedSourceUrl = sourceUrl ?? getFirstUrl(normalizedText);

  if (!normalizedText) {
    return {
      parsed: null,
      error: 'Paste or share a verse reference before importing.',
    };
  }

  try {
    const reference =
      parseBibleDotComUrl(resolvedSourceUrl, normalizedText) ??
      parseReferenceFromText(normalizedText, resolvedSourceUrl);

    if (!reference) {
      return {
        parsed: null,
        error:
          'Could not find a supported verse reference. Try a Bible.com link or a citation like "John 3:16 NIV".',
      };
    }

    const referenceLabel = `${reference.bookName} ${reference.chapter}:${reference.selectionLabel}${
      reference.version ? ` ${reference.version}` : ''
    }`;
    const sourceTextPreview = buildSourceTextPreview(
      normalizedText,
      referenceLabel,
      reference.sourceUrl
    );
    const {
      verseTexts,
      textFidelity,
      exactSplitUnavailableReason,
    } = await resolveImportedVerseTexts({
      bookName: reference.bookName,
      chapter: reference.chapter,
      verses: reference.verses,
      sourceTextPreview,
      provider: reference.provider,
      sourceUrl: reference.sourceUrl,
      exactVerseTextResolver,
    });
    const previewVersionLabel = sourceTextPreview
      ? reference.version ?? 'Imported text'
      : textFidelity === 'exactImported'
        ? reference.version ?? 'Imported text'
        : 'KJV';
    const storedVersionLabel =
      textFidelity === 'exactImported'
        ? reference.version ?? 'Imported text'
        : 'KJV fallback';

    return {
      parsed: {
        bookName: reference.bookName,
        chapter: reference.chapter,
        verses: reference.verses,
        verseTexts,
        importSource: {
          provider: reference.provider,
          channel,
          version: reference.version,
          sourceUrl: reference.sourceUrl,
          sharedText: normalizedText,
          textFidelity,
        },
        referenceLabel,
        sourceTextPreview,
        previewVersionLabel,
        storedVersionLabel,
        textFidelity,
        exactSplitUnavailableReason,
        storedVersePreview: buildStoredVersePreview(
          verseTexts,
          sourceTextPreview,
          textFidelity
        ),
      },
      error: null,
    };
  } catch (error) {
    return {
      parsed: null,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to parse that verse reference.',
    };
  }
};
