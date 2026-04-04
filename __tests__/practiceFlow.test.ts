import {
  buildTechniqueCollectionSession,
  buildTechniqueVerseSession,
} from '@/lib/practiceFlow';
import type { OfflineCollection, OfflineVerse } from '@/lib/offline-sync';

const createVerse = (syncId: string): OfflineVerse => ({
  syncId,
  bookName: 'John',
  chapter: 3,
  verses: [syncId],
  verseTexts: [{ verse: syncId, text: `Verse ${syncId}` }],
  reviewFreq: 'Daily',
  updatedAt: Number(syncId),
  deletedAt: null,
});

const createCollection = (
  syncId: string,
  verseIds: string[]
): OfflineCollection => ({
  syncId,
  collectionName: `Collection ${syncId}`,
  versesLength: verseIds.length,
  collectionVerses: verseIds.map(verseId => ({
    bookName: 'Psalm',
    chapter: 1,
    verses: [verseId],
    verseTexts: [{ verse: verseId, text: `Collection verse ${verseId}` }],
    reviewFreq: 'Daily',
  })),
  updatedAt: Number(syncId),
  deletedAt: null,
});

describe('practice flow helpers', () => {
  it('starts verse sessions with every saved verse in the visible order', () => {
    const verses = [createVerse('1'), createVerse('2'), createVerse('3')];

    const sessionVerses = buildTechniqueVerseSession({
      verses,
      randomizeOrder: false,
    });

    expect(sessionVerses.map(verse => verse.syncId)).toEqual(['1', '2', '3']);
  });

  it('starts collection sessions with every verse from every saved collection', () => {
    const collections = [
      createCollection('1', ['11', '12']),
      createCollection('2', ['21']),
    ];

    const sessionVerses = buildTechniqueCollectionSession({
      collections,
      randomizeOrder: false,
    });

    expect(sessionVerses.map(verse => verse.verses[0])).toEqual(['11', '12', '21']);
  });

  it('reshuffles the session order when randomize is enabled', () => {
    const verses = [createVerse('1'), createVerse('2'), createVerse('3')];

    const sessionVerses = buildTechniqueVerseSession({
      verses,
      randomizeOrder: true,
      random: () => 0,
    });

    expect(sessionVerses.map(verse => verse.syncId)).toEqual(['2', '3', '1']);
  });
});
