import { v } from 'convex/values';
import { action } from './_generated/server';
import { resolveExactBibleDotComVerseTextsFromFetcher } from '../lib/bibleDotComImport';

export const resolveExactBibleDotComVerseTexts = action({
  args: {
    sourceUrl: v.string(),
    verses: v.array(v.string()),
  },
  handler: async (_ctx, args) => {
    return resolveExactBibleDotComVerseTextsFromFetcher({
      sourceUrl: args.sourceUrl,
      verses: args.verses,
      fetchHtml: async url => {
        const response = await fetch(url, {
          headers: {
            Accept: 'text/html',
            'User-Agent': 'IntoMyHeartVerseImport/1.0',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch ${url} (${response.status})`);
        }

        return response.text();
      },
    });
  },
});
