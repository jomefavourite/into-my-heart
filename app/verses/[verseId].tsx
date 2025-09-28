import { View, ScrollView } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from 'convex-helpers/react/cache';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedText from '@/components/ThemedText';
import BackHeader from '@/components/BackHeader';
import { Button } from '@/components/ui/button';
import { Id } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';
import { Card } from '@/components/ui/card';
import NoteIcon from '@/components/icons/NoteIcon';
import ImageIcon from '@/components/icons/ImageIcon';
import IdeaIcon from '@/components/icons/IdeaIcon';
import CustomButton from '@/components/CustomButton';
import { useAuth } from '@clerk/clerk-expo';

export default function VersePage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { verseId } = useLocalSearchParams();
  const verse = useQuery(
    api.verses.getVerseById,
    isSignedIn && isLoaded
      ? {
          id: verseId as Id<'verses'>,
        }
      : 'skip'
  );

  console.log(verse);
  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        title={`${verse?.bookName} ${verse?.chapter}:${verse && verse?.verses?.length > 0 ? verse?.verses.join(', ') : '1'}`}
        items={[
          { label: 'Verses', href: '/verses' },
          { label: 'Verse Page', href: `/verses/${verseId}` },
        ]}
      />

      <View className='flex-1 justify-between px-[18px] pb-[18px]'>
        <View>
          <Card className='h-60 px-8 py-2'>
            <ScrollView
              className='flex-1'
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ justifyContent: 'center', flexGrow: 1 }}
            >
              {verse && verse?.verseTexts?.length > 0
                ? verse?.verseTexts.map((text, index) => (
                    <ThemedText key={index} className=''>
                      {text.verse}. {text.text}
                    </ThemedText>
                  ))
                : '...'}
            </ScrollView>
          </Card>

          <View className='my-4 flex-row justify-center gap-3'>
            {/* <Button size={'icon'}>
              <VolumeHighIcon />
            </Button> */}
            <Button size={'icon'}>
              <NoteIcon />
            </Button>
            {/* <Button size={'icon'}>
              <TimeScheduleIcon />
            </Button> */}
            <Button size={'icon'}>
              <ImageIcon />
            </Button>
          </View>

          <View className='rounded-md bg-container p-3'>
            <View className='flex-row items-center gap-2'>
              <IdeaIcon fontSize={13} />
              <ThemedText className='text-md font-medium'>Study Tip</ThemedText>
            </View>

            <ThemedText className='text-secondary-text text-sm'>
              Read the verse aloud repeatedly and try to understand the context
              and meaning.
            </ThemedText>
          </View>
        </View>

        <CustomButton>Start practice</CustomButton>
      </View>
    </SafeAreaView>
  );
}
