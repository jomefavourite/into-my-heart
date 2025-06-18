import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  View,
  Pressable,
  FlatList,
  Dimensions,
  InteractionManager,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import BackHeader from '~/components/BackHeader';
import { BOOKS } from '~/lib/books';
import ThemedText from '~/components/ThemedText';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'; // from react-native-reusables
import { useBookStore } from '~/store/bookStore';
import { ScrollView } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const numColumns = Math.floor(screenWidth / 60); // ~60px per chapter item

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
        className='bg-container flex-row justify-center items-center rounded-md w-[54px] h-[40px] m-1'
        onPress={handlePress}
      >
        <ThemedText className='text-center'>{chapter}</ThemedText>
      </Pressable>
    );
  }
);

export default function AddBookScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [ready, setReady] = useState(false);

  // Defer rendering to after transition
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setReady(true);
    });
    return () => task.cancel();
  }, []);

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return BOOKS;
    const lower = searchQuery.trim().toLowerCase();
    return BOOKS.filter(
      (book) =>
        book.name.toLowerCase().includes(lower) ||
        book.abbreviation.toLowerCase().includes(lower)
    );
  }, [searchQuery]);

  if (!ready) {
    return (
      <SafeAreaView className='flex-1 justify-center items-center'>
        <ActivityIndicator size='large' />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        title='Select book'
        RightComponent={
          <Button variant='outline' className='rounded-full px-4 py-2'>
            <ThemedText>KJV</ThemedText>
          </Button>
        }
        items={[
          { label: 'Verses', href: '/verses' },
          { label: 'Select Book', href: '/verses/select-book' },
        ]}
      />

      <View className='mb-4 gap-2 px-[18]'>
        <Input
          placeholder='Search by name or abbreviation'
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        className='flex-1 px-[18]'
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Accordion type='single' collapsible>
          {filteredBooks.map((book) => (
            <AccordionItem key={book.id} value={book.id}>
              <AccordionTrigger className='hover:no-underline'>
                <View className='flex-row items-center justify-between w-full'>
                  <ThemedText>{book.name}</ThemedText>
                  <ThemedText>{book.chaptersLength}</ThemedText>
                </View>
              </AccordionTrigger>

              <AccordionContent className='flex-row flex-wrap gap-2'>
                <FlatList
                  data={Array.from(
                    { length: book.chaptersLength },
                    (_, i) => i + 1
                  )}
                  keyExtractor={(item) => item.toString()}
                  numColumns={numColumns}
                  scrollEnabled={false}
                  contentContainerStyle={{ paddingBottom: 10 }}
                  renderItem={({ item }) => (
                    <ChapterItem
                      chapter={item}
                      bookName={book.name}
                      chapterLength={book.chaptersLength}
                      chapters={book.chapters}
                    />
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollView>
    </SafeAreaView>
  );
}
