import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import BackHeader from '@/components/BackHeader';
import SettingsIcon from '@/components/icons/SettingsIcon';
import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import PracticeComp from '@/components/PracticeScreen/PracticeComp';

export default function FillInBlanks() {
  const router = useRouter();

  return (
    <SafeAreaView className='flex-1'>
      {Platform.OS === 'web' && (
        <>
          <title>Fill in the Blanks Practice - Into My Heart</title>
          <meta
            name='description'
            content='Practice memorizing Bible verses with fill-in-the-blanks exercises. Test your memory and improve retention.'
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

      <BackHeader
        RightComponent={
          <Button
            size={'icon'}
            variant='ghost'
            onPress={() => router.push('/practice/fill-in-blanks/settings')}
          >
            <SettingsIcon />
          </Button>
        }
        items={[
          { label: 'Practice', href: '/practice' },
          { label: 'Fill in the blanks', href: '/practice/fill-in-blanks' },
        ]}
      />

      <PracticeComp name='fillInBlanks' />
    </SafeAreaView>
  );
}
