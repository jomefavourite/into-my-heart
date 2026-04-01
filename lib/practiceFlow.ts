import type { Href } from 'expo-router';
import type { PracticeVerse } from '@/store/practiceStore';

export type PracticeMethod = 'flashcards' | 'fillInBlanks' | 'recitation';

type PracticeMethodMeta = {
  label: string;
  shortLabel: string;
  description: string;
  tip: string;
  verseLimit: number;
  startRoute: Href;
  practiceRoute: Href;
  completeRoute: Href;
  nextMethod: PracticeMethod | null;
};

export const PRACTICE_METHOD_META: Record<PracticeMethod, PracticeMethodMeta> = {
  flashcards: {
    label: 'Flashcards',
    shortLabel: 'Flashcards',
    description:
      'Start with recognition. Look at the reference first, say the verse aloud, then flip to check your recall.',
    tip: 'Best first step: use short sessions and say each verse before revealing it.',
    verseLimit: 7,
    startRoute: '/memorize/flashcards',
    practiceRoute: '/memorize/flashcards/practice',
    completeRoute: '/memorize/flashcards/practice-complete',
    nextMethod: 'fillInBlanks',
  },
  fillInBlanks: {
    label: 'Fill in the blanks',
    shortLabel: 'Fill in the blanks',
    description:
      'Move from recognition to recall by restoring key words from memory inside the verse itself.',
    tip: 'Best second step: work on a few verses at a time so the missing words stay meaningful.',
    verseLimit: 5,
    startRoute: '/memorize/fill-in-blanks',
    practiceRoute: '/memorize/fill-in-blanks/practice',
    completeRoute: '/memorize/fill-in-blanks/practice-complete',
    nextMethod: 'recitation',
  },
  recitation: {
    label: 'Recitation',
    shortLabel: 'Recitation',
    description:
      'Finish with active recall. Use light prompts, then hide the text and recite the verse from memory.',
    tip: 'Best final step: try it without looking, then check yourself honestly and repeat hard verses.',
    verseLimit: 5,
    startRoute: '/memorize/recitation',
    practiceRoute: '/memorize/recitation/practice',
    completeRoute: '/memorize/recitation/practice-complete',
    nextMethod: null,
  },
};

export const getPracticeMethodMeta = (method: PracticeMethod) =>
  PRACTICE_METHOD_META[method];

export const getPracticeVerseKey = (verse: PracticeVerse) => {
  if ('_id' in verse && typeof verse._id === 'string' && verse._id.length > 0) {
    return verse._id;
  }

  return `${verse.bookName}-${verse.chapter}-${verse.verses.join('-')}`;
};
