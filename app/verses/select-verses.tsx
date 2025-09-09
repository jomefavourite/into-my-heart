import { ScrollView, View } from 'react-native';
import React, { useCallback, useEffect, useRef } from 'react';
import ThemedText from '~/components/ThemedText';
import BackHeader from '~/components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group';
import CustomButton from '~/components/CustomButton';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useBookStore } from '~/store/bookStore';
import { useIsCollOrVerse } from '~/store/tab-store';

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

  console.log(bookName1, chapter1, versesLength1, storeVerses, 'storeVerses');

  // Extract values from URL or fallback to store
  const bookName = bookURL || bookName1;
  const chapter = chapterURL || chapter1;
  const versesLength = Number(verseLengthURL) || versesLength1;

  // Use store verses as the source of truth, but initialize from URL if present
  const [localVerses, setLocalVerses] = React.useState<string[]>([]);

  // Restore verses from URL parameters on mount or clear for fresh start
  useEffect(() => {
    if (!hasInitialized.current) {
      if (versesURL) {
        const urlVerses = String(versesURL).split(',').filter(Boolean);
        setVerses(urlVerses);
        setLocalVerses(urlVerses);
      } else {
        // If no versesURL parameter, clear verses for fresh selection
        setVerses([]);
        setLocalVerses([]);
      }
      hasInitialized.current = true;
    }
  }, [versesURL, setVerses]);

  // Use local verses for display and interaction
  const verses = localVerses;

  const handleValueChange = (newValue: string[]) => {
    console.log(newValue);
    setVerses(newValue);
    setLocalVerses(newValue);
  };

  const handlePress = useCallback(() => {
    // console.log(verses, verses.join(','));
    router.push(
      `/verses/verse-summary?book=${bookName}&chapter=${chapter}&verseLength=${versesLength}&verses=${verses.join(',')}`
    );
  }, [bookName, chapter, verses]);

  const handleAddAllVerse = useCallback(() => {
    const newVerses = Array.from(
      { length: Number(versesLength) },
      (_, index) => `${index + 1}`
    );
    setVerses(newVerses);
    setLocalVerses(newVerses);
  }, [versesLength]);

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
        <ScrollView className='flex-1'>
          <ThemedText variant='medium' className=' text-lg font-semibold mb-4'>
            {bookName} {chapter}
          </ThemedText>

          <ToggleGroup
            value={verses}
            onValueChange={handleValueChange}
            type='multiple'
            className=' w-full flex-wrap gap-2 justify-start'
          >
            {new Array(versesLength).fill(0).map((_, index) => {
              const verseValue = `${index + 1}`;
              const isActive = verses.includes(verseValue);

              return (
                <ToggleGroupItem
                  key={index}
                  value={verseValue}
                  aria-label={`Select verse ${index + 1}`}
                  className={`bg-container flex-row  items-center rounded-md w-[54px] h-[40px] ${isActive ? 'bg-black hover:bg-black dark:bg-zinc-500 web:group-hover:bg-black' : ''}`}
                >
                  <ThemedText style={isActive ? { color: 'white' } : {}}>
                    {index + 1}
                  </ThemedText>
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </ScrollView>

        <View className='my-5 gap-3'>
          <CustomButton variant='outline' onPress={handleAddAllVerse}>
            Add entire chapter
          </CustomButton>
          <CustomButton
            onPress={() => handlePress()}
            disabled={verses.length === 0}
          >
            Continue
          </CustomButton>
        </View>
      </View>
    </SafeAreaView>
  );
}
