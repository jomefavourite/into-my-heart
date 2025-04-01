import { View, Text } from 'react-native';
import React, { memo, useCallback, useRef, useState } from 'react';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import Container from '~/components/Container';
import ThemedText from '~/components/ThemedText';
import { Button } from '~/components/ui/button';
import AddIcon from '~/assets/icons/AddIcon';
import { cn, useBottomSheetStore } from '~/lib/utils';
import UnfoldMoreIcon from '~/assets/icons/UnfoldMoreIcon';
import { useColorScheme } from '~/hooks/useColorScheme';
import ArrowLeftIcon from '~/assets/icons/ArrowLeftIcon';
import { useRouter } from 'expo-router';

export default function CreateGoal() {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const router = useRouter();

  const setStartDateBottomSheetIndex = useBottomSheetStore(
    (state) => state.setStartDateBottomSheetIndex
  );
  const setReviewFreqIndex = useBottomSheetStore(
    (state) => state.setReviewFreqIndex
  );

  const reviewFreqValue = useBottomSheetStore((state) => state.reviewFreqValue);

  return (
    <Container>
      <View className='items-center justify-between flex-row mb-7'>
        <Button size={'icon'} variant={'ghost'} onPress={() => router.back()}>
          <ArrowLeftIcon />
        </Button>

        {/* This should be centered properly, it's not currently */}
        <ThemedText size={16} variant='medium'>
          My Goals
        </ThemedText>

        <View></View>
      </View>

      <View className='flex-1'>
        <View className='gap-1 pb-3'>
          <Label nativeID='goalName'>Goal Name</Label>
          <Input
            aria-aria-labelledby='goalName'
            defaultValue=''
            placeholder='Enter goal name'
          />
        </View>

        <View className='border-1 border-[#E8E8E8] dark:border-[#E8E8E8] py-4 border-y flex-row items-center justify-between'>
          <ThemedText size={14} variant='medium'>
            Verses
          </ThemedText>
          <Button
            size={'icon'}
            className='bg-transparent'
            // onPress={() => router.push('/(tabs)/goals/create-goal')}
          >
            <AddIcon stroke='white' />
          </Button>
        </View>

        <View className='border-b border-[#E8E8E8] dark:border-[#E8E8E8] py-4 flex-row gap-5'>
          <View className='flex-1'>
            <ThemedText size={14} variant='medium'>
              Start date
            </ThemedText>
            <Button onPress={() => setStartDateBottomSheetIndex(1)}>
              <ThemedText>hello</ThemedText>
            </Button>
          </View>
          <View className='flex-1'>
            <ThemedText size={14} variant='medium'>
              End date
            </ThemedText>
            <Button onPress={() => setStartDateBottomSheetIndex(1)}>
              <ThemedText>hello</ThemedText>
            </Button>
          </View>
        </View>

        <View className='border-b border-[#E8E8E8] flex-row items-center justify-between dark:border-[#E8E8E8] py-4'>
          <ThemedText size={14} variant='medium'>
            Review Frequency
          </ThemedText>

          <Button
            variant={'ghost'}
            className='w-fit flex-row gap-2 items-center'
            onPress={() => setReviewFreqIndex(1)}
          >
            <ThemedText>{reviewFreqValue}</ThemedText>
            <UnfoldMoreIcon />
          </Button>
        </View>
      </View>
    </Container>
  );
}
