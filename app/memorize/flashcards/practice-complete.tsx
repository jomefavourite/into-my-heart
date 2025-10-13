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
  const { clearPracticeSession } = usePracticeStore();

  const handleGoBack = () => {
    clearPracticeSession();
    router.push('/memorize/flashcards');
  };

  const handlePracticeAgain = () => {
    clearPracticeSession();
    router.push('/memorize/flashcards');
  };

  return (
    <SafeAreaView className='flex-1 items-center justify-center p-6'>
      <View className='items-center'>
        {/* Success Icon */}
        <View className='mb-6'>
          <CheckmarkCircleIcon width={80} height={80} />
        </View>

        {/* Title */}
        <ThemedText
          size={27}
          variant='bold'
          className='mb-4 text-center text-foreground'
        >
          Practice Complete!
        </ThemedText>

        {/* Subtitle */}
        <ThemedText
          size={16}
          variant='regular'
          className='mb-8 text-center text-muted-foreground'
        >
          Great job! You've completed your flashcard practice session.
        </ThemedText>

        {/* Action Buttons */}
        <View className='w-full max-w-sm space-y-4'>
          <CustomButton onPress={handlePracticeAgain} className='w-full'>
            Practice Again
          </CustomButton>

          <CustomButton
            onPress={handleGoBack}
            variant='outline'
            className='w-full'
          >
            Back to Flashcards
          </CustomButton>
        </View>
      </View>
    </SafeAreaView>
  );
}
