import { Pressable, View } from 'react-native';
import React, { useEffect } from 'react';
import ThemedText from '~/components/ThemedText';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { Text } from '~/components/ui/text';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from '~/components/ui/button';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '~/components/BackHeader';
import { FlashList } from '@shopify/flash-list';
import { BOOKS } from '~/lib/books';
import { Input } from '~/components/ui/input';

export default function AddBookScreen() {
  const router = useRouter();
  const [books, setBooks] = React.useState<any[]>([]);

  return (
    <SafeAreaView>
      <BackHeader
        title='Select book'
        RightComponent={
          <Button variant={'outline'} className='rounded-full px-4 py-2'>
            <ThemedText>KJV</ThemedText>
          </Button>
        }
        items={[
          { label: 'Verses', href: '/verses' },
          { label: 'Select Book', href: '/verses/select-book' },
        ]}
      />
      <View className='px-[18]'>
        <Input placeholder='Search' />

        {/* <FlashList
        data={BOOKS}
        renderItem={({ item }) => <Text>{item.id}</Text>}
        estimatedItemSize={200}
      /> */}

        <ScrollView>
          <Accordion
            type='multiple'
            collapsible
            className='w-full native:max-w-md'
          >
            {BOOKS.map((_, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger className='hover:no-underline'>
                  <View className='flex-row items-center justify-between w-full'>
                    <ThemedText>{_.name}</ThemedText>
                    <ThemedText>{_.chaptersLength}</ThemedText>
                  </View>
                </AccordionTrigger>
                <AccordionContent className='flex-row flex-wrap gap-2'>
                  {new Array(_.chaptersLength).fill(0).map((_, index) => (
                    <Pressable
                      key={index}
                      className='bg-container flex-row justify-center items-center rounded-md w-[54px] h-[40px]'
                      onPress={() => router.push('/verses/select-verses')}
                    >
                      <ThemedText className='text-center'>
                        {index + 1}
                      </ThemedText>
                    </Pressable>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
