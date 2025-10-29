import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import BackHeader from '@/components/BackHeader';
import { BOOKS } from '@/lib/books';
import ThemedText from '@/components/ThemedText';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'; // from react-native-reusables
import { useBookStore } from '@/store/bookStore';
import { useIsCollOrVerse } from '@/store/tab-store';
import { ScrollView } from 'react-native';

type ChapterItemType = {
  bookName: string;
  chapter: number;
  chapterLength: number;
  chapters: {
    chapterNumber: number;
    versesLength: number;
  }[];
};

const ChapterItem = React.memo(
  ({ bookName, chapter, chapterLength, chapters }: ChapterItemType) => {
    const router = useRouter();
    const { setBookName, setChapter, setChapterLength, setVersesLength } =
      useBookStore();

    const handlePress = useCallback(() => {
      setBookName(bookName);
      setChapter(chapter);
      setChapterLength(chapterLength);

      const verseLength = chapters[chapter - 1].versesLength;
      setVersesLength(verseLength);

      router.push(
        `/verses/select-verses?book=${bookName}&chapter=${chapter}&verseLength=${verseLength}`
      );
    }, [bookName, chapter]);

    return (
      <Pressable
        className='h-[60px] min-w-[60px] max-w-[60px] flex-1 flex-row items-center justify-center rounded-md bg-container'
        onPress={handlePress}
      >
        <ThemedText className='text-center'>{chapter}</ThemedText>
      </Pressable>
    );
  }
);

export default function AddBookScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { setVerses } = useBookStore();
  const { isCollOrVerse } = useIsCollOrVerse();

  // Reset verses when the screen is loaded
  useEffect(() => {
    setVerses([]);
  }, []);

  // Clear verses whenever the page comes into focus
  useFocusEffect(
    useCallback(() => {
      setVerses([]);
    }, [setVerses])
  );

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return BOOKS;
    const lower = searchQuery.trim().toLowerCase();
    return BOOKS.filter(
      book =>
        book.name.toLowerCase().includes(lower) ||
        book.abbreviation.toLowerCase().includes(lower)
    );
  }, [searchQuery]);

  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        title='Select book'
        RightComponent={
          <Button variant='outline' className='rounded-full px-4 py-2'>
            <ThemedText>KJV</ThemedText>
          </Button>
        }
        items={
          isCollOrVerse === 'collections'
            ? [
                { label: 'Verses', href: '/verses' },
                {
                  label: 'Create Collection',
                  href: '/verses/create-collection',
                },
                { label: 'Select Book', href: '/verses/select-book' },
              ]
            : [
                { label: 'Verses', href: '/verses' },
                { label: 'Select Book', href: '/verses/select-book' },
              ]
        }
      />

      <View className='mb-2 gap-2 px-[18]'>
        <Input
          placeholder='Search by name or abbreviation'
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View className='mt-2 flex flex-row justify-between'>
          <ThemedText className='text-xs font-medium'>Books</ThemedText>
          <ThemedText className='text-xs font-medium'>
            Total Chapters
          </ThemedText>
        </View>
      </View>

      <ScrollView
        className='flex-1 px-[18]'
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Accordion type='single' collapsible>
          {filteredBooks.map(book => (
            <AccordionItem key={book.id} value={book.id}>
              <AccordionTrigger className='hover:no-underline'>
                <View className='flex-1 flex-row items-center justify-between'>
                  <ThemedText>{book.name}</ThemedText>
                  <ThemedText>{book.chaptersLength}</ThemedText>
                </View>
              </AccordionTrigger>

              <AccordionContent>
                <View className='flex-row flex-wrap gap-2'>
                  {Array.from({ length: book.chaptersLength }, (_, i) => (
                    <ChapterItem
                      key={i + 1}
                      chapter={i + 1}
                      bookName={book.name}
                      chapterLength={book.chaptersLength}
                      chapters={book.chapters}
                    />
                  ))}
                </View>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollView>
    </SafeAreaView>
  );
}
