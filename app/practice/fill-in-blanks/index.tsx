import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/components/BackHeader';
import SettingsIcon from '@/components/icons/SettingsIcon';
import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import PracticeComp from '@/components/PracticeScreen/PracticeComp';

export const metadata = {
  title: 'Fill in the Blanks Practice - Into My Heart',
  description:
    'Practice memorizing Bible verses with fill-in-the-blanks exercises. Test your memory and improve retention.',
  openGraph: {
    title: 'Fill in the Blanks Practice - Into My Heart',
    description:
      'Practice memorizing Bible verses with fill-in-the-blanks exercises. Test your memory and improve retention.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fill in the Blanks Practice - Into My Heart',
    description:
      'Practice memorizing Bible verses with fill-in-the-blanks exercises. Test your memory and improve retention.',
  },
};

export default function FillInBlanks() {
  const router = useRouter();

  return (
    <SafeAreaView className='flex-1'>
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
