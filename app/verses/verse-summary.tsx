import { View } from 'react-native';
import React, { useCallback } from 'react';
import ThemedText from '~/components/ThemedText';
import BackHeader from '~/components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/button';
import ArrowRightIcon from '~/components/icons/ArrowRightIcon';
import CustomButton from '~/components/CustomButton';
import { useRouter } from 'expo-router';
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

type GetVerseTextsParams = {
  bookName: string;
  chapter: number;
  verse: number;
};

const getVerseTexts = async ({
  bookName,
  chapter,
  verse,
}: GetVerseTextsParams) => {
  try {
    const verseData = await fetch(
      `https://cdn.jsdelivr.net/gh/jomefavourite/bible-api/bibles/en-kjv/books/${bookName.toLowerCase()}/chapters/${chapter}/verses/${verse}.json`
    );

    if (!verseData.ok) {
      console.error(
        `Failed to fetch verse data for ${bookName} ${chapter}:${verse}`
      );
      // Consider throwing an error here if you want the sequence to stop on failure
      return null; // Or handle the error gracefully
    }
    const verseJson = await verseData.json();

    console.log(`Fetched ${bookName} ${chapter}:${verse}:`, verseJson);
    return verseJson; // Return the fetched data if you need it
  } catch (error) {
    console.error(
      `Error fetching verse ${bookName} ${chapter}:${verse}:`,
      error
    );
    return null;
  }
};

export default function VerseSummary() {
  const router = useRouter();
  const [reviewFreqValue, setReviewFreqValue] = React.useState('Daily');
  const {
    bookName,
    chapter,
    verses,
    collectionName,
    setVerses,
    setCollectionVerses,
    resetAll,
  } = useBookStore();

  const { isCollOrVerse } = useIsCollOrVerse();
  const [isLoading, setIsLoading] = React.useState(false);

  const addVerse = useMutation(api.verses.addVerse);

  const versesList = verses ? verses.map(Number) : [];

  const minVerse = Math.min(...versesList);
  const maxVerse = Math.max(...versesList);

  const handleBookChange = useCallback(() => {
    router.push('/verses/select-book');
    setVerses([]);
  }, [router]);

  const handleAddVerse = useCallback(async () => {
    if (versesList.length === 0) return;
    setIsLoading(true);

    if (!bookName || !chapter) {
      console.error('Book name or chapter is not set');
      return;
    }

    const fetchVersesSequentially = async () => {
      const allVerseResults = [];
      for (const verse of versesList) {
        const result = await getVerseTexts({ bookName, chapter, verse });
        if (result) {
          allVerseResults.push(result);
        }
      }
      return allVerseResults;
    };

    const verseTexts = await fetchVersesSequentially();

    if (isCollOrVerse === 'collections') {
      setCollectionVerses({
        bookName,
        chapter,
        reviewFreq: reviewFreqValue,
        verses: versesList.map((v) => v.toString()),
      });
      setVerses([]);
      setIsLoading(false);
      router.push('/verses/create-collection');
      return;
    }

    try {
      const payload = {
        bookName: bookName,
        chapter: chapter,
        verses: versesList.map((v) => v.toString()),
        reviewFreq: reviewFreqValue,
        versesTexts: verseTexts.map((text, index) => ({
          verse: (index + 1).toString(),
          text: text.text,
        })),
      };

      await addVerse(payload);
      setIsLoading(false);
      resetAll();
      router.push('/verses');
    } catch (error) {
      console.error('Error adding verse:', error);
    }
  }, [addVerse, bookName, chapter, versesList, reviewFreqValue, router]);

  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        title='Add Verse'
        items={[
          { label: 'Verses', href: '/verses' },
          { label: 'Select Verse', href: '/verses/select-verses' },
          { label: 'Verse Summary', href: '/verses/verse-summary' },
        ]}
      />

      <View className='flex-1 justify-between px-[18px]'>
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
                router.push(
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
                <DropdownMenuItem onPress={() => setReviewFreqValue('Weekly')}>
                  <ThemedText>Weekly</ThemedText>
                </DropdownMenuItem>
                <DropdownMenuItem onPress={() => setReviewFreqValue('Monthly')}>
                  <ThemedText>Monthly</ThemedText>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </View>
        </View>

        <CustomButton
          isLoading={isLoading}
          className='my-5'
          onPress={handleAddVerse}
        >
          Add Verse
        </CustomButton>
      </View>
    </SafeAreaView>
  );
}
