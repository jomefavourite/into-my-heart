import { ScrollView, View, Platform, ActivityIndicator } from 'react-native';
import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import ThemedText from '@/components/ThemedText';
import BackHeader from '@/components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import CustomButton from '@/components/CustomButton';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useBookStore } from '@/store/bookStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsCollOrVerse } from '@/store/tab-store';
import SplitVersesBottomSheet, {
  SplitVersesBottomSheetRef,
} from '@/components/SplitVersesBottomSheet';
import { useErrorAlert } from '@/components/ErrorAlert';
import { useDuplicateVersesAlert } from '@/components/DuplicateVersesAlert';
import {
  normalizeBibleText,
  normalizeVerseTextEntry,
  normalizeVerseTexts,
} from '@/lib/verseText';
import { getOfflineVerseTexts } from '@/lib/offlineBible';
import { useOfflineVerse, useOfflineVerses } from '@/hooks/useOfflineData';
import { useOfflineDataStore } from '@/store/offlineDataStore';

export default function VerseSummary() {
  const router = useRouter();
  const {
    book: bookURL,
    chapter: chapterURL,
    verses: versesURL,
    verseLength: verseLengthURL,
    verseId: verseIdURL,
  } = useLocalSearchParams();
  const [reviewFreqValue, setReviewFreqValue] = React.useState('Daily');
  const {
    bookName: storeBookName,
    chapter: storeChapter,
    verses: storeVerses,
    collectionName,
    setBookName,
    setChapter,
    setVerses,
    setCollectionVerses,
    resetAll,
    versesLength: storeVersesLength,
  } = useBookStore();

  // Extract values from URL or fallback to store
  const bookName = String(bookURL || storeBookName || '');
  const chapter = chapterURL ? Number(chapterURL) : storeChapter;
  const verses = versesURL
    ? String(versesURL).split(',').filter(Boolean)
    : storeVerses;
  const versesLength = Number(verseLengthURL) || storeVersesLength;

  const { isCollOrVerse } = useIsCollOrVerse();
  const [isLoading, setIsLoading] = React.useState(false);
  const splitVersesBottomSheetRef = useRef<SplitVersesBottomSheetRef>(null);
  const { showError, ErrorAlertComponent } = useErrorAlert();
  const { showDuplicateAlert, DuplicateVersesAlertComponent } =
    useDuplicateVersesAlert();
  const saveVerseLocal = useOfflineDataStore(state => state.saveVerseLocal);
  const allVerses = useOfflineVerses();

  // Check if we're in edit mode
  const isEditMode = !!verseIdURL;
  const verseId = typeof verseIdURL === 'string' ? verseIdURL : undefined;
  const existingVerse = useOfflineVerse(verseId);

  // Load reviewFreq from existing verse when editing
  React.useEffect(() => {
    if (existingVerse && isEditMode) {
      setReviewFreqValue(existingVerse.reviewFreq);
    }
  }, [existingVerse, isEditMode]);

  // Restore store state from URL parameters on mount
  useEffect(() => {
    if (bookURL && chapterURL && versesURL) {
      // Only update store if URL parameters are different from current store values
      if (bookURL !== storeBookName) {
        setBookName(String(bookURL));
      }
      if (Number(chapterURL) !== storeChapter) {
        setChapter(Number(chapterURL));
      }
      const urlVerses = String(versesURL).split(',').filter(Boolean);
      setVerses(urlVerses);
    }
  }, [
    bookURL,
    chapterURL,
    versesURL,
    storeBookName,
    storeChapter,
    setBookName,
    setChapter,
    setVerses,
  ]);

  const versesList = useMemo(() => {
    return verses ? verses.map(Number) : [];
  }, [verses]);

  const sortedVersesList = useMemo(
    () => [...versesList].sort((a, b) => a - b),
    [versesList]
  );

  const verseTexts = useMemo(() => {
    if (!bookName || !chapter || sortedVersesList.length === 0) {
      return [];
    }

    try {
      return getOfflineVerseTexts(bookName, chapter, sortedVersesList);
    } catch (error) {
      console.error(
        `Error loading offline verses for ${bookName} ${chapter}:`,
        error
      );
      return [];
    }
  }, [bookName, chapter, sortedVersesList]);

  const isVerseTextsListLoading = false;

  const minVerse = useMemo(() => Math.min(...versesList), [versesList]);
  const maxVerse = useMemo(() => Math.max(...versesList), [versesList]);

  const handleBookChange = useCallback(() => {
    router.replace('/verses/select-book');
    setVerses([]);
  }, [router, setVerses]);

  const processAddVerse = useCallback(
    async (splitIntoIndividual = false) => {
      setIsLoading(true);

      if (isCollOrVerse === 'collections') {
        // Always split verses into individual entries and check for duplicates
        const { collectionVerses } = useBookStore.getState();
        const duplicateVerses: number[] = [];
        const versesToAdd: typeof collectionVerses = [];

        for (const verse of versesList) {
          const verseText = verseTexts.find(vt => vt?.verse === verse);

          if (verseText) {
            const newVerse = {
              bookName,
              chapter,
              reviewFreq: reviewFreqValue,
              verses: [verse.toString()],
              verseTexts: [
                {
                  verse: verseText.verse?.toString() || '',
                  text: verseText.text || '',
                },
              ],
            };

            // Check for duplicates in existing collection verses
            const isDuplicate = collectionVerses.some(
              existingVerse =>
                existingVerse.bookName === newVerse.bookName &&
                existingVerse.chapter === newVerse.chapter &&
                existingVerse.verses.includes(verse.toString())
            );

            if (!isDuplicate) {
              versesToAdd.push(newVerse);
            } else {
              duplicateVerses.push(verse);
              console.log(
                `⚠️ Verse ${verse} already exists in collection, skipping...`
              );
            }
          } else {
            console.error(`❌ No verse text found for verse ${verse}`);
          }
        }

        // If there are duplicates, show alert and let user decide
        if (duplicateVerses.length > 0) {
          showDuplicateAlert(duplicateVerses, bookName, chapter);
          // Store the verses to add for when user confirms
          (window as any).pendingVersesToAdd = versesToAdd;
          setIsLoading(false);
          return;
        }

        // No duplicates, add all verses directly
        versesToAdd.forEach(verse => setCollectionVerses(verse));
        setVerses([]);
        setIsLoading(false);
        router.push('/verses/create-collection');
        return;
      }

      try {
        if (isEditMode && verseId) {
          saveVerseLocal({
            syncId: verseId,
            remoteId: existingVerse?.remoteId,
            bookName,
            chapter,
            verses: versesList.map(v => v.toString()),
            reviewFreq: reviewFreqValue,
            verseTexts: normalizeVerseTexts(verseTexts),
            importSource: existingVerse?.importSource,
          });

          setIsLoading(false);
          resetAll();
          router.push(`/verses/${verseId}`);
          return;
        }

        if (!splitIntoIndividual && versesList.length === 1) {
          const singleVerse = versesList[0]?.toString();
          const duplicateVerse = allVerses.find(
            verse =>
              verse.syncId !== verseId &&
              verse.bookName === bookName &&
              verse.chapter === chapter &&
              verse.verses.length === 1 &&
              verse.verses[0] === singleVerse
          );

          if (duplicateVerse) {
            setIsLoading(false);
            showError(
              'Duplicate Verse',
              `${bookName} ${chapter}:${singleVerse} is already in your verses.`
            );
            return;
          }
        }

        if (splitIntoIndividual) {
          for (const verse of versesList) {
            const verseText = verseTexts.find(vt => vt?.verse === verse);
            if (!verseText) {
              continue;
            }

            saveVerseLocal({
              bookName,
              chapter,
              verses: [verse.toString()],
              reviewFreq: reviewFreqValue,
              verseTexts: [normalizeVerseTextEntry(verseText)],
            });
          }
        } else {
          saveVerseLocal({
            bookName,
            chapter,
            verses: versesList.map(v => v.toString()),
            reviewFreq: reviewFreqValue,
            verseTexts: normalizeVerseTexts(verseTexts),
          });
        }

        setIsLoading(false);

        resetAll();
        router.push('/verses');
      } catch (error) {
        console.error('Error adding verse:', error);
        setIsLoading(false);

        // Extract clean error message from Convex error
        let errorMessage = 'An unexpected error occurred. Please try again.';
        let errorTitle = 'Error';

        if (error instanceof Error) {
          // Check if it's a Convex error with wrapped message
          const convexErrorMatch = error.message.match(
            /Uncaught Error: (.+?)(?:\s+at handler|$)/
          );
          if (convexErrorMatch) {
            errorMessage = convexErrorMatch[1].trim();
          } else {
            errorMessage = error.message;
          }

          if (errorMessage.includes('already exist')) {
            errorTitle = 'Duplicate Verses';
          } else if (
            errorMessage.includes('Authentication required') ||
            errorMessage.includes('account is still syncing')
          ) {
            errorTitle = 'Account Issue';
          } else if (errorMessage.includes('Mismatch:')) {
            errorTitle = 'Verse Data Error';
          } else if (
            errorMessage.includes('Server Error') ||
            errorMessage.includes('Called by client')
          ) {
            errorMessage = 'Failed to add verses. Please try again.';
          }
        }

        showError(errorTitle, errorMessage);
      }
    },
    [
      allVerses,
      bookName,
      chapter,
      existingVerse?.remoteId,
      saveVerseLocal,
      versesList,
      reviewFreqValue,
      router,
      isCollOrVerse,
      setCollectionVerses,
      setVerses,
      resetAll,
      verseTexts,
      isEditMode,
      verseId,
      showDuplicateAlert,
      showError,
    ]
  );

  const handleAddVerse = useCallback(async () => {
    if (versesList.length === 0) return;

    if (!bookName || !chapter) {
      console.error('Book name or chapter is not set');
      return;
    }

    // Check if verse texts are still loading
    if (isVerseTextsListLoading) {
      console.log('⏳ Verse texts are still loading, please wait...');
      return;
    }

    // Check if we have verse texts for all verses
    if (verseTexts.length !== versesList.length) {
      console.log('⚠️ Verse texts not fully loaded yet');
      console.log('Expected:', versesList.length, 'Got:', verseTexts.length);
      return;
    }

    // If editing, proceed directly without showing split bottom sheet
    if (isEditMode) {
      await processAddVerse();
      return;
    }

    // For collections, always split individually and handle duplicates
    if (isCollOrVerse === 'collections') {
      await processAddVerse(true); // Force individual splitting for collections
      return;
    }

    // For regular verses, show bottom sheet if there are multiple verses
    if (versesList.length > 1) {
      splitVersesBottomSheetRef.current?.open();
      return;
    }

    // If only one verse, proceed directly
    await processAddVerse();
  }, [
    versesList,
    bookName,
    chapter,
    isVerseTextsListLoading,
    verseTexts.length,
    isCollOrVerse,
    isEditMode,
    processAddVerse,
    showError,
  ]);

  const handleSplitIntoIndividual = useCallback(() => {
    processAddVerse(true);
  }, [processAddVerse]);

  const handleKeepAsGroup = useCallback(() => {
    processAddVerse(false);
  }, [processAddVerse]);

  const handleContinueWithDuplicates = useCallback(() => {
    const pendingVerses = (window as any).pendingVersesToAdd;
    if (pendingVerses && pendingVerses.length > 0) {
      pendingVerses.forEach((verse: any) => setCollectionVerses(verse));
      (window as any).pendingVersesToAdd = null;
      setVerses([]);
      router.push('/verses/create-collection');
    }
  }, [setCollectionVerses, setVerses, router]);

  // // Show loading or redirect if data is not valid
  // if (!hasValidData) {
  //   return (
  //     <SafeAreaView className='flex-1'>
  //       <BackHeader
  //         title='Add Verse'
  //         items={[
  //           { label: 'Verses', href: '/verses' },
  //           {
  //             label: 'Select Book',
  //             href: `/verses/select-book`,
  //           },
  //         ]}
  //       />
  //       <View className='flex-1 justify-center items-center px-[18px]'>
  //         <ThemedText className='text-center mb-4'>
  //           No verse data found. Please select verses first.
  //         </ThemedText>
  //         <CustomButton
  //           onPress={() => router.push('/verses/select-book')}
  //           className='w-full'
  //         >
  //           Select Book
  //         </CustomButton>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView className='flex-1'>
      {Platform.OS === 'web' && (
        <>
          <title>
            {isEditMode ? 'Edit Verse' : 'Add Verse'} - Into My Heart
          </title>
          <meta
            name='description'
            content={
              isEditMode
                ? 'Edit your Bible verse. Update book, chapter, and verses.'
                : 'Add a new Bible verse to your memorization collection. Select book, chapter, and verses to memorize.'
            }
          />
          <meta
            name='keywords'
            content='Bible, memorization, verses, flashcards, practice, Christian, faith, scripture'
          />
          <meta name='author' content='Into My Heart' />
          <meta name='robots' content='index, follow' />
          <meta property='og:type' content='website' />
          <meta property='og:site_name' content='Into My Heart' />
          <meta property='og:locale' content='en_US' />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='theme-color' content='#313131' />
          <meta name='msapplication-TileColor' content='#313131' />
        </>
      )}

      <BackHeader
        title={isEditMode ? 'Edit Verse' : 'Add Verse'}
        items={
          isCollOrVerse === 'collections'
            ? [
                { label: 'Verses', href: '/verses' },
                {
                  label: 'Create Collection',
                  href: '/verses/create-collection',
                },
                {
                  label: 'Select Book',
                  href: `/verses/select-book`,
                },
                {
                  label: 'Select Verse',
                  href: `/verses/select-verses?book=${bookName}&chapter=${chapter}&verseLength=${versesLength}`,
                },
                {
                  label: 'Verse Summary',
                  href: `/verses/verse-summary?book=${bookName}&chapter=${chapter}&verses=${verses.join(',')}`,
                },
              ]
            : [
                { label: 'Verses', href: '/verses' },
                {
                  label: 'Select Book',
                  href: `/verses/select-book`,
                },
                {
                  label: 'Select Verse',
                  href: `/verses/select-verses?book=${bookName}&chapter=${chapter}&verseLength=${versesLength}`,
                },
                {
                  label: 'Verse Summary',
                  href: `/verses/verse-summary?book=${bookName}&chapter=${chapter}&verses=${verses.join(',')}`,
                },
              ]
        }
      />

      <View className='flex-1'>
        <ScrollView
          className='flex-1'
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className='gap-5 px-[18px]'>
            <View className='gap-3'>
              {isCollOrVerse === 'collections' && (
                <View className='w-full flex-row items-center justify-between'>
                  <ThemedText className='text-sm'>Collection name</ThemedText>
                  <Button
                    size={'sm'}
                    variant={'ghost'}
                    className='flex-row items-center text-sm'
                    // onPress={handleBookChange}
                  >
                    <ThemedText className='text-sm'>
                      {collectionName}
                    </ThemedText>
                    <ArrowRightIcon />
                  </Button>
                </View>
              )}
              <View className='w-full flex-row items-center justify-between'>
                <ThemedText className='text-sm'>Book</ThemedText>
                <Button
                  size={'sm'}
                  variant={'ghost'}
                  className='flex-row items-center text-sm'
                  disabled={isEditMode}
                  onPress={handleBookChange}
                >
                  <ThemedText className='text-sm'>
                    {bookName} {chapter}
                  </ThemedText>
                  <ArrowRightIcon />
                </Button>
              </View>
              <View className='w-full flex-row items-center justify-between'>
                <ThemedText className='text-sm'>Verses</ThemedText>
                <Button
                  size={'sm'}
                  variant={'ghost'}
                  className='flex-row items-center text-sm'
                  disabled={isEditMode}
                  onPress={() =>
                    router.replace(
                      `/verses/select-verses?book=${bookName}&chapter=${chapter}`
                    )
                  }
                >
                  <ThemedText className='text-sm'>
                    {versesList.length > 5
                      ? `${minVerse}...${maxVerse}`
                      : versesList.sort((a, b) => a - b).join(', ')}
                  </ThemedText>
                  <ArrowRightIcon />
                </Button>
              </View>
              <View className='w-full flex-row items-center justify-between'>
                <ThemedText className='text-sm'>Bible translation</ThemedText>
                <Button
                  size={'sm'}
                  variant={'ghost'}
                  className='flex-row items-center text-sm'
                  disabled
                >
                  <ThemedText className='text-sm'>KJV</ThemedText>
                </Button>
              </View>
              <View className='w-full flex-row items-center justify-between'>
                <ThemedText className='text-sm'>Review Frequency</ThemedText>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size={'sm'}
                      variant={'ghost'}
                      className='flex-row items-center text-sm'
                    >
                      <ThemedText className='text-sm'>
                        {reviewFreqValue}
                      </ThemedText>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='native:w-52 w-48 px-0'>
                    <DropdownMenuItem
                      onPress={() => setReviewFreqValue('Daily')}
                    >
                      <ThemedText>Daily</ThemedText>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onPress={() => setReviewFreqValue('Weekly')}
                    >
                      <ThemedText>Weekly</ThemedText>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onPress={() => setReviewFreqValue('Monthly')}
                    >
                      <ThemedText>Monthly</ThemedText>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </View>
            </View>

            <ScrollView className='max-h-[200px] overflow-y-auto rounded-md border border-black p-3 dark:border-white'>
              {isVerseTextsListLoading ? (
                <View className='flex-1 items-center justify-center'>
                  <ActivityIndicator />
                </View>
              ) : (
                verseTexts.map((text, index) => (
                  <ThemedText
                    key={index}
                    size={13}
                    className='block w-full !overflow-hidden !text-ellipsis text-[#707070] dark:text-[#909090]'
                  >
                    {text?.verse}. {normalizeBibleText(text?.text)}
                  </ThemedText>
                ))
              )}
            </ScrollView>
          </View>
        </ScrollView>

        <View className='px-[18px] py-5'>
          <CustomButton
            disabled={isVerseTextsListLoading}
            isLoading={isLoading}
            onPress={handleAddVerse}
          >
            {isEditMode
              ? 'Update Verse'
              : isCollOrVerse === 'collections'
                ? 'Add Verse(s) To Collection'
                : 'Add Verse(s)'}
          </CustomButton>
        </View>
      </View>

      <SplitVersesBottomSheet
        ref={splitVersesBottomSheetRef}
        onSplitIntoIndividual={handleSplitIntoIndividual}
        onKeepAsGroup={handleKeepAsGroup}
        verseCount={versesList.length}
        bookName={bookName}
        chapter={chapter}
        verses={versesList}
      />

      <ErrorAlertComponent />
      <DuplicateVersesAlertComponent
        onContinue={handleContinueWithDuplicates}
      />
    </SafeAreaView>
  );
}
