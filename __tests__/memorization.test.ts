import {
  applyPracticeOutcomeToProgress,
  buildMemorizationVerseStates,
  getPracticeMethodLabel,
  planSmartVerseSession,
} from '@/lib/memorization';
import type { OfflineVerse, OfflineVerseProgress } from '@/lib/offline-sync';

const createVerse = (
  syncId: string,
  updatedAt: number,
  reviewFreq = 'Daily'
): OfflineVerse => ({
  syncId,
  bookName: 'John',
  chapter: 3,
  verses: ['16'],
  verseTexts: [{ verse: '16', text: 'For God so loved the world' }],
  reviewFreq,
  updatedAt,
  deletedAt: null,
});

const createProgress = (
  verseKey: string,
  overrides: Partial<OfflineVerseProgress> = {}
): OfflineVerseProgress => ({
  syncId: `verse-progress-${verseKey}`,
  verseKey,
  totalCompletionCount: 1,
  flashcardsCount: 1,
  fillInBlanksCount: 0,
  recitationCount: 0,
  lastPracticedAt: 1_000,
  status: 'learning',
  nextMethod: 'fillInBlanks',
  dueAt: 2_000,
  successfulReviewCount: 0,
  lastOutcome: 'pass',
  updatedAt: 1_000,
  ...overrides,
});

describe('memorization engine', () => {
  it('moves a verse from flashcards to fill in the blanks on success', () => {
    const verse = createVerse('verse-1', 1_000);

    const progress = applyPracticeOutcomeToProgress({
      verse,
      method: 'flashcards',
      outcome: 'pass',
      now: 10_000,
    });

    expect(progress.status).toBe('learning');
    expect(progress.nextMethod).toBe('fillInBlanks');
    expect(progress.dueAt).toBe(10_000);
    expect(progress.flashcardsCount).toBe(1);
  });

  it('schedules strengthening reviews after a successful recitation', () => {
    const verse = createVerse('verse-1', 1_000, 'Every other day');

    const progress = applyPracticeOutcomeToProgress({
      verse,
      currentProgress: createProgress('verse-1', {
        status: 'learning',
        nextMethod: 'recitation',
        flashcardsCount: 1,
        fillInBlanksCount: 1,
      }),
      method: 'recitation',
      outcome: 'pass',
      now: 20_000,
    });

    expect(progress.status).toBe('strengthening');
    expect(progress.nextMethod).toBe('recitation');
    expect(progress.dueAt).toBe(20_000 + 2 * 24 * 60 * 60 * 1000);
  });

  it('prioritizes due learning verses before new verses in the smart queue', () => {
    const now = 50_000;
    const newVerse = createVerse('new-verse', 5_000);
    const dueLearningVerse = createVerse('learning-verse', 4_000);

    const session = planSmartVerseSession({
      verses: [newVerse, dueLearningVerse],
      verseProgress: [
        createProgress('learning-verse', {
          verseKey: 'learning-verse',
          status: 'learning',
          nextMethod: 'fillInBlanks',
          dueAt: now - 1,
        }),
      ],
      now,
    });

    expect(session?.method).toBe('fillInBlanks');
    expect(session?.verses.map(verse => verse.syncId)).toEqual(['learning-verse']);
  });

  it('creates default new-verse state for verses without progress', () => {
    const verse = createVerse('new-verse', 1_000);

    const [state] = buildMemorizationVerseStates({
      verses: [verse],
      verseProgress: [],
      now: 10_000,
    });

    expect(state.isNew).toBe(true);
    expect(state.progress.nextMethod).toBe('flashcards');
    expect(state.isDue).toBe(true);
  });

  it('keeps label text aligned with supported techniques', () => {
    expect(getPracticeMethodLabel('flashcards')).toBe('Flashcards');
    expect(getPracticeMethodLabel('fillInBlanks')).toBe('Fill in the blanks');
    expect(getPracticeMethodLabel('recitation')).toBe('Recitation');
  });
});
