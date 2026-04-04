import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedText from '@/components/ThemedText';
import { usePracticeCompletion } from '@/hooks/usePracticeCompletion';
import type { PracticeMethod } from '@/lib/offline-sync';

export type MemorizePracticeCompleteScreenProps = {
  method: PracticeMethod;
  title: string;
  bodyPrimary: string;
  bodySecondary: string;
  children: React.ReactNode;
};

export function MemorizePracticeCompleteScreen({
  method,
  title,
  bodyPrimary,
  bodySecondary,
  children,
}: MemorizePracticeCompleteScreenProps) {
  usePracticeCompletion(method);

  return (
    <SafeAreaView className='flex-1 items-center justify-center p-6'>
      <View className='w-full max-w-md items-center rounded-3xl bg-container p-6'>
        <ThemedText
          size={27}
          variant='bold'
          className='mb-4 text-center text-foreground'
        >
          {title}
        </ThemedText>

        <ThemedText className='mb-3 text-center text-muted-foreground'>
          {bodyPrimary}
        </ThemedText>

        <ThemedText className='mb-8 text-center text-sm text-muted-foreground'>
          {bodySecondary}
        </ThemedText>

        <View className='w-full gap-3'>{children}</View>
      </View>
    </SafeAreaView>
  );
}
