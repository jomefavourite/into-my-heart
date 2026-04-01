import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/components/BackHeader';
import PracticeComp from '@/components/PracticeScreen/PracticeComp';

export default function RecitationIndex() {
  return (
    <SafeAreaView className='flex-1'>
      {Platform.OS === 'web' && (
        <>
          <title>Recitation Practice - Into My Heart</title>
          <meta
            name='description'
            content='Practice memorizing Bible verses by reciting them aloud with light prompts and active recall.'
          />
        </>
      )}

      <BackHeader
        title='Recitation'
        items={[
          { label: 'Memorize', href: '/memorize' },
          { label: 'Recitation', href: '/memorize/recitation' },
        ]}
      />

      <PracticeComp name='recitation' />
    </SafeAreaView>
  );
}
