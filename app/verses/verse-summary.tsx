import { ScrollView, View } from 'react-native';
import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import ThemedText from '~/components/ThemedText';
import BackHeader from '~/components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/button';
import ArrowRightIcon from '~/components/icons/ArrowRightIcon';
import CustomButton from '~/components/CustomButton';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useBookStore } from '~/store/bookStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { useMutation } from 'convex/react';
import { api } from '~/convex/_generated/api';
import { useIsCollOrVerse } from '~/store/tab-store';
import { ActivityIndicator } from 'react-native';
import { useQueries, useQuery } from '@tanstack/react-query';
import { BOOKS } from '~/lib/books';
import SplitVersesBottomSheet, {
  SplitVersesBottomSheetRef,
} from '~/components/SplitVersesBottomSheet';
import { useErrorAlert } from '~/components/ErrorAlert';
import { useDuplicateVersesAlert } from '~/components/DuplicateVersesAlert';

type GetVerseTextsParams = {
  bookName: string;
  chapter: number;
  verse: number;
};

function getVerseText(
  chapterData: {
    content: { type: string; number: number; content: string[] }[];
  },
  verseNumber: number
) {
  const verse = chapterData.content.find(
    i => i.type === 'verse' && i.number === verseNumber
  );

  return verse
    ? { text: verse.content[0], verse: verseNumber }
    : // .join('')
      // .trim()
      null;
}

const getVerseTexts = async ({
  bookName,
  chapter,
  verse,
}: GetVerseTextsParams) => {
  try {
    const bookId = BOOKS.find(book => book.name === bookName)?.id;
    const chapterData = await fetch(
      // `https://cdn.jsdelivr.net/gh/jomefavourite/bible-api/bibles/en-kjv/books/${bookName.toLowerCase()}/chapters/${chapter}/verses/${verse}.json`
      `https://bible.helloao.org/api/eng-kjv/${bookId}/${chapter}.json`
    );

    if (!chapterData.ok) {
      console.error(`Failed to fetch data for ${bookId} ${chapter}`);
      // Consider throwing an error here if you want the sequence to stop on failure
      return null; // Or handle the error gracefully
    }
    const chapterDataJson = await chapterData.json();

    // console.log(`Fetched ${bookName} ${chapter}:${verse}:`, verseJson);

    return getVerseText(chapterDataJson.chapter, verse); // Return the fetched data if you need it
  } catch (error) {
    console.error(`Error fetching ${bookName} ${chapter}:${verse}:`, error);
    return null;
  }
};

export default function VerseSummary() {
  const router = useRouter();
  const {
    book: bookURL,
    chapter: chapterURL,
    verses: versesURL,
    verseLength: verseLengthURL,
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

  const addVerse = useMutation(api.verses.addVerse);

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

  // Validate that we have the required data
  const hasValidData = bookName && chapter && verses && verses.length > 0;

  const versesList = useMemo(() => {
    return verses ? verses.map(Number) : [];
  }, [verses]);

  const queries = useMemo(() => {
    return versesList
      ? versesList
          .sort((a, b) => a - b)
          .map(verse => ({
            queryKey: ['verse', bookName, chapter, verse],
            queryFn: () => getVerseTexts({ bookName, chapter, verse }),
            enabled: !!bookName && !!chapter && !!verses,
          }))
      : [];
  }, [versesList, bookName, chapter, verses]);

  const verseTextsList = useQueries({
    queries,
  });

  const verseTexts = useMemo(() => {
    const texts = verseTextsList.map(query => query.data).filter(Boolean);
    return texts;
  }, [verseTextsList, versesList.length]);

  const isVerseTextsListLoading = useMemo(() => {
    return verseTextsList.some(query => query.isLoading);
  }, [verseTextsList]);

  // const verseTexts = [];
  // const isVerseTextsListLoading = false;

  const minVerse = useMemo(() => Math.min(...versesList), [versesList]);
  const maxVerse = useMemo(() => Math.max(...versesList), [versesList]);

  const handleBookChange = useCallback(() => {
    router.replace('/verses/select-book');
    setVerses([]);
  }, [router, setVerses]);

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
  ]);

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
        if (splitIntoIndividual) {
          // Add each verse individually
          for (const verse of versesList) {
            const verseText = verseTexts.find(vt => vt?.verse === verse);
            console.log(`🔍 Found verse text:`, verseText);
            if (verseText) {
              const payload = {
                bookName: bookName,
                chapter: chapter,
                verses: [verse.toString()],
                reviewFreq: reviewFreqValue,
                verseTexts: [
                  {
                    verse: `${verseText.verse}`,
                    text: verseText.text || '',
                  },
                ],
                isGroup: false, // Single verse - check for duplicates
              };
              console.log('📝 Adding individual verse:', payload);
              await addVerse(payload);
            } else {
              console.error(`❌ No verse text found for verse ${verse}`);
            }
          }
        } else {
          // Add as a group - isGroup determined by number of verses
          const isGroup = versesList.length > 1;
          // console.log('🔍 Group addition - verseTexts:', verseTexts);
          // console.log('🔍 Group addition - versesList:', versesList);

          const payload = {
            bookName: bookName,
            chapter: chapter,
            verses: versesList.map(v => v.toString()),
            reviewFreq: reviewFreqValue,
            verseTexts: verseTexts.map((text, index) => ({
              verse: `${text?.verse || ''}`,
              text: text?.text || '',
            })),
            isGroup: isGroup, // Multiple verses = group (allow duplicates), single verse = individual (check duplicates)
          };
          // console.log('📝 Adding verse group:', payload);
          await addVerse(payload);
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

          // Determine error type and title
          if (errorMessage.includes('already exist')) {
            errorTitle = 'Duplicate Verses';
          } else {
            errorTitle = 'Error';
            if (!errorMessage.includes('Failed to add verses')) {
              errorMessage = 'Failed to add verses. Please try again.';
            }
          }
        }

        showError(errorTitle, errorMessage);
      }
    },
    [
      addVerse,
      bookName,
      chapter,
      versesList,
      reviewFreqValue,
      router,
      isCollOrVerse,
      setCollectionVerses,
      setVerses,
      resetAll,
      verseTexts,
    ]
  );

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
      <BackHeader
        title='Add Verse'
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

      <View className='flex-1 justify-between px-[18px]'>
        <View className='gap-5'>
          <View className='gap-3'>
            {isCollOrVerse === 'collections' && (
              <View className='flex-row items-center justify-between w-full'>
                <ThemedText size={14}>Collection name</ThemedText>
                <Button
                  size={'sm'}
                  variant={'ghost'}
                  className='flex-row items-center text-sm'
                  // onPress={handleBookChange}
                >
                  <ThemedText size={14}>{collectionName}</ThemedText>
                  <ArrowRightIcon />
                </Button>
              </View>
            )}
            <View className='flex-row items-center justify-between w-full'>
              <ThemedText size={14}>Book</ThemedText>
              <Button
                size={'sm'}
                variant={'ghost'}
                className='flex-row items-center text-sm'
                onPress={handleBookChange}
              >
                <ThemedText size={14}>
                  {bookName} {chapter}
                </ThemedText>
                <ArrowRightIcon />
              </Button>
            </View>
            <View className='flex-row items-center justify-between w-full'>
              <ThemedText size={14}>Verses</ThemedText>
              <Button
                size={'sm'}
                variant={'ghost'}
                className='flex-row items-center text-sm'
                onPress={() =>
                  router.replace(
                    `/verses/select-verses?book=${bookName}&chapter=${chapter}`
                  )
                }
              >
                <ThemedText size={14}>
                  {versesList.length > 5
                    ? `${minVerse}...${maxVerse}`
                    : versesList.sort((a, b) => a - b).join(', ')}
                </ThemedText>
                <ArrowRightIcon />
              </Button>
            </View>
            <View className='flex-row items-center justify-between w-full'>
              <ThemedText size={14}>Bible translation</ThemedText>
              <Button
                size={'sm'}
                variant={'ghost'}
                className='flex-row items-center text-sm'
                disabled
              >
                <ThemedText size={14}>KJV</ThemedText>
              </Button>
            </View>
            <View className='flex-row items-center justify-between w-full'>
              <ThemedText size={14}>Review Frequency</ThemedText>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size={'sm'}
                    variant={'ghost'}
                    className='flex-row items-center text-sm'
                  >
                    <ThemedText size={14}>{reviewFreqValue}</ThemedText>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-48 native:w-52 px-0'>
                  <DropdownMenuItem onPress={() => setReviewFreqValue('Daily')}>
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

          <ScrollView className='border border-black dark:border-white rounded-md p-3 max-h-[200px] overflow-y-auto'>
            {isVerseTextsListLoading ? (
              <View className='flex-1 items-center justify-center'>
                <ActivityIndicator />
              </View>
            ) : (
              verseTexts.map((text, index) => (
                <ThemedText
                  key={index}
                  size={13}
                  className='w-full text-[#707070] dark:text-[#909090] !overflow-hidden !text-ellipsis block'
                >
                  {text?.verse}. {text?.text}
                </ThemedText>
              ))
            )}
          </ScrollView>
        </View>

        <View className='flex-row gap-3'>
          <CustomButton
            disabled={isVerseTextsListLoading}
            isLoading={isLoading}
            className='my-5 flex-1'
            onPress={handleAddVerse}
          >
            {isCollOrVerse === 'collections'
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
