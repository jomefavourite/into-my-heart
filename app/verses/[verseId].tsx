import { View } from 'react-native';
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from 'convex-helpers/react/cache';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedText from '~/components/ThemedText';
import BackHeader from '~/components/BackHeader';
import { Button } from '~/components/ui/button';
import RemoveCircleIcon from '~/components/icons/RemoveCircleIcon';
import { Id } from '~/convex/_generated/dataModel';
import { api } from '~/convex/_generated/api';
import { Card } from '~/components/ui/card';
import VolumeHighIcon from '~/components/icons/VolumeHighIcon';
import NoteIcon from '~/components/icons/NoteIcon';
import TimeScheduleIcon from '~/components/icons/TimeScheduleIcon';
import ImageIcon from '~/components/icons/ImageIcon';
import IdeaIcon from '~/components/icons/IdeaIcon';
import CustomButton from '~/components/CustomButton';

export default function VersePage() {
  const { verseId } = useLocalSearchParams();
  const verse = useQuery(api.verses.getVerseById, {
    id: verseId as Id<'verses'>,
  });

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
          <Card className='p-2 h-60 justify-center items-center flex-row'>
            <ThemedText className='text-center'>
              {verse && verse?.verseTexts?.length > 0
                ? verse?.verseTexts.map(
                    (text, index) => `${text.verse}. ${text.text} `
                  )
                : '...'}
            </ThemedText>
          </Card>

          <View className='flex-row gap-3 justify-center my-4'>
            <Button size={'icon'}>
              <VolumeHighIcon />
            </Button>
            <Button size={'icon'}>
              <NoteIcon />
            </Button>
            <Button size={'icon'}>
              <TimeScheduleIcon />
            </Button>
            <Button size={'icon'}>
              <ImageIcon />
            </Button>
          </View>

          <View className='p-3 bg-container rounded-md'>
            <View className='flex-row items-center gap-2'>
              <IdeaIcon fontSize={13} />
              <ThemedText size={12} variant='medium'>
                Study Tip
              </ThemedText>
            </View>

            <ThemedText size={12} className='text-secondary-text'>
              Listen and read the verse aloud repeatedly and try to understand
              the context and meaning.
            </ThemedText>
          </View>
        </View>

        <CustomButton>Start practice</CustomButton>
      </View>
    </SafeAreaView>
  );
}
