export type VerseTextEntry = {
  verse: string;
  text: string;
};

export type ImportSourceProvider = 'bible.com' | 'unknown';
export type ImportSourceChannel = 'paste' | 'nativeShare' | 'webShareTarget';

export type VerseImportSource = {
  provider: ImportSourceProvider;
  channel: ImportSourceChannel;
  version: string | null;
  sourceUrl: string | null;
  sharedText: string;
  textFidelity?: 'exactImported' | 'offlineFallback';
};

export type PendingImportShare = {
  channel: ImportSourceChannel;
  title?: string | null;
  text?: string | null;
  url?: string | null;
  capturedAt: number;
};

export type CollectionVerseEntry = {
  bookName: string;
  chapter: number;
  verses: string[];
  reviewFreq: string;
  verseTexts: VerseTextEntry[];
  importSource?: VerseImportSource;
};

export type SyncableRecord = {
  syncId: string;
  remoteId?: string;
  updatedAt: number;
  deletedAt?: number | null;
  pendingSync?: boolean;
  lastSyncedAt?: number | null;
};

export type OfflineVerse = SyncableRecord & {
  bookName: string;
  chapter: number;
  verses: string[];
  verseTexts: VerseTextEntry[];
  reviewFreq: string;
  isFeatured?: boolean;
  importSource?: VerseImportSource;
};

export type OfflineCollection = SyncableRecord & {
  collectionName: string;
  versesLength: number;
  collectionVerses: CollectionVerseEntry[];
};

export type OfflineNote = SyncableRecord & {
  verseSyncId: string;
  content: string;
};

export type OfflineAffirmation = SyncableRecord & {
  content: string;
  createdAt: number;
};

export type PracticeMethod = 'flashcards' | 'fillInBlanks' | 'recitation';
export type PracticeType = 'verses' | 'collections';
export type PracticeOutcome = 'pass' | 'needsReview';
export type PracticeSessionSource =
  | 'verseDetail'
  | 'smartQueue'
  | 'manualTechnique';
export type MemorizationStatus =
  | 'new'
  | 'learning'
  | 'strengthening'
  | 'mastered';

export type OfflinePracticeSession = SyncableRecord & {
  method: PracticeMethod;
  practiceType: PracticeType;
  source: PracticeSessionSource;
  verseKeys: string[];
  verseCount: number;
  passedVerseKeys: string[];
  needsReviewVerseKeys: string[];
  completedAt: number;
};

export type OfflineVerseProgress = SyncableRecord & {
  verseKey: string;
  totalCompletionCount: number;
  flashcardsCount: number;
  fillInBlanksCount: number;
  recitationCount: number;
  lastPracticedAt: number;
  status: MemorizationStatus;
  nextMethod: PracticeMethod;
  dueAt: number;
  successfulReviewCount: number;
  lastOutcome: PracticeOutcome;
  lastFlashcardsAt?: number;
  lastFillInBlanksAt?: number;
  lastRecitationAt?: number;
};

export type OfflineVerseSuggestion = {
  syncId: string;
  remoteId: string;
  bookName: string;
  chapter: number;
  verses: string[];
  verseTexts: VerseTextEntry[];
  reviewFreq: string;
};

export type OfflineCollectionSuggestion = {
  syncId: string;
  remoteId: string;
  collectionName: string;
  versesLength: number;
  collectionVerses: CollectionVerseEntry[];
};

export type OfflineUserProfile = {
  clerkId: string;
  email: string;
  first_name?: string;
  last_name?: string;
  imageUrl?: string;
};

export type SyncPayload = {
  user: OfflineUserProfile | null;
  verses: OfflineVerse[];
  collections: OfflineCollection[];
  notes: OfflineNote[];
  affirmations: OfflineAffirmation[];
  practiceSessions: OfflinePracticeSession[];
  verseProgress: OfflineVerseProgress[];
  verseSuggestions: OfflineVerseSuggestion[];
  collectionSuggestions: OfflineCollectionSuggestion[];
  syncedAt: number;
};

export type SyncEntityType =
  | 'verse'
  | 'collection'
  | 'note'
  | 'affirmation'
  | 'practiceSession'
  | 'verseProgress';

export type SyncAction = 'upsert' | 'delete';

export type SyncQueueOperation = {
  id: string;
  entityType: SyncEntityType;
  action: SyncAction;
  syncId: string;
  payload: Record<string, unknown>;
  createdAt: number;
};

export const createSyncId = (prefix: string) => {
  const globalCrypto = globalThis.crypto as Crypto | undefined;

  if (globalCrypto?.randomUUID) {
    return `${prefix}-${globalCrypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const sortByUpdatedAtDesc = <T extends { updatedAt: number }>(items: T[]) =>
  [...items].sort((left, right) => right.updatedAt - left.updatedAt);

export const isDeletedRecord = (
  record: Pick<SyncableRecord, 'deletedAt'>
) => Boolean(record.deletedAt);
