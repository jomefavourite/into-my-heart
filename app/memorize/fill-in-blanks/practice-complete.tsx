import React from 'react';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { MemorizePracticeCompleteScreen } from '@/components/PracticeScreen/MemorizePracticeCompleteScreen';
import { usePracticeStore } from '@/store/practiceStore';

export default function FillInBlanksPracticeComplete() {
  const router = useRouter();
  const { currentSession, clearPracticeSession, setPracticeSession } =
    usePracticeStore();

  const handleGoBack = () => {
    clearPracticeSession();
    router.replace('/memorize/fill-in-blanks');
  };

  return (
    <MemorizePracticeCompleteScreen
      method='fillInBlanks'
      title='Fill in the Blanks Complete'
      bodyPrimary='Nice work. You moved from recognition into guided recall.'
      bodySecondary='Next best step: recite the verse aloud with lighter prompts.'
    >
      {currentSession && (
        <CustomButton
          onPress={() => {
            setPracticeSession(
              currentSession.verses,
              currentSession.practiceType,
              'recitation',
              currentSession.source ?? 'manualTechnique'
            );
            router.replace('/memorize/recitation/practice');
          }}
          className='w-full'
        >
          Continue to Recitation
        </CustomButton>
      )}

      <CustomButton
        onPress={() => router.replace('/memorize/fill-in-blanks/practice')}
        variant='outline'
        className='w-full bg-transparent'
      >
        Practice Fill in the Blanks Again
      </CustomButton>

      <CustomButton onPress={handleGoBack} variant='ghost' className='w-full'>
        Back to Fill in the Blanks
      </CustomButton>
    </MemorizePracticeCompleteScreen>
  );
}
