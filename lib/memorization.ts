import type {
  MemorizationStatus,
  OfflineVerse,
  OfflineVerseProgress,
  PracticeMethod,
  PracticeOutcome,
} from '@/lib/offline-sync';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const MINUTE_IN_MS = 60 * 1000;
const REVIEW_INTERVAL_MULTIPLIERS = [1, 2, 4, 7, 10];

export const SMART_MEMORIZATION_SESSION_LIMIT = 5;

type VerseKeyInput = {
  syncId?: string;
  _id?: string;
  bookName: string;
  chapter: number;
  verses: string[];
};

export type MemorizationVerseState = {
  verse: OfflineVerse;
  verseKey: string;
  progress: OfflineVerseProgress;
  isNew: boolean;
  isLearning: boolean;
  isStrengthening: boolean;
  isMastered: boolean;
  isDue: boolean;
  isDueToday: boolean;
};

export type PlannedVerseSession = {
  method: PracticeMethod;
  verses: OfflineVerse[];
  totalMatchingVerses: number;
  reason: string;
};

const getEndOfToday = (now: number) => {
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);
  return endOfToday.getTime();
};

export const getMemorizationVerseKey = (verse: VerseKeyInput) => {
  if (verse._id && verse._id.length > 0) {
    return verse._id;
  }

  if (verse.syncId && verse.syncId.length > 0) {
    return verse.syncId;
  }

  return `${verse.bookName}-${verse.chapter}-${verse.verses.join('-')}`;
};

export const getReviewFrequencyBaseInterval = (reviewFreq?: string) => {
  const normalizedReviewFreq = reviewFreq?.trim().toLowerCase();

  if (normalizedReviewFreq === 'weekly') {
    return 7 * DAY_IN_MS;
  }

  if (normalizedReviewFreq === 'every other day') {
    return 2 * DAY_IN_MS;
  }

  return DAY_IN_MS;
};

export const getScheduledReviewInterval = (
  reviewFreq: string | undefined,
  successfulReviewCount: number
) => {
  const multiplier =
    REVIEW_INTERVAL_MULTIPLIERS[
      Math.min(successfulReviewCount, REVIEW_INTERVAL_MULTIPLIERS.length - 1)
    ] ?? REVIEW_INTERVAL_MULTIPLIERS[REVIEW_INTERVAL_MULTIPLIERS.length - 1];

  return getReviewFrequencyBaseInterval(reviewFreq) * multiplier;
};

const deriveLegacyStatus = (
  progress: Partial<OfflineVerseProgress>
): {
  status: MemorizationStatus;
  nextMethod: PracticeMethod;
  successfulReviewCount: number;
} => {
  if ((progress.recitationCount ?? 0) > 0) {
    return {
      status: 'strengthening',
      nextMethod: 'recitation',
      successfulReviewCount: 0,
    };
  }

  if ((progress.fillInBlanksCount ?? 0) > 0) {
    return {
      status: 'learning',
      nextMethod: 'recitation',
      successfulReviewCount: 0,
    };
  }

  if ((progress.flashcardsCount ?? 0) > 0) {
    return {
      status: 'learning',
      nextMethod: 'fillInBlanks',
      successfulReviewCount: 0,
    };
  }

  return {
    status: 'new',
    nextMethod: 'flashcards',
    successfulReviewCount: 0,
  };
};

export const normalizeVerseProgress = (
  progress: Partial<OfflineVerseProgress> | null | undefined,
  now = Date.now()
): OfflineVerseProgress => {
  const fallback = deriveLegacyStatus(progress ?? {});
  const lastPracticedAt = progress?.lastPracticedAt ?? now;
  const hasStructuredFields =
    progress?.status !== undefined &&
    progress?.nextMethod !== undefined &&
    progress?.dueAt !== undefined;

  return {
    syncId:
      progress?.syncId ??
      `verse-progress-${progress?.verseKey ?? `unknown-${now}`}`,
    remoteId: progress?.remoteId,
    verseKey: progress?.verseKey ?? '',
    totalCompletionCount: progress?.totalCompletionCount ?? 0,
    flashcardsCount: progress?.flashcardsCount ?? 0,
    fillInBlanksCount: progress?.fillInBlanksCount ?? 0,
    recitationCount: progress?.recitationCount ?? 0,
    lastPracticedAt,
    status: progress?.status ?? fallback.status,
    nextMethod: progress?.nextMethod ?? fallback.nextMethod,
    dueAt:
      progress?.dueAt ??
      (hasStructuredFields ? lastPracticedAt : now),
    successfulReviewCount:
      progress?.successfulReviewCount ?? fallback.successfulReviewCount,
    lastOutcome: progress?.lastOutcome ?? 'pass',
    lastFlashcardsAt:
      progress?.lastFlashcardsAt ??
      ((progress?.flashcardsCount ?? 0) > 0 ? lastPracticedAt : undefined),
    lastFillInBlanksAt:
      progress?.lastFillInBlanksAt ??
      ((progress?.fillInBlanksCount ?? 0) > 0 ? lastPracticedAt : undefined),
    lastRecitationAt:
      progress?.lastRecitationAt ??
      ((progress?.recitationCount ?? 0) > 0 ? lastPracticedAt : undefined),
    updatedAt: progress?.updatedAt ?? lastPracticedAt,
    deletedAt: progress?.deletedAt ?? null,
    pendingSync: progress?.pendingSync,
    lastSyncedAt: progress?.lastSyncedAt,
  };
};

export const createInitialVerseProgress = (
  verse: VerseKeyInput,
  now = Date.now()
): OfflineVerseProgress =>
  normalizeVerseProgress(
    {
      syncId: `verse-progress-${getMemorizationVerseKey(verse)}`,
      verseKey: getMemorizationVerseKey(verse),
      status: 'new',
      nextMethod: 'flashcards',
      dueAt: now,
      successfulReviewCount: 0,
      lastOutcome: 'pass',
      totalCompletionCount: 0,
      flashcardsCount: 0,
      fillInBlanksCount: 0,
      recitationCount: 0,
      lastPracticedAt: now,
      updatedAt: now,
      deletedAt: null,
    },
    now
  );

export const applyPracticeOutcomeToProgress = ({
  currentProgress,
  verse,
  method,
  outcome,
  now,
}: {
  currentProgress?: Partial<OfflineVerseProgress> | null;
  verse: VerseKeyInput & { reviewFreq?: string };
  method: PracticeMethod;
  outcome: PracticeOutcome;
  now?: number;
}): OfflineVerseProgress => {
  const timestamp = now ?? Date.now();
  const progress = normalizeVerseProgress(
    currentProgress ?? createInitialVerseProgress(verse, timestamp),
    timestamp
  );
  const nextProgress: OfflineVerseProgress = {
    ...progress,
    verseKey: getMemorizationVerseKey(verse),
    totalCompletionCount: progress.totalCompletionCount + 1,
    lastPracticedAt: timestamp,
    updatedAt: timestamp,
    lastOutcome: outcome,
  };

  if (method === 'flashcards') {
    nextProgress.flashcardsCount += 1;
    nextProgress.lastFlashcardsAt = timestamp;
    nextProgress.status = 'learning';
    nextProgress.nextMethod =
      outcome === 'pass' ? 'fillInBlanks' : 'flashcards';
    nextProgress.dueAt =
      outcome === 'pass' ? timestamp : timestamp + 15 * MINUTE_IN_MS;
    nextProgress.successfulReviewCount = 0;
    return nextProgress;
  }

  if (method === 'fillInBlanks') {
    nextProgress.fillInBlanksCount += 1;
    nextProgress.lastFillInBlanksAt = timestamp;
    nextProgress.status = 'learning';
    nextProgress.nextMethod =
      outcome === 'pass' ? 'recitation' : 'fillInBlanks';
    nextProgress.dueAt =
      outcome === 'pass' ? timestamp : timestamp + 15 * MINUTE_IN_MS;
    nextProgress.successfulReviewCount = 0;
    return nextProgress;
  }

  nextProgress.recitationCount += 1;
  nextProgress.lastRecitationAt = timestamp;
  nextProgress.nextMethod = 'recitation';

  if (outcome === 'needsReview') {
    nextProgress.status =
      progress.status === 'mastered' ? 'strengthening' : 'learning';
    nextProgress.dueAt = timestamp + 15 * MINUTE_IN_MS;
    return nextProgress;
  }

  if (progress.status === 'strengthening' || progress.status === 'mastered') {
    const successfulReviewCount = progress.successfulReviewCount + 1;
    nextProgress.successfulReviewCount = successfulReviewCount;
    nextProgress.status =
      successfulReviewCount >= 2 ? 'mastered' : 'strengthening';
    nextProgress.dueAt =
      timestamp +
      getScheduledReviewInterval(verse.reviewFreq, successfulReviewCount);
    return nextProgress;
  }

  nextProgress.status = 'strengthening';
  nextProgress.successfulReviewCount = 0;
  nextProgress.dueAt =
    timestamp + getScheduledReviewInterval(verse.reviewFreq, 0);
  return nextProgress;
};

export const buildMemorizationVerseStates = ({
  verses,
  verseProgress,
  now = Date.now(),
}: {
  verses: OfflineVerse[];
  verseProgress: OfflineVerseProgress[];
  now?: number;
}): MemorizationVerseState[] => {
  const endOfToday = getEndOfToday(now);
  const progressByVerseKey = new Map(
    verseProgress.map(record => [record.verseKey, normalizeVerseProgress(record, now)])
  );

  return verses.map(verse => {
    const verseKey = getMemorizationVerseKey(verse);
    const progress =
      progressByVerseKey.get(verseKey) ?? createInitialVerseProgress(verse, now);
    const isDue = progress.dueAt <= now;
    const isDueToday = progress.dueAt <= endOfToday;

    return {
      verse,
      verseKey,
      progress,
      isNew: progress.status === 'new',
      isLearning: progress.status === 'learning',
      isStrengthening: progress.status === 'strengthening',
      isMastered: progress.status === 'mastered',
      isDue,
      isDueToday,
    };
  });
};

const sortStatesByPriority = (left: MemorizationVerseState, right: MemorizationVerseState) => {
  if (left.progress.dueAt !== right.progress.dueAt) {
    return left.progress.dueAt - right.progress.dueAt;
  }

  if (left.progress.lastPracticedAt !== right.progress.lastPracticedAt) {
    return left.progress.lastPracticedAt - right.progress.lastPracticedAt;
  }

  return left.verse.updatedAt - right.verse.updatedAt;
};

const createPlannedSession = (
  verses: MemorizationVerseState[],
  method: PracticeMethod,
  reason: string,
  limit: number
): PlannedVerseSession => ({
  method,
  verses: verses.slice(0, limit).map(state => state.verse),
  totalMatchingVerses: verses.length,
  reason,
});

export const planSmartVerseSession = ({
  verses,
  verseProgress,
  now = Date.now(),
  limit = SMART_MEMORIZATION_SESSION_LIMIT,
}: {
  verses: OfflineVerse[];
  verseProgress: OfflineVerseProgress[];
  now?: number;
  limit?: number;
}): PlannedVerseSession | null => {
  const states = buildMemorizationVerseStates({ verses, verseProgress, now });
  const learningDueStates = states
    .filter(state => state.isLearning && state.isDue)
    .sort(sortStatesByPriority);

  if (learningDueStates.length > 0) {
    const groupedByMethod = new Map<PracticeMethod, MemorizationVerseState[]>();
    learningDueStates.forEach(state => {
      const matches = groupedByMethod.get(state.progress.nextMethod) ?? [];
      matches.push(state);
      groupedByMethod.set(state.progress.nextMethod, matches);
    });

    const nextMethodGroup = [...groupedByMethod.entries()].sort((left, right) =>
      sortStatesByPriority(left[1][0], right[1][0])
    )[0];

    if (nextMethodGroup) {
      return createPlannedSession(
        nextMethodGroup[1],
        nextMethodGroup[0],
        `Due now for ${
          nextMethodGroup[0] === 'fillInBlanks'
            ? 'Fill in the blanks'
            : nextMethodGroup[0] === 'recitation'
              ? 'Recitation'
              : 'Flashcards'
        }`,
        limit
      );
    }
  }

  const reviewDueStates = states
    .filter(
      state =>
        (state.isStrengthening || state.isMastered) &&
        state.progress.nextMethod === 'recitation' &&
        state.isDue
    )
    .sort(sortStatesByPriority);

  if (reviewDueStates.length > 0) {
    return createPlannedSession(
      reviewDueStates,
      'recitation',
      'Due now for review',
      limit
    );
  }

  const newStates = states.filter(state => state.isNew).sort(sortStatesByPriority);
  if (newStates.length > 0) {
    return createPlannedSession(
      newStates,
      'flashcards',
      'Ready to start memorizing',
      limit
    );
  }

  return null;
};

export const planManualTechniqueSession = ({
  method,
  verses,
  verseProgress,
  now = Date.now(),
  limit = SMART_MEMORIZATION_SESSION_LIMIT,
}: {
  method: PracticeMethod;
  verses: OfflineVerse[];
  verseProgress: OfflineVerseProgress[];
  now?: number;
  limit?: number;
}): PlannedVerseSession | null => {
  const states = buildMemorizationVerseStates({ verses, verseProgress, now });

  let matchingStates: MemorizationVerseState[] = [];
  let reason = '';

  if (method === 'flashcards') {
    matchingStates = states
      .filter(
        state =>
          state.isNew ||
          (state.progress.nextMethod === 'flashcards' && state.isDue)
      )
      .sort(sortStatesByPriority);
    reason = 'Start new verses or revisit flashcards that still need work';
  } else if (method === 'fillInBlanks') {
    matchingStates = states
      .filter(
        state => state.progress.nextMethod === 'fillInBlanks' && state.isDue
      )
      .sort(sortStatesByPriority);
    reason = 'Continue verses that are ready for guided recall';
  } else {
    matchingStates = states
      .filter(
        state => state.progress.nextMethod === 'recitation' && state.isDue
      )
      .sort(sortStatesByPriority);
    reason = 'Recite verses that are ready for active recall or review';
  }

  if (matchingStates.length === 0) {
    return null;
  }

  return createPlannedSession(matchingStates, method, reason, limit);
};

export const getMemorizationDashboardStats = ({
  verses,
  verseProgress,
  now = Date.now(),
}: {
  verses: OfflineVerse[];
  verseProgress: OfflineVerseProgress[];
  now?: number;
}) => {
  const states = buildMemorizationVerseStates({ verses, verseProgress, now });

  return {
    newCount: states.filter(state => state.isNew).length,
    learningCount: states.filter(state => state.isLearning).length,
    dueTodayCount: states.filter(state => !state.isNew && state.isDueToday).length,
    masteredCount: states.filter(state => state.isMastered).length,
  };
};

export const getMemorizationStatusLabel = (status: MemorizationStatus) => {
  if (status === 'new') {
    return 'New';
  }

  if (status === 'learning') {
    return 'Learning';
  }

  if (status === 'strengthening') {
    return 'Strengthening';
  }

  return 'Mastered';
};

export const getPracticeMethodLabel = (method: PracticeMethod) => {
  if (method === 'fillInBlanks') {
    return 'Fill in the blanks';
  }

  if (method === 'recitation') {
    return 'Recitation';
  }

  return 'Flashcards';
};

export const formatDueAtLabel = (dueAt: number, now = Date.now()) => {
  if (dueAt <= now) {
    return 'Ready now';
  }

  const endOfToday = getEndOfToday(now);
  if (dueAt <= endOfToday) {
    return 'Due today';
  }

  return new Date(dueAt).toLocaleDateString();
};
