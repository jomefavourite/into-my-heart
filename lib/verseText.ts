type BibleTextValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | BibleTextValue[]
  | {
      text?: BibleTextValue;
      content?: BibleTextValue;
      Btext?: BibleTextValue;
      children?: BibleTextValue;
      wordsOfJesus?: BibleTextValue;
      [key: string]: BibleTextValue;
    };

const appendTextParts = (value: unknown, parts: string[]) => {
  if (value == null || typeof value === 'boolean') {
    return;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const normalized = String(value).trim();
    if (normalized) {
      parts.push(normalized);
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach(item => appendTextParts(item, parts));
    return;
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const prioritizedKeys = ['Btext', 'text', 'content', 'children'];
    const prioritizedValues = prioritizedKeys
      .filter(key => key in record)
      .map(key => record[key]);

    if (prioritizedValues.length > 0) {
      prioritizedValues.forEach(item => appendTextParts(item, parts));
      return;
    }

    Object.values(record).forEach(item => appendTextParts(item, parts));
  }
};

export const normalizeBibleText = (value: unknown): string => {
  const parts: string[] = [];
  appendTextParts(value, parts);

  return parts
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const normalizeVerseTextEntry = (
  entry: { verse?: unknown; text?: unknown } | null | undefined
) => ({
  verse: entry?.verse == null ? '' : String(entry.verse),
  text: normalizeBibleText(entry?.text),
});

export const normalizeVerseTexts = (
  entries: Array<{ verse?: unknown; text?: unknown } | null | undefined>
) => entries.map(normalizeVerseTextEntry);
