import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { useAction } from 'convex/react';
import BackHeader from '@/components/BackHeader';
import CustomButton from '@/components/CustomButton';
import ThemedText from '@/components/ThemedText';
import { Label } from '@/components/ui/label';
import { api } from '@/convex/_generated/api';
import { useIncomingImportShare } from '@/hooks/useIncomingImportShare';
import {
  buildImportTextFromShare,
  createPendingShare,
  parseImportedVerse,
  type ParsedImportedVerse,
} from '@/lib/verseImport';
import { useOfflineVerses } from '@/hooks/useOfflineData';
import type { ImportSourceChannel } from '@/lib/offline-sync';
import { useBookStore } from '@/store/bookStore';
import { useImportShareStore } from '@/store/importShareStore';
import { useOfflineDataStore } from '@/store/offlineDataStore';

type ShareDraft = {
  channel: ImportSourceChannel;
  title?: string | null;
  text?: string | null;
  url?: string | null;
};

const buildNativeShareDraft = (
  sharedPayloads: Array<{ value: string; shareType: string }>
): ShareDraft | null => {
  if (sharedPayloads.length === 0) {
    return null;
  }

  const textParts = sharedPayloads
    .filter(payload => payload.shareType === 'text')
    .map(payload => payload.value.trim())
    .filter(Boolean);
  const url = sharedPayloads.find(payload => payload.shareType === 'url')?.value ?? null;

  if (textParts.length === 0 && !url) {
    return null;
  }

  return {
    channel: 'nativeShare',
    text: textParts.join('\n\n'),
    url,
  };
};

const getDuplicateVerses = (
  allVerses: ReturnType<typeof useOfflineVerses>,
  parsedVerse: ParsedImportedVerse
) => {
  const duplicateVerses = new Set<string>();

  allVerses.forEach(existingVerse => {
    if (
      existingVerse.bookName === parsedVerse.bookName &&
      existingVerse.chapter === parsedVerse.chapter
    ) {
      parsedVerse.verses.forEach(verse => {
        if (existingVerse.verses.includes(verse)) {
          duplicateVerses.add(verse);
        }
      });
    }
  });

  return [...duplicateVerses].sort((left, right) => Number(left) - Number(right));
};

type ExactVerseTextResolver = Parameters<typeof parseImportedVerse>[0]['exactVerseTextResolver'];

const applyParseResult = async (
  sharedText: string,
  channel: 'paste' | 'nativeShare' | 'webShareTarget',
  sourceUrl: string | null,
  exactVerseTextResolver: ExactVerseTextResolver
) => {
  return parseImportedVerse({
    channel,
    sharedText,
    sourceUrl,
    exactVerseTextResolver,
  });
};

const ImportVerses = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const params = useLocalSearchParams<{
    title?: string;
    text?: string;
    url?: string;
  }>();
  const resolveExactBibleDotComVerseTexts = useAction(
    api.verseImport.resolveExactBibleDotComVerseTexts
  );
  const [pastedText, setPastedText] = useState('');
  const [parsedVerse, setParsedVerse] = useState<ParsedImportedVerse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const allVerses = useOfflineVerses();
  const currentUser = useOfflineDataStore(state => state.currentUser);
  const saveVerseLocal = useOfflineDataStore(state => state.saveVerseLocal);
  const { setCollectionVersesArray } = useBookStore();
  const pendingShare = useImportShareStore(state => state.pendingShare);
  const setPendingShare = useImportShareStore(state => state.setPendingShare);
  const clearPendingShare = useImportShareStore(state => state.clearPendingShare);
  const incomingShare = useIncomingImportShare();
  const hasAppliedDraftRef = useRef<string | null>(null);

  const canSave = Boolean(isSignedIn || currentUser);

  const queryDraft = useMemo<ShareDraft | null>(() => {
    if (!params.text && !params.url && !params.title) {
      return null;
    }

    return {
      channel: 'webShareTarget',
      title: typeof params.title === 'string' ? params.title : null,
      text: typeof params.text === 'string' ? params.text : null,
      url: typeof params.url === 'string' ? params.url : null,
    };
  }, [params.text, params.title, params.url]);

  const nativeDraft = useMemo(
    () =>
      buildNativeShareDraft(
        incomingShare.sharedPayloads.map(payload => ({
          value: payload.value,
          shareType: payload.shareType,
        }))
      ),
    [incomingShare.sharedPayloads]
  );

  const handleParsedResult = useCallback(async (
    nextText: string,
    nextChannel: 'paste' | 'nativeShare' | 'webShareTarget',
    sourceUrl: string | null
  ) => {
    setIsParsing(true);
    setError(null);

    try {
      const result = await applyParseResult(
        nextText,
        nextChannel,
        sourceUrl,
        resolveExactBibleDotComVerseTexts
      );
      setPastedText(nextText);
      setParsedVerse(result.parsed);
      setError(result.error);
    } finally {
      setIsParsing(false);
    }
  }, [resolveExactBibleDotComVerseTexts]);

  const applyShareDraft = useCallback(
    async (
      draft: ShareDraft,
      options?: { clearPending?: boolean; clearNativeShare?: boolean }
    ) => {
      const combinedText = buildImportTextFromShare(draft);
      if (!combinedText) {
        return;
      }

      const signature = JSON.stringify({
        channel: draft.channel,
        title: draft.title ?? null,
        text: draft.text ?? null,
        url: draft.url ?? null,
      });

      if (hasAppliedDraftRef.current === signature) {
        return;
      }

      if (isLoaded && !canSave) {
        setPendingShare(createPendingShare(draft));
        hasAppliedDraftRef.current = signature;
        router.replace('/(onboarding)/onboard');
        return;
      }

      await handleParsedResult(combinedText, draft.channel, draft.url ?? null);
      hasAppliedDraftRef.current = signature;

      if (options?.clearPending) {
        clearPendingShare();
      }
      if (options?.clearNativeShare) {
        incomingShare.clearSharedPayloads();
      }
    },
    [
      canSave,
      clearPendingShare,
      handleParsedResult,
      incomingShare,
      isLoaded,
      router,
      setPendingShare,
    ]
  );

  useEffect(() => {
    if (!isLoaded && !currentUser) {
      return;
    }

    if (pendingShare) {
      void applyShareDraft(pendingShare, { clearPending: true });
      return;
    }

    if (queryDraft) {
      void applyShareDraft(queryDraft);
      return;
    }

    if (nativeDraft) {
      void applyShareDraft(nativeDraft, { clearNativeShare: true });
    }
  }, [
    applyShareDraft,
    currentUser,
    isLoaded,
    nativeDraft,
    pendingShare,
    queryDraft,
  ]);

  const handleParse = async () => {
    hasAppliedDraftRef.current = null;
    await handleParsedResult(pastedText, 'paste', null);
  };

  const handleSaveToVerses = () => {
    if (!parsedVerse) {
      return;
    }

    if (!canSave) {
      setPendingShare(
        createPendingShare({
          channel: parsedVerse.importSource.channel,
          text: pastedText,
          url: parsedVerse.importSource.sourceUrl,
        })
      );
      router.replace('/(onboarding)/onboard');
      return;
    }

    const duplicateVerses = getDuplicateVerses(allVerses, parsedVerse);
    if (duplicateVerses.length > 0) {
      setError(
        `These verses are already in your library: ${duplicateVerses.join(', ')}.`
      );
      return;
    }

    saveVerseLocal({
      bookName: parsedVerse.bookName,
      chapter: parsedVerse.chapter,
      verses: parsedVerse.verses,
      verseTexts: parsedVerse.verseTexts,
      reviewFreq: '',
      importSource: parsedVerse.importSource,
    });
    clearPendingShare();
    router.replace('/verses');
  };

  const handleSaveToCollection = () => {
    if (!parsedVerse) {
      return;
    }

    if (!canSave) {
      setPendingShare(
        createPendingShare({
          channel: parsedVerse.importSource.channel,
          text: pastedText,
          url: parsedVerse.importSource.sourceUrl,
        })
      );
      router.replace('/(onboarding)/onboard');
      return;
    }

    setCollectionVersesArray([
      {
        bookName: parsedVerse.bookName,
        chapter: parsedVerse.chapter,
        verses: parsedVerse.verses,
        reviewFreq: '',
        verseTexts: parsedVerse.verseTexts,
        importSource: parsedVerse.importSource,
      },
    ]);
    clearPendingShare();
    router.push('/verses/create-collection');
  };

  const showSharedSourceText = Boolean(
    parsedVerse?.sourceTextPreview &&
      parsedVerse.sourceTextPreview !== parsedVerse.storedVersePreview
  );

  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        title='Import Verse'
        items={[
          { label: 'Verses', href: '/verses' },
          { label: 'Import Verse', href: '/verses/import-verses' },
        ]}
      />

      <View className='flex-1 px-[18px] py-4'>
        <View className='mb-4'>
          <Label nativeID='verseInput'>Paste or share Bible text</Label>
          <TextInput
            className='mt-2 h-40 rounded-md border border-gray-300 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
            multiline
            numberOfLines={10}
            placeholder='Paste a Bible.com link or shared verse text here...'
            value={pastedText}
            onChangeText={setPastedText}
            textAlignVertical='top'
            accessibilityLabel='Import verse text'
          />
          <ThemedText className='mt-1 text-xs text-gray-500'>
            Supported inputs: Bible.com links, shared verse text with a citation
            like &quot;John 3:16 NIV&quot;, and same-chapter lists or ranges.
            Into My Heart stores the pasted translation text when it is present
            in the share, and keeps the source version as metadata.
          </ThemedText>
          {!canSave && (
            <ThemedText className='mt-2 text-xs text-amber-600 dark:text-amber-300'>
              Shared imports will be held until you sign in, then reopened here.
            </ThemedText>
          )}
        </View>

        <CustomButton
          onPress={() => void handleParse()}
          className='mb-4'
          isLoading={isParsing}
          disabled={isParsing}
        >
          {isParsing ? 'Parsing...' : 'Parse Verse'}
        </CustomButton>

        {error && (
          <View className='mb-4 rounded-md bg-red-100 p-3 dark:bg-red-900'>
            <ThemedText className='text-red-800 dark:text-red-200'>
              {error}
            </ThemedText>
          </View>
        )}

        {incomingShare.error && Platform.OS !== 'web' && (
          <View className='mb-4 rounded-md bg-red-100 p-3 dark:bg-red-900'>
            <ThemedText className='text-red-800 dark:text-red-200'>
              Failed to resolve the shared content. You can still paste the text
              manually below.
            </ThemedText>
          </View>
        )}

        {parsedVerse && (
          <ScrollView className='mb-4 flex-1'>
            <View className='mb-3 rounded-md bg-green-100 p-4 dark:bg-green-900'>
              <ThemedText className='mb-2 font-semibold text-green-800 dark:text-green-200'>
                Ready to import
              </ThemedText>
              <ThemedText className='text-green-800 dark:text-green-200'>
                Reference: {parsedVerse.referenceLabel}
              </ThemedText>
              <ThemedText className='text-green-800 dark:text-green-200'>
                Source: {parsedVerse.importSource.provider}
                {parsedVerse.importSource.version
                  ? ` (${parsedVerse.importSource.version})`
                  : ''}
              </ThemedText>
              <ThemedText className='text-green-800 dark:text-green-200'>
                Entry path: {parsedVerse.importSource.channel}
              </ThemedText>
              <ThemedText className='mt-1 text-green-800 dark:text-green-200'>
                Preview translation: {parsedVerse.previewVersionLabel ?? 'KJV'}
              </ThemedText>
              <ThemedText className='mt-1 text-green-800 dark:text-green-200'>
                Stored verse text: {parsedVerse.storedVersionLabel ?? 'KJV fallback'}
              </ThemedText>
              {parsedVerse.textFidelity === 'offlineFallback' &&
              parsedVerse.exactSplitUnavailableReason ? (
                <ThemedText className='mt-1 text-sm text-green-800 dark:text-green-200'>
                  Exact verse-by-verse import was unavailable for this share.
                  Saving will use offline KJV verse boundaries.
                </ThemedText>
              ) : null}
              {parsedVerse.importSource.sourceUrl && (
                <ThemedText className='mt-1 text-xs text-green-800 dark:text-green-200'>
                  Source URL: {parsedVerse.importSource.sourceUrl}
                </ThemedText>
              )}
            </View>

            {showSharedSourceText && (
              <View className='mb-3 rounded-md bg-container p-4'>
                <ThemedText className='mb-2 font-semibold'>
                  Shared source text
                </ThemedText>
                <ThemedText>{parsedVerse.sourceTextPreview}</ThemedText>
              </View>
            )}

            <View className='rounded-md bg-container p-4'>
              <ThemedText className='mb-2 font-semibold'>
                Stored verse preview
              </ThemedText>
              <ThemedText>{parsedVerse.storedVersePreview}</ThemedText>
            </View>
          </ScrollView>
        )}

        {parsedVerse && (
          <View className='flex-row gap-2'>
            <CustomButton
              variant='outline'
              onPress={handleSaveToCollection}
              className='flex-1'
            >
              Add to Collection
            </CustomButton>
            <CustomButton onPress={handleSaveToVerses} className='flex-1'>
              Save to Verses
            </CustomButton>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ImportVerses;
