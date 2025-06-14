import { View, Text } from 'react-native';
import React, { useCallback } from 'react';
import ThemedText from '~/components/ThemedText';
import BackHeader from '~/components/BackHeader';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Button } from '~/components/ui/button';
import ArrowRightIcon from '~/components/icons/ArrowRightIcon';
import CustomButton from '~/components/CustomButton';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useBookStore } from '~/store/bookStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { useMutation } from 'convex/react';
import { api } from '~/convex/_generated/api';
import { useIsCollOrVerse, useVersesTabStore } from '~/store/tab-store';
import { addCollection } from '~/convex/collections';

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

  const { activeTab } = useVersesTabStore();
  const { isCollOrVerse } = useIsCollOrVerse();

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

    if (!bookName || !chapter) {
      console.error('Book name or chapter is not set');
      return;
    }

    if (isCollOrVerse === 'collections') {
      setCollectionVerses({
        bookName,
        chapter,
        reviewFreq: reviewFreqValue,
        verses: versesList.map((v) => v.toString()),
      });
      setVerses([]);
      router.push('/verses/create-collection');
      return;
    }

    try {
      await addVerse({
        bookName: bookName,
        chapter: chapter,
        verses: versesList.map((v) => v.toString()),
        reviewFreq: reviewFreqValue,
      });
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

        <CustomButton className='my-5' onPress={handleAddVerse}>
          Add verse
        </CustomButton>
      </View>
    </SafeAreaView>
  );
}
