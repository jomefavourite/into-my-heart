import { View } from 'react-native';
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from 'convex-helpers/react/cache';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedText from '~/components/ThemedText';
import BackHeader from '~/components/BackHeader';
import { Button } from '~/components/ui/button';
import RemoveCircleIcon from '~/components/icons/RemoveCircleIcon';

export default function VersePage() {
  const { verseId } = useLocalSearchParams();
  // const thread = useQuery(api.messages.getThreadById, { verseId: verseId as Id<'messages'> });
  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        title='My Verses'
        items={[
          { label: 'Verses', href: '/verses' },
          { label: 'Verse Page', href: `/verses/${verseId}` },
        ]}
      />
      <ThemedText>Verse Page</ThemedText>
    </SafeAreaView>
  );
}
