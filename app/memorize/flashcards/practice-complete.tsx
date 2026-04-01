import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import CustomButton from '@/components/CustomButton';
import CheckmarkCircleIcon from '@/components/icons/CheckmarkCircleIcon';
import { usePracticeStore } from '@/store/practiceStore';

export default function PracticeComplete() {
  const router = useRouter();
  const { currentSession, clearPracticeSession } = usePracticeStore();

  const handleGoBack = () => {
    clearPracticeSession();
    router.replace('/memorize/flashcards');
  };

  const handlePracticeAgain = () => {
    router.replace('/memorize/flashcards/practice');
  };

  const handleContinue = () => {
    router.replace('/memorize/fill-in-blanks/practice');
  };

  return (
    <SafeAreaView className='flex-1 items-center justify-center p-6'>
      <View className='w-full max-w-md items-center rounded-3xl bg-container p-6'>
        <View className='mb-6'>
          <CheckmarkCircleIcon width={80} height={80} />
        </View>

        <ThemedText
          size={27}
          variant='bold'
          className='mb-4 text-center text-foreground'
        >
          Flashcards Complete
        </ThemedText>

        <ThemedText
          size={16}
          className='mb-3 text-center text-muted-foreground'
        >
          Great work. You started with recognition and active recall.
        </ThemedText>

        <ThemedText className='mb-8 text-center text-sm text-muted-foreground'>
          Next best step: fill in the missing words while the verses are still
          fresh.
        </ThemedText>

        <View className='w-full gap-3'>
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

          <CustomButton
            onPress={handleGoBack}
            variant='ghost'
            className='w-full'
          >
            Back to Flashcards
          </CustomButton>
        </View>
      </View>
    </SafeAreaView>
  );
}
