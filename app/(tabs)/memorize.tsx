import { View, Platform, Pressable } from 'react-native';
import React from 'react';
import ThemedText from '@/components/ThemedText';
import CustomButton from '@/components/CustomButton';
import { useRouter } from 'expo-router';
import FillInBlanksIcon from '@/components/icons/practice/FillInBlanksIcon';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import FlashCardIcon1 from '@/components/icons/practice/FlashCardIcon1';
import RecitationIcon from '@/components/icons/practice/RecitationIcon';
import PageHeader from '@/components/PageHeader';
import { getPracticeMethodMeta } from '@/lib/practiceFlow';

const methods = [
  {
    key: 'flashcards',
    Icon: FlashCardIcon1,
  },
  {
    key: 'fillInBlanks',
    Icon: FillInBlanksIcon,
  },
  {
    key: 'recitation',
    Icon: RecitationIcon,
  },
] as const;

export default function MemorizeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className='flex-1'>
      {Platform.OS === 'web' && (
        <>
          <title>Memorize - Into My Heart</title>
          <meta
            name='description'
            content='Practice memorizing Bible verses with flashcards, fill-in-the-blanks, and recitation techniques.'
          />
          <meta
            name='keywords'
            content='Bible, memorization, verses, flashcards, practice, Christian, faith, scripture'
          />
          <meta name='author' content='Into My Heart' />
          <meta name='robots' content='index, follow' />
          <meta property='og:type' content='website' />
          <meta property='og:site_name' content='Into My Heart' />
          <meta property='og:locale' content='en_US' />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='theme-color' content='#313131' />
          <meta name='msapplication-TileColor' content='#313131' />
        </>
      )}

      <PageHeader title='Memorize' />

      <ScrollView>
        <View className='gap-6 px-[18px] py-6'>
          <View className='rounded-3xl bg-container p-5'>
            <ThemedText size={18} variant='medium'>
              Recommended memorization flow
            </ThemedText>
            <ThemedText className='mt-2 text-sm text-muted-foreground'>
              Start with recognition, move to guided recall, then finish by
              reciting aloud. Short focused sessions help verses stay with you
              longer.
            </ThemedText>
            <View className='mt-4 gap-2'>
              <ThemedText className='text-sm'>1. Flashcards</ThemedText>
              <ThemedText className='text-sm'>2. Fill in the blanks</ThemedText>
              <ThemedText className='text-sm'>3. Recitation</ThemedText>
            </View>
            <CustomButton
              size='lg'
              className='mt-5 self-start px-6'
              onPress={() => router.push('/memorize/flashcards')}
            >
              Start Guided Session
            </CustomButton>
          </View>

          <View>
            <ThemedText className='font-semibold'>
              Memorization Techniques
            </ThemedText>
            <ThemedText className='mt-1 text-sm text-muted-foreground'>
              Pick a method or move through all three in order.
            </ThemedText>
          </View>

          <View className='mt-3 gap-3'>
            {methods.map(method => {
              const meta = getPracticeMethodMeta(method.key);

              return (
                <Pressable
                  key={method.key}
                  onPress={() => router.push(meta.startRoute)}
                  className='w-full flex-row items-center justify-between rounded-2xl border border-[#E8E8E8] bg-background px-4 py-4 web:p-6 dark:border-[#E8E8E8]'
                >
                  <View className='flex-1 pr-4'>
                    <ThemedText className='font-medium'>
                      {meta.label}
                    </ThemedText>
                    <ThemedText className='mt-1 text-sm text-muted-foreground'>
                      {meta.description}
                    </ThemedText>
                  </View>
                  <method.Icon className='bottom-0 right-0 web:absolute' />
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
