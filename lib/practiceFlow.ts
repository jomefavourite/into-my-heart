import type { Href } from 'expo-router';
import type { OfflineCollection, OfflineVerse } from '@/lib/offline-sync';
import { SMART_MEMORIZATION_SESSION_LIMIT, getMemorizationVerseKey } from '@/lib/memorization';
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
    verseLimit: SMART_MEMORIZATION_SESSION_LIMIT,
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
    verseLimit: SMART_MEMORIZATION_SESSION_LIMIT,
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
    verseLimit: SMART_MEMORIZATION_SESSION_LIMIT,
    startRoute: '/memorize/recitation',
    practiceRoute: '/memorize/recitation/practice',
    completeRoute: '/memorize/recitation/practice-complete',
    nextMethod: null,
  },
};

export const getPracticeMethodMeta = (method: PracticeMethod) =>
  PRACTICE_METHOD_META[method];

export const getPracticeVerseKey = (verse: PracticeVerse) =>
  getMemorizationVerseKey(verse);

const shuffleItems = <T>(items: T[], random = Math.random) => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
};

export const buildTechniqueVerseSession = ({
  verses,
  randomizeOrder = false,
  random = Math.random,
}: {
  verses: OfflineVerse[];
  randomizeOrder?: boolean;
  random?: () => number;
}) => (randomizeOrder ? shuffleItems(verses, random) : [...verses]);

export const buildTechniqueCollectionSession = ({
  collections,
  randomizeOrder = false,
  random = Math.random,
}: {
  collections: OfflineCollection[];
  randomizeOrder?: boolean;
  random?: () => number;
}) => {
  const allCollectionVerses = collections.flatMap(
    collection => collection.collectionVerses
  );

  return randomizeOrder
    ? shuffleItems(allCollectionVerses, random)
    : [...allCollectionVerses];
};
