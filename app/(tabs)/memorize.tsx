import { Platform, Pressable, View } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import PageHeader from '@/components/PageHeader';
import ThemedText from '@/components/ThemedText';
import FillInBlanksIcon from '@/components/icons/practice/FillInBlanksIcon';
import FlashCardIcon1 from '@/components/icons/practice/FlashCardIcon1';
import RecitationIcon from '@/components/icons/practice/RecitationIcon';
import { getPracticeMethodMeta } from '@/lib/practiceFlow';
import {
  useOfflineCollections,
  useOfflinePracticeSessions,
  useOfflineVerses,
} from '@/hooks/useOfflineData';

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
  const verses = useOfflineVerses();
  const collections = useOfflineCollections();
  const practiceSessions = useOfflinePracticeSessions(1);
  const lastPracticeSession = practiceSessions[0] ?? null;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className='flex-1'>
      {Platform.OS === 'web' && (
        <>
          <title>Memorize - Into My Heart</title>
          <meta
            name='description'
            content='Practice memorizing Bible verses with flashcards, fill-in-the-blanks, and recitation.'
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
              Choose how you want to practice
            </ThemedText>
            <ThemedText className='mt-2 text-sm text-muted-foreground'>
              Open any technique to practice all your saved verses or all the
              verses inside your saved collections. If you want a fresh order
              each time, turn on randomize from the settings icon inside a
              technique.
            </ThemedText>

            <View className='mt-5 flex-row flex-wrap gap-3'>
              {[
                { value: verses.length, label: 'Saved verses' },
                { value: collections.length, label: 'Collections' },
                {
                  value: lastPracticeSession?.verseCount ?? 0,
                  label: 'Last session size',
                },
              ].map(card => (
                <View
                  key={card.label}
                  className='min-w-[110px] flex-1 rounded-2xl bg-background px-4 py-3'
                >
                  <ThemedText className='text-2xl font-semibold'>
                    {card.value}
                  </ThemedText>
                  <ThemedText className='mt-1 text-sm text-muted-foreground'>
                    {card.label}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>

          <View>
            <ThemedText className='font-semibold'>
              Memorization Techniques
            </ThemedText>
            <ThemedText className='mt-1 text-sm text-muted-foreground'>
              Pick the technique you want, then choose verses or collections on
              the next screen.
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
                    <ThemedText className='font-medium'>{meta.label}</ThemedText>
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
