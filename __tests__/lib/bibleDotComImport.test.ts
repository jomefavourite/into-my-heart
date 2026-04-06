import {
  MAX_EXACT_BIBLE_DOT_COM_VERSES,
  extractBibleDotComSingleVerseText,
  resolveExactBibleDotComVerseTextsFromFetcher,
} from '@/lib/bibleDotComImport';

describe('extractBibleDotComSingleVerseText', () => {
  test('prefers verse content from __NEXT_DATA__', () => {
    const html = `
      <html>
        <body>
          <script id="__NEXT_DATA__" type="application/json">
            ${JSON.stringify({
              props: {
                pageProps: {
                  verses: [
                    {
                      content:
                        'When Jesus saw Nathanael approaching, he said of him, “Here truly is an Israelite in whom there is no deceit.”',
                    },
                  ],
                },
              },
            })}
          </script>
        </body>
      </html>
    `;

    expect(extractBibleDotComSingleVerseText(html)).toBe(
      'When Jesus saw Nathanael approaching, he said of him, “Here truly is an Israelite in whom there is no deceit.”'
    );
  });
});

describe('resolveExactBibleDotComVerseTextsFromFetcher', () => {
  test('derives single-verse urls from a range url and returns exact ordered verse texts', async () => {
    const fetchHtml = jest
      .fn<Promise<string>, [string]>()
      .mockImplementation(async url => {
        const verseMatch = url.match(/\.1\.(\d+)\.NIV$/);
        const verse = verseMatch?.[1] ?? '0';

        return `
          <script id="__NEXT_DATA__" type="application/json">
            ${JSON.stringify({
              props: {
                pageProps: {
                  verses: [{ content: `Verse ${verse} imported text.` }],
                },
              },
            })}
          </script>
        `;
      });

    const result = await resolveExactBibleDotComVerseTextsFromFetcher({
      sourceUrl: 'https://www.bible.com/bible/111/JHN.1.47-50.NIV',
      verses: ['47', '48', '49', '50'],
      fetchHtml,
    });

    expect(result).toEqual({
      status: 'exact',
      verseTexts: [
        { verse: '47', text: 'Verse 47 imported text' },
        { verse: '48', text: 'Verse 48 imported text' },
        { verse: '49', text: 'Verse 49 imported text' },
        { verse: '50', text: 'Verse 50 imported text' },
      ],
    });
    expect(fetchHtml.mock.calls.map(call => call[0])).toEqual([
      'https://www.bible.com/bible/111/JHN.1.47.NIV',
      'https://www.bible.com/bible/111/JHN.1.48.NIV',
      'https://www.bible.com/bible/111/JHN.1.49.NIV',
      'https://www.bible.com/bible/111/JHN.1.50.NIV',
    ]);
  });

  test('returns fallback when one verse fetch fails', async () => {
    const fetchHtml = jest
      .fn<Promise<string>, [string]>()
      .mockImplementation(async url => {
        if (url.endsWith('.48.NIV')) {
          throw new Error('network error');
        }

        return `
          <script id="__NEXT_DATA__" type="application/json">
            ${JSON.stringify({
              props: {
                pageProps: {
                  verses: [{ content: 'Imported verse text.' }],
                },
              },
            })}
          </script>
        `;
      });

    const result = await resolveExactBibleDotComVerseTextsFromFetcher({
      sourceUrl: 'https://www.bible.com/bible/111/JHN.1.47-48.NIV',
      verses: ['47', '48'],
      fetchHtml,
    });

    expect(result).toEqual({
      status: 'fallback',
      reason: 'fetchFailed',
    });
  });

  test('returns fallback when parsed text is empty', async () => {
    const fetchHtml = jest.fn().mockResolvedValue('<html><body>No verse text</body></html>');

    const result = await resolveExactBibleDotComVerseTextsFromFetcher({
      sourceUrl: 'https://www.bible.com/bible/111/JHN.1.47.NIV',
      verses: ['47'],
      fetchHtml,
    });

    expect(result).toEqual({
      status: 'fallback',
      reason: 'parseFailed',
    });
  });

  test('returns fallback when too many verses are requested', async () => {
    const verses = Array.from(
      { length: MAX_EXACT_BIBLE_DOT_COM_VERSES + 1 },
      (_, index) => String(index + 1)
    );
    const fetchHtml = jest.fn();

    const result = await resolveExactBibleDotComVerseTextsFromFetcher({
      sourceUrl: 'https://www.bible.com/bible/111/JHN.1.1-21.NIV',
      verses,
      fetchHtml,
    });

    expect(result).toEqual({
      status: 'fallback',
      reason: 'tooManyVerses',
    });
    expect(fetchHtml).not.toHaveBeenCalled();
  });
});
