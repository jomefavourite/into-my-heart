import React, { useCallback, memo, useMemo, useState } from 'react';
import { View, Pressable, FlatList, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
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
} from '~/components/ui/accordion';

const screenWidth = Dimensions.get('window').width;
const numColumns = Math.floor(screenWidth / 60); // ~60px per chapter item

const ChapterItem = memo(
  ({ bookId, chapter }: { bookId: string; chapter: number }) => {
    const router = useRouter();

    const handlePress = useCallback(() => {
      router.push(`/verses/select-verses?book=${bookId}&chapter=${chapter}`);
    }, [bookId, chapter]);

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

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return BOOKS;
    const lower = searchQuery.trim().toLowerCase();
    return BOOKS.filter(
      (book) =>
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
        items={[
          { label: 'Verses', href: '/verses' },
          { label: 'Select Book', href: '/verses/select-book' },
        ]}
      />

      <View className='flex-1 px-[18] gap-2'>
        <Input
          placeholder='Search by name or abbreviation'
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView className='flex-1'>
          <Accordion
            type='single'
            collapsible
            className='w-full native:max-w-md'
          >
            {filteredBooks.map((book) => (
              <AccordionItem key={book.id} value={`item-${book.id}`}>
                <AccordionTrigger className='hover:no-underline'>
                  <View className='flex-row items-center justify-between w-full'>
                    <ThemedText>{book.name}</ThemedText>
                    <ThemedText>{book.chaptersLength}</ThemedText>
                  </View>
                </AccordionTrigger>

                <AccordionContent className='flex-row flex-wrap gap-2 place-content-center md:place-content-start'>
                  <FlatList
                    data={Array.from(
                      { length: book.chaptersLength },
                      (_, i) => i + 1
                    )}
                    keyExtractor={(item) => item.toString()}
                    numColumns={numColumns}
                    // scrollEnabled={false}
                    contentContainerStyle={{
                      paddingBottom: 10,
                    }}
                    renderItem={({ item }) => (
                      <ChapterItem chapter={item} bookId={book.id} />
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
