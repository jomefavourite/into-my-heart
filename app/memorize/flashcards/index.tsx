import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import BackHeader from '@/components/BackHeader';
import PracticeComp from '@/components/PracticeScreen/PracticeComp';

export default function Flashcards() {
  return (
    <SafeAreaView className='flex-1'>
      {Platform.OS === 'web' && (
        <>
          <title>Flashcards Practice - Into My Heart</title>
          <meta
            name='description'
            content='Practice memorizing Bible verses with interactive flashcards. Test your knowledge and improve retention.'
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
        title='Flashcards'
        items={[
          { label: 'Memorize', href: '/memorize' },
          { label: 'Flashcards', href: '/memorize/flashcards' },
        ]}
      />

      <PracticeComp name='flashcards' />
    </SafeAreaView>
  );
}
