import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import CustomButton from '@/components/CustomButton';
import CheckmarkCircleIcon from '@/components/icons/CheckmarkCircleIcon';
import { usePracticeStore } from '@/store/practiceStore';

export default function RecitationPracticeComplete() {
  const router = useRouter();
  const { clearPracticeSession } = usePracticeStore();

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
          Recitation Complete
        </ThemedText>

        <ThemedText className='mb-3 text-center text-muted-foreground'>
          You finished the strongest recall step in the flow.
        </ThemedText>

        <ThemedText className='mb-8 text-center text-sm text-muted-foreground'>
          Keep revisiting the verses that needed review. Consistent short
          sessions will make them feel natural.
        </ThemedText>

        <View className='w-full gap-3'>
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
        </View>
      </View>
    </SafeAreaView>
  );
}
