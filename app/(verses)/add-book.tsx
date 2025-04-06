import { FlatList, Pressable, View } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

import ThemedText from '~/components/ThemedText';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import ArrowLeftIcon from '~/assets/icons/ArrowLeftIcon';
import { bibleBooks } from '~/lib/constants';
import { cn } from '~/lib/utils';


export default function AddBookScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ padding: 18 }}>
      <View className="flex-row justify-between items-center">
        <Button size={'icon'} variant={'ghost'} onPress={() => router.back()}>
          <ArrowLeftIcon />
        </Button>
        <ThemedText>Select book</ThemedText>
        <Button
          variant={'outline'}
          className="rounded-full px-4 py-2"
          onPress={() => router.push('/(verses)/versions')}
        >
          <ThemedText>KJV</ThemedText>
        </Button>
      </View>

      <View>
        <FlatList
          data={bibleBooks}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({
              pathname: '/(verses)/select-verses',
              params: { book: item.name }
            })}
          >
            <View className={cn('flex flex-row justify-between my-4')}>
              <ThemedText>{item.name}</ThemedText>
              <ThemedText>{item.chapters}</ThemedText>
            </View>
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        />
    </View>
    </SafeAreaView>
  );
}
