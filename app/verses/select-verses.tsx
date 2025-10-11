import { ScrollView, View } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ThemedText from '@/components/ThemedText';
import BackHeader from '@/components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import CustomButton from '@/components/CustomButton';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useBookStore } from '@/store/bookStore';
import { useIsCollOrVerse } from '@/store/tab-store';

export default function SelectVerses() {
  const router = useRouter();
  const {
    book: bookURL,
    chapter: chapterURL,
    verseLength: verseLengthURL,
    verses: versesURL,
  } = useLocalSearchParams();

  let {
    bookName: bookName1,
    chapter: chapter1,
    versesLength: versesLength1,
    verses: storeVerses,
    setVerses,
  } = useBookStore();
  const { isCollOrVerse } = useIsCollOrVerse();
  const hasInitialized = useRef(false);

  // Extract values from URL or fallback to store
  const bookName = bookURL || bookName1;
  const chapter = chapterURL || chapter1;
  const versesLength = Number(verseLengthURL) || versesLength1;

  // Use local state as the single source of truth for UI
  const [localVerses, setLocalVerses] = useState<string[]>([]);
  const [isUpdatingProgrammatically, setIsUpdatingProgrammatically] =
    useState(false);

  // Restore verses from URL parameters on mount or clear for fresh start
  useEffect(() => {
    if (!hasInitialized.current) {
      if (versesURL) {
        const urlVerses = String(versesURL).split(',').filter(Boolean);
        setLocalVerses(urlVerses);
        setVerses(urlVerses);
      } else {
        // If no versesURL parameter, clear verses for fresh selection
        setLocalVerses([]);
        setVerses([]);
      }
      hasInitialized.current = true;
    }
  }, [versesURL, setVerses]);

  // Sync local state to store when it changes (but not during programmatic updates)
  useEffect(() => {
    if (!isUpdatingProgrammatically) {
      setVerses(localVerses);
    }
  }, [localVerses, setVerses, isUpdatingProgrammatically]);

  const handleValueChange = useCallback((newValue: string[]) => {
    setLocalVerses(newValue);
  }, []);

  const handlePress = useCallback(() => {
    router.push(
      `/verses/verse-summary?book=${bookName}&chapter=${chapter}&verseLength=${versesLength}&verses=${localVerses.join(',')}`
    );
  }, [bookName, chapter, versesLength, localVerses, router]);

  const handleAddAllVerse = useCallback(() => {
    const newVerses = Array.from(
      { length: Number(versesLength) },
      (_, index) => `${index + 1}`
    );

    // Set flag to prevent sync loop
    setIsUpdatingProgrammatically(true);
    setLocalVerses(newVerses);
    setVerses(newVerses);

    // Reset flag after state updates
    setTimeout(() => {
      setIsUpdatingProgrammatically(false);
    }, 0);
  }, [versesLength, setVerses]);

  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        title='Select Verses'
        items={
          isCollOrVerse === 'collections'
            ? [
                { label: 'Verses', href: '/verses' },
                {
                  label: 'Create Collection',
                  href: '/verses/create-collection',
                },
                { label: 'Select Book', href: '/verses/select-book' },
                { label: 'Select Verses', href: '/verses/select-verses' },
              ]
            : [
                { label: 'Verses', href: '/verses' },
                { label: 'Select Book', href: '/verses/select-book' },
                { label: 'Select Verses', href: '/verses/select-verses' },
              ]
        }
      />

      <View className='flex-1 justify-between px-[18px]'>
        <View className='flex-1'>
          <ThemedText className='mb-4 text-lg font-semibold'>
            {bookName} {chapter}
          </ThemedText>

          <ToggleGroup
            value={localVerses}
            onValueChange={handleValueChange}
            type='multiple'
            className='flex-wrap gap-2'
          >
            {new Array(versesLength).fill(0).map((_, index) => {
              const verseValue = `${index + 1}`;
              const isActive = localVerses.includes(verseValue);

              return (
                <ToggleGroupItem
                  key={index}
                  value={verseValue}
                  aria-label={`Select verse ${index + 1}`}
                  className={`min-h-[40px] min-w-[54px] flex-none flex-row items-center justify-center rounded-md bg-container ${isActive ? 'bg-black hover:bg-black web:group-hover:bg-black dark:bg-zinc-500' : ''}`}
                >
                  <ThemedText style={isActive ? { color: 'white' } : {}}>
                    {index + 1}
                  </ThemedText>
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </View>

        <View className='my-5 gap-3'>
          <CustomButton variant='outline' onPress={handleAddAllVerse}>
            Add entire chapter
          </CustomButton>
          <CustomButton
            onPress={() => handlePress()}
            disabled={localVerses.length === 0}
          >
            Continue
          </CustomButton>
        </View>
      </View>
    </SafeAreaView>
  );
}
