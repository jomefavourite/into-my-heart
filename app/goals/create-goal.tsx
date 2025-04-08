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
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '~/components/BackHeader';
import CustomButton from '~/components/CustomButton';

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
    <SafeAreaView>
      <BackHeader title='Create Goal' />

      <View className=' '>
        <View className='gap-1 pb-3 p-[18px]'>
          <Label nativeID='goalName'>Goal Name</Label>
          <Input
            aria-aria-labelledby='goalName'
            defaultValue=''
            placeholder='Enter goal name'
            className='dark:text-white'
          />
        </View>

        <View className='p-[18px] border-1 border-[#E8E8E8] dark:border-[#E8E8E8] py-4 border-y flex-row items-center justify-between'>
          <ThemedText size={14} variant='medium'>
            Verses
          </ThemedText>
          <Button
            size={'icon'}
            className='bg-transparent'
            onPress={() => router.push('/(verses)/add-book')}
          >
            <AddIcon stroke='white' />
          </Button>
        </View>

        <View className='p-[18px] border-b border-[#E8E8E8] dark:border-[#E8E8E8] py-4 flex-row gap-5'>
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

        <View className='p-[18px] border-b border-[#E8E8E8] flex-row items-center justify-between dark:border-[#E8E8E8] py-4'>
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

        <CustomButton className='mt-8'>Create goal</CustomButton>
      </View>
    </SafeAreaView>
  );
}
