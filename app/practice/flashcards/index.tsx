import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/components/BackHeader';
import SettingsIcon from '@/components/icons/SettingsIcon';
import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import PracticeComp from '@/components/PracticeScreen/PracticeComp';

export default function Flashcards() {
  const router = useRouter();

  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        RightComponent={
          <Button
            size={'icon'}
            variant='ghost'
            onPress={() => router.push('/practice/flashcards')}
          >
            <SettingsIcon />
          </Button>
        }
        items={[
          { label: 'Practice', href: '/practice' },
          { label: 'Flashcards', href: '/practice/flashcards' },
        ]}
      />

      <PracticeComp name='flashcards' />
    </SafeAreaView>
  );
}
