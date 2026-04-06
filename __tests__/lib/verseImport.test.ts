import {
  buildImportTextFromShare,
  parseImportedVerse,
} from '@/lib/verseImport';

describe('parseImportedVerse', () => {
  test.each([
    ['NIV', 'https://www.bible.com/bible/111/JHN.3.16.NIV'],
    ['NKJV', 'https://www.bible.com/bible/114/JHN.3.16.NKJV'],
    ['ESV', 'https://www.bible.com/bible/59/JHN.3.16.ESV'],
  ])('parses Bible.com URLs for %s', async (version, url) => {
    const result = await parseImportedVerse({
      channel: 'webShareTarget',
      sharedText: url,
    });

    expect(result.error).toBeNull();
    expect(result.parsed).not.toBeNull();
    expect(result.parsed?.bookName).toBe('John');
    expect(result.parsed?.chapter).toBe(3);
    expect(result.parsed?.verses).toEqual(['16']);
    expect(result.parsed?.importSource.version).toBe(version);
    expect(result.parsed?.importSource.provider).toBe('bible.com');
    expect(result.parsed?.importSource.textFidelity).toBe('offlineFallback');
    expect(result.parsed?.previewVersionLabel).toBe('KJV');
    expect(result.parsed?.storedVersionLabel).toBe('KJV fallback');
  });

  test('parses multiline shared text with trailing Bible.com URL', async () => {
    const result = await parseImportedVerse({
      channel: 'nativeShare',
      sharedText: [
        'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
        'John 3:16 NIV',
        'https://www.bible.com/bible/111/JHN.3.16.NIV',
      ].join('\n\n'),
    });

    expect(result.error).toBeNull();
    expect(result.parsed?.referenceLabel).toBe('John 3:16 NIV');
    expect(result.parsed?.sourceTextPreview).toContain('For God so loved');
    expect(result.parsed?.verseTexts).toEqual([
      {
        verse: '16',
        text:
          'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life',
      },
    ]);
    expect(result.parsed?.importSource.sourceUrl).toBe(
      'https://www.bible.com/bible/111/JHN.3.16.NIV'
    );
    expect(result.parsed?.importSource.textFidelity).toBe('exactImported');
    expect(result.parsed?.previewVersionLabel).toBe('NIV');
    expect(result.parsed?.storedVersionLabel).toBe('NIV');
  });

  test('drops a versionless citation line from the imported text preview', async () => {
    const result = await parseImportedVerse({
      channel: 'paste',
      sharedText: [
        "'The first thing Andrew did was to find his brother Simon and tell him, “We have found the Messiah” (that is, the Christ). '",
        'John 1:41',
        'https://www.bible.com/bible/111/JHN.1.41.NIV',
      ].join('\n\n'),
    });

    expect(result.error).toBeNull();
    expect(result.parsed?.sourceTextPreview).toBe(
      "'The first thing Andrew did was to find his brother Simon and tell him, “We have found the Messiah” (that is, the Christ). '"
    );
    expect(result.parsed?.verseTexts).toEqual([
      expect.objectContaining({
        verse: '41',
        text:
          "'The first thing Andrew did was to find his brother Simon and tell him, “We have found the Messiah” (that is, the Christ). '",
      }),
    ]);
    expect(result.parsed?.verseTexts[0]?.text).not.toContain('John 1:41');
  });

  test('returns exact imported verse texts for multi-verse ranges when exact resolver succeeds', async () => {
    const resolveExactBibleDotComVerseTexts = jest.fn().mockResolvedValue({
      status: 'exact',
      verseTexts: [
        {
          verse: '47',
          text:
            'When Jesus saw Nathanael approaching, he said of him, “Here truly is an Israelite in whom there is no deceit.”',
        },
        {
          verse: '48',
          text:
            '“How do you know me?” Nathanael asked. Jesus answered, “I saw you while you were still under the fig tree before Philip called you.”',
        },
        {
          verse: '49',
          text:
            'Then Nathanael declared, “Rabbi, you are the Son of God; you are the king of Israel.”',
        },
        {
          verse: '50',
          text:
            'Jesus said, “You believe because I told you I saw you under the fig tree. You will see greater things than that.”',
        },
      ],
    });

    const result = await parseImportedVerse({
      channel: 'paste',
      sharedText: [
        "'When Jesus saw Nathanael approaching, he said of him, “Here truly is an Israelite in whom there is no deceit.” “How do you know me?” Nathanael asked. Jesus answered, “I saw you while you were still under the fig tree before Philip called you.” Then Nathanael declared, “Rabbi, you are the Son of God; you are the king of Israel.” Jesus said, “You believe because I told you I saw you under the fig tree. You will see greater things than that.” '",
        'John 1:47-50',
        'https://www.bible.com/bible/111/JHN.1.47-50.NIV',
      ].join('\n\n'),
      exactVerseTextResolver: resolveExactBibleDotComVerseTexts,
    });

    expect(result.error).toBeNull();
    expect(resolveExactBibleDotComVerseTexts).toHaveBeenCalledWith({
      sourceUrl: 'https://www.bible.com/bible/111/JHN.1.47-50.NIV',
      verses: ['47', '48', '49', '50'],
    });
    expect(result.parsed?.textFidelity).toBe('exactImported');
    expect(result.parsed?.previewVersionLabel).toBe('NIV');
    expect(result.parsed?.storedVersionLabel).toBe('NIV');
    expect(result.parsed?.exactSplitUnavailableReason).toBeNull();
    expect(result.parsed?.verseTexts).toEqual([
      {
        verse: '47',
        text:
          'When Jesus saw Nathanael approaching, he said of him, “Here truly is an Israelite in whom there is no deceit.”',
      },
      {
        verse: '48',
        text:
          '“How do you know me?” Nathanael asked. Jesus answered, “I saw you while you were still under the fig tree before Philip called you.”',
      },
      {
        verse: '49',
        text:
          'Then Nathanael declared, “Rabbi, you are the Son of God; you are the king of Israel.”',
      },
      {
        verse: '50',
        text:
          'Jesus said, “You believe because I told you I saw you under the fig tree. You will see greater things than that.”',
      },
    ]);
    expect(result.parsed?.storedVersePreview).toBe(
      [
        '47. When Jesus saw Nathanael approaching, he said of him, “Here truly is an Israelite in whom there is no deceit.”',
        '48. “How do you know me?” Nathanael asked. Jesus answered, “I saw you while you were still under the fig tree before Philip called you.”',
        '49. Then Nathanael declared, “Rabbi, you are the Son of God; you are the king of Israel.”',
        '50. Jesus said, “You believe because I told you I saw you under the fig tree. You will see greater things than that.”',
      ].join('\n')
    );
  });

  test('returns exact imported verse texts for same-chapter comma lists when exact resolver succeeds', async () => {
    const resolveExactBibleDotComVerseTexts = jest.fn().mockResolvedValue({
      status: 'exact',
      verseTexts: [
        {
          verse: '28',
          text:
            'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
        },
        {
          verse: '31',
          text:
            'What, then, shall we say in response to these things? If God is for us, who can be against us?',
        },
        {
          verse: '35',
          text:
            'Who shall separate us from the love of Christ? Shall trouble or hardship or persecution or famine or nakedness or danger or sword?',
        },
      ],
    });

    const result = await parseImportedVerse({
      channel: 'paste',
      sharedText: [
        'Romans 8:28,31,35 ESV',
        'https://www.bible.com/bible/59/ROM.8.28,31,35.ESV',
      ].join('\n\n'),
      exactVerseTextResolver: resolveExactBibleDotComVerseTexts,
    });

    expect(result.error).toBeNull();
    expect(resolveExactBibleDotComVerseTexts).toHaveBeenCalledWith({
      sourceUrl: 'https://www.bible.com/bible/59/ROM.8.28,31,35.ESV',
      verses: ['28', '31', '35'],
    });
    expect(result.parsed?.verseTexts.map(verseText => verseText.verse)).toEqual([
      '28',
      '31',
      '35',
    ]);
    expect(result.parsed?.textFidelity).toBe('exactImported');
  });

  test('uses grouped preview plus fallback metadata when exact split is unavailable', async () => {
    const sharedText = [
      "'When Jesus saw Nathanael approaching, he said of him, “Here truly is an Israelite in whom there is no deceit.” “How do you know me?” Nathanael asked. Jesus answered, “I saw you while you were still under the fig tree before Philip called you.” Then Nathanael declared, “Rabbi, you are the Son of God; you are the king of Israel.” Jesus said, “You believe because I told you I saw you under the fig tree. You will see greater things than that.” '",
      'John 1:47-50',
      'https://www.bible.com/bible/111/JHN.1.47-50.NIV',
    ].join('\n\n');
    const resolveExactBibleDotComVerseTexts = jest.fn().mockResolvedValue({
      status: 'fallback',
      reason: 'fetchFailed',
    });

    const result = await parseImportedVerse({
      channel: 'paste',
      sharedText,
      exactVerseTextResolver: resolveExactBibleDotComVerseTexts,
    });

    expect(result.error).toBeNull();
    expect(result.parsed?.textFidelity).toBe('offlineFallback');
    expect(result.parsed?.previewVersionLabel).toBe('NIV');
    expect(result.parsed?.storedVersionLabel).toBe('KJV fallback');
    expect(result.parsed?.exactSplitUnavailableReason).toBe('fetchFailed');
    expect(result.parsed?.sourceTextPreview).toBe(
      "'When Jesus saw Nathanael approaching, he said of him, “Here truly is an Israelite in whom there is no deceit.” “How do you know me?” Nathanael asked. Jesus answered, “I saw you while you were still under the fig tree before Philip called you.” Then Nathanael declared, “Rabbi, you are the Son of God; you are the king of Israel.” Jesus said, “You believe because I told you I saw you under the fig tree. You will see greater things than that.” '"
    );
    expect(result.parsed?.storedVersePreview).toBe(
      result.parsed?.sourceTextPreview
    );
  });

  test('parses numbered books and range selections', async () => {
    const result = await parseImportedVerse({
      channel: 'paste',
      sharedText: '1 John 1:9-10 NKJV',
    });

    expect(result.error).toBeNull();
    expect(result.parsed?.bookName).toBe('1 John');
    expect(result.parsed?.chapter).toBe(1);
    expect(result.parsed?.verses).toEqual(['9', '10']);
    expect(result.parsed?.importSource.version).toBe('NKJV');
  });

  test('parses same-chapter comma lists', async () => {
    const result = await parseImportedVerse({
      channel: 'paste',
      sharedText: 'Romans 8:28,31,35 ESV',
    });

    expect(result.error).toBeNull();
    expect(result.parsed?.verses).toEqual(['28', '31', '35']);
  });

  test('rejects multi-chapter references', async () => {
    const result = await parseImportedVerse({
      channel: 'paste',
      sharedText: 'John 3:16-4:2 NIV',
    });

    expect(result.parsed).toBeNull();
    expect(result.error).toMatch(/Multi-chapter imports are not supported yet/);
  });

  test('returns a helpful error for unsupported content', async () => {
    const result = await parseImportedVerse({
      channel: 'paste',
      sharedText: 'This is just a quote without a citation.',
    });

    expect(result.parsed).toBeNull();
    expect(result.error).toMatch(/Could not find a supported verse reference/);
  });
});

describe('buildImportTextFromShare', () => {
  test('combines title, text, and url without duplicating the url', () => {
    expect(
      buildImportTextFromShare({
        title: 'Verse of the Day',
        text: 'John 3:16 NIV',
        url: 'https://www.bible.com/bible/111/JHN.3.16.NIV',
      })
    ).toBe(
      [
        'Verse of the Day',
        'John 3:16 NIV',
        'https://www.bible.com/bible/111/JHN.3.16.NIV',
      ].join('\n\n')
    );
  });
});
