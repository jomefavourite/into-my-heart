import {
  buildBibleDotComSingleVerseUrl,
  parseBibleDotComUrlParts,
} from '@/lib/bibleDotCom';
import type { VerseTextEntry } from '@/lib/offline-sync';

export const MAX_EXACT_BIBLE_DOT_COM_VERSES = 20;

export type ExactSplitFallbackReason =
  | 'fetchFailed'
  | 'parseFailed'
  | 'tooManyVerses';

export type ExactBibleDotComVerseTextsResult =
  | { status: 'exact'; verseTexts: VerseTextEntry[] }
  | { status: 'fallback'; reason: ExactSplitFallbackReason };

const namedEntities: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"',
  '#39': "'",
};

const decodeHtmlEntities = (value: string) =>
  value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
    const normalized = String(entity).toLowerCase();

    if (normalized in namedEntities) {
      return namedEntities[normalized];
    }

    if (normalized.startsWith('#x')) {
      const codePoint = Number.parseInt(normalized.slice(2), 16);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }

    if (normalized.startsWith('#')) {
      const codePoint = Number.parseInt(normalized.slice(1), 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }

    return match;
  });

export const normalizeImportedText = (value: string) =>
  value
    .replace(/\s+/g, ' ')
    .replace(/^[\s.,;:!?-]+|[\s.,;:!?-]+$/g, '')
    .trim();

const stripHtml = (value: string) =>
  decodeHtmlEntities(
    value
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();

const extractVerseTextFromNextData = (html: string) => {
  const nextDataMatch = html.match(
    /<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i
  );

  if (!nextDataMatch?.[1]) {
    return null;
  }

  try {
    const nextData = JSON.parse(nextDataMatch[1]) as {
      props?: {
        pageProps?: {
          verses?: Array<{ content?: string }>;
        };
      };
    };

    const text = nextData.props?.pageProps?.verses?.[0]?.content;
    if (!text) {
      return null;
    }

    const normalized = normalizeImportedText(text);
    return normalized || null;
  } catch {
    return null;
  }
};

const extractMetaDescription = (html: string) => {
  const metaPatterns = [
    /<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i,
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i,
    /<meta[^>]+content=["']([\s\S]*?)["'][^>]+name=["']description["'][^>]*>/i,
    /<meta[^>]+content=["']([\s\S]*?)["'][^>]+property=["']og:description["'][^>]*>/i,
  ];

  for (const pattern of metaPatterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      const normalized = normalizeImportedText(stripHtml(match[1]));
      if (normalized) {
        return normalized;
      }
    }
  }

  return null;
};

export const extractBibleDotComSingleVerseText = (html: string) => {
  const nextDataText = extractVerseTextFromNextData(html);
  if (nextDataText) {
    return nextDataText;
  }

  const paragraphAfterHeadingMatch = html.match(
    /<h2[^>]*>[\s\S]*?<\/h2>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i
  );

  if (paragraphAfterHeadingMatch?.[1]) {
    const normalized = normalizeImportedText(stripHtml(paragraphAfterHeadingMatch[1]));
    if (normalized) {
      return normalized;
    }
  }

  return extractMetaDescription(html);
};

const mapWithConcurrency = async <TInput, TOutput>(
  items: TInput[],
  concurrency: number,
  mapper: (item: TInput, index: number) => Promise<TOutput>
) => {
  const results = new Array<TOutput>(items.length);
  let currentIndex = 0;

  const workers = Array.from({
    length: Math.min(concurrency, items.length),
  }).map(async () => {
    while (currentIndex < items.length) {
      const nextIndex = currentIndex;
      currentIndex += 1;
      results[nextIndex] = await mapper(items[nextIndex], nextIndex);
    }
  });

  await Promise.all(workers);
  return results;
};

export const resolveExactBibleDotComVerseTextsFromFetcher = async ({
  sourceUrl,
  verses,
  fetchHtml,
}: {
  sourceUrl: string;
  verses: string[];
  fetchHtml: (url: string) => Promise<string>;
}): Promise<ExactBibleDotComVerseTextsResult> => {
  if (verses.length > MAX_EXACT_BIBLE_DOT_COM_VERSES) {
    return { status: 'fallback', reason: 'tooManyVerses' };
  }

  const parsedUrl = parseBibleDotComUrlParts(sourceUrl);
  if (!parsedUrl) {
    return { status: 'fallback', reason: 'parseFailed' };
  }

  try {
    const verseTexts = await mapWithConcurrency(verses, 4, async verse => {
      const html = await fetchHtml(buildBibleDotComSingleVerseUrl(parsedUrl, verse));
      const text = extractBibleDotComSingleVerseText(html);

      if (!text) {
        throw new Error(`parseFailed:${verse}`);
      }

      return {
        verse,
        text,
      };
    });

    const matchesRequestedVerses =
      verseTexts.length === verses.length &&
      verseTexts.every((entry, index) => entry.verse === verses[index] && Boolean(entry.text));

    if (!matchesRequestedVerses) {
      return { status: 'fallback', reason: 'parseFailed' };
    }

    return {
      status: 'exact',
      verseTexts,
    };
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('parseFailed:')) {
      return { status: 'fallback', reason: 'parseFailed' };
    }

    return { status: 'fallback', reason: 'fetchFailed' };
  }
};
