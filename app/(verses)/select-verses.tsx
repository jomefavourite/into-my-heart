import { View, SafeAreaView, Pressable, ScrollView } from 'react-native';
import React from 'react';
import ThemedText from '~/components/ThemedText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '~/components/ui/button';
import ArrowLeftIcon from '~/assets/icons/ArrowLeftIcon';
import { bibleBooks } from '~/lib/constants';

export default function SelectVerses() {
  const router = useRouter();
  const { book } = useLocalSearchParams();
  
  const selectedBook = bibleBooks.find(b => b.name === book);

  return (
    <SafeAreaView style={{ padding: 18 }}>
      <View className="flex-row justify-between items-center">
        <Button size={'icon'} variant={'ghost'} onPress={() => router.back()}>
          <ArrowLeftIcon />
        </Button>
        <ThemedText>Select Verse</ThemedText>
        <Button
          variant={'outline'}
          className="rounded-full px-4 py-2"
          onPress={() => router.push('/(verses)/versions')}
        >
          <ThemedText>KJV</ThemedText>
        </Button>
      </View>

      <ScrollView>
        {selectedBook && (
          <View className="flex-row flex-wrap">
            {Array.from({ length: selectedBook.chapters }, (_, chapterIndex) => (
              <Pressable
                key={chapterIndex}
                onPress={() => console.log('Selected chapter', chapterIndex + 1)}
                className="p-2 m-1 bg-gray-50 dark:bg-[#333333] rounded"
              >
                <ThemedText className="text-white px-2">{chapterIndex + 1}</ThemedText>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
