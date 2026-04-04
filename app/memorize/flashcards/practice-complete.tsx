import React from 'react';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { MemorizePracticeCompleteScreen } from '@/components/PracticeScreen/MemorizePracticeCompleteScreen';
import { usePracticeStore } from '@/store/practiceStore';

export default function PracticeComplete() {
  const router = useRouter();
  const { currentSession, clearPracticeSession, setPracticeSession } =
    usePracticeStore();

  const handleGoBack = () => {
    clearPracticeSession();
    router.replace('/memorize/flashcards');
  };

  const handlePracticeAgain = () => {
    router.replace('/memorize/flashcards/practice');
  };

  const handleContinue = () => {
    if (!currentSession) {
      return;
    }

    setPracticeSession(
      currentSession.verses,
      currentSession.practiceType,
      'fillInBlanks',
      currentSession.source ?? 'manualTechnique'
    );
    router.replace('/memorize/fill-in-blanks/practice');
  };

  return (
    <MemorizePracticeCompleteScreen
      method='flashcards'
      title='Flashcards Complete'
      bodyPrimary='Great work. You started with recognition and active recall.'
      bodySecondary='Next best step: fill in the missing words while the verses are still fresh.'
    >
      {currentSession && (
        <CustomButton onPress={handleContinue} className='w-full'>
          Continue to Fill in the blanks
        </CustomButton>
      )}

      <CustomButton
        onPress={handlePracticeAgain}
        variant='outline'
        className='w-full bg-transparent'
      >
        Practice Flashcards Again
      </CustomButton>

      <CustomButton onPress={handleGoBack} variant='ghost' className='w-full'>
        Back to Flashcards
      </CustomButton>
    </MemorizePracticeCompleteScreen>
  );
}
