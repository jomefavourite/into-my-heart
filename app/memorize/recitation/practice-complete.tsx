import React from 'react';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { MemorizePracticeCompleteScreen } from '@/components/PracticeScreen/MemorizePracticeCompleteScreen';
import { usePracticeStore } from '@/store/practiceStore';

export default function RecitationPracticeComplete() {
  const router = useRouter();
  const { clearPracticeSession } = usePracticeStore();

  return (
    <MemorizePracticeCompleteScreen
      method='recitation'
      title='Recitation Complete'
      bodyPrimary='You finished the strongest recall step in the flow.'
      bodySecondary='Keep revisiting the verses that needed review. Consistent short sessions will make them feel natural.'
    >
      <CustomButton
        onPress={() => router.replace('/memorize/recitation/practice')}
        className='w-full'
      >
        Practice Recitation Again
      </CustomButton>

      <CustomButton
        onPress={() => {
          clearPracticeSession();
          router.replace('/memorize');
        }}
        variant='outline'
        className='w-full bg-transparent'
      >
        Back to Memorize
      </CustomButton>
    </MemorizePracticeCompleteScreen>
  );
}
