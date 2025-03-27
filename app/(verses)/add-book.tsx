import { View } from 'react-native';
import React from 'react';
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

export default function AddBookScreen() {
  const router = useRouter();
  return (
    <View>
      <View className='flex-row items-center'>
        <ThemedText>Select book</ThemedText>
        <Button
          variant={'outline'}
          className='rounded-full px-4 py-2'
          onPress={() => router.push('/(verses)/versions')}
        >
          <ThemedText>KJV</ThemedText>
        </Button>
      </View>

      <ScrollView>
        <Accordion
          type='multiple'
          collapsible
          defaultValue={['item-1']}
          className='w-full max-w-sm native:max-w-md'
        >
          {new Array(66).fill(null).map((_, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger>
                <Text>Is it accessible?</Text>
              </AccordionTrigger>
              <AccordionContent>
                <Text>Yes. It adheres to the WAI-ARIA design pattern.</Text>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollView>
    </View>
  );
}
