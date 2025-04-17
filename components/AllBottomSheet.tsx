import React, { memo, useCallback, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  useBottomSheet,
} from '@gorhom/bottom-sheet';
import { useColorScheme } from '~/hooks/useColorScheme';
import Svg, { Path } from 'react-native-svg';
import ThemedText from './ThemedText';
import { cn, useBottomSheetStore } from '~/lib/utils';
// import { Calendar } from 'react-native-calendars';
import { RadioGroup } from '~/components/ui/radio-group';
import { Label } from './ui/label';
import CustomButton from './CustomButton';
import { Calendar, toDateId } from '@marceloterreiro/flash-calendar';
// import { useState } from "react";

const today = toDateId(new Date());

const StreakBottomSheetContent = memo(() => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <BottomSheetView className='flex-1 p-4'>
      <View className='mx-auto mt-6 mb-6'>
        <Svg width={100} height={100} fill='none'>
          <Path
            fill={isDarkMode ? '#fff' : '#313131'}
            d='M50.5 89.587c18.41 0 33.333-14.924 33.333-33.334 0-12.337-6.703-28.724-16.667-38.191l-8.333 11.101-14.583-18.75C29.666 20.83 17.166 39.98 17.166 56.253c0 18.41 14.924 33.334 33.334 33.334Z'
          />
          <Path
            fill={isDarkMode ? '#313131' : '#fff'}
            stroke={isDarkMode ? '#313131' : '#fff'}
            strokeLinejoin='round'
            strokeWidth={5}
            d='M50.5 77.08c9.205 0 16.667-8.395 16.667-18.75 0-3.296-.756-6.393-2.083-9.085l-8.334 7.001-12.5-16.67C40.084 43.741 33.834 50.46 33.834 58.33c0 10.355 7.462 18.75 16.666 18.75Z'
          />
        </Svg>
      </View>
      <ThemedText className='text-black text-center font-medium dark:text-white mb-6'>
        Every day you practice, you're strengthening your memory and hiding
        God's Word in your heart.
      </ThemedText>
    </BottomSheetView>
  );
});

export const StartDateBottomSheetContent = memo(() => {
  const customHeaderProps: any = useRef();

  const setCustomHeaderNewMonth = (next = false) => {};
  const moveNext = () => {
    setCustomHeaderNewMonth(true);
  };
  const movePrevious = () => {
    setCustomHeaderNewMonth(false);
  };

  const formattedDate = useMemo(() => new Date().toLocaleDateString(), []);

  // const today = toDateId(new Date());

  const CustomHeader = React.forwardRef((props, ref) => {
    customHeaderProps.current = props;

    return (
      // @ts-expect-error
      <View ref={ref} {...props}>
        <TouchableOpacity onPress={movePrevious}>
          <Text>Previous</Text>
        </TouchableOpacity>
        <Text>Custom header!</Text>
        <Text>{formattedDate}</Text>
        <TouchableOpacity onPress={moveNext}>
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
    );
  });

  return (
    <BottomSheetView className='flex-1 px-4'>
      {/* <Calendar /> */}

      <View className='flex-row gap-2 '>
        <CustomButton variant='outline' className='flex-1'>
          Cancel
        </CustomButton>
        <CustomButton className='flex-1'>Save</CustomButton>
      </View>
    </BottomSheetView>
  );
});

export const ReviewFreqContent = memo(() => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const { expand, close } = useBottomSheet();

  const reviewFreqValue = useBottomSheetStore((state) => state.reviewFreqValue);
  const setReviewFreqValue = useBottomSheetStore(
    (state) => state.setReviewFreqValue
  );

  const handleValueChange = useCallback(
    (newValue: string) => {
      setReviewFreqValue(newValue);
    },
    [setReviewFreqValue]
  );

  // const handleButtonValue = useCallback(
  //   (value: string) => {
  //     close();
  //     setReviewFreqValue(value);
  //   },
  //   [setReviewFreqValue]
  // );

  return (
    <BottomSheetView className='flex-1 py-4'>
      <RadioGroup
        value={reviewFreqValue}
        onValueChange={handleValueChange}
        className='gap-0'
      >
        <CustomRadioButton
          label='Daily'
          value='Daily'
          isActive={reviewFreqValue === 'Daily'}
          onPress={() => {
            close();
            setReviewFreqValue('Daily');
          }}
        />
        <CustomRadioButton
          label='Weekly'
          value='Weekly'
          isActive={reviewFreqValue === 'Weekly'}
          onPress={() => {
            close();
            setReviewFreqValue('Weekly');
          }}
        />
        <CustomRadioButton
          label='Every other day'
          value='Every other day'
          isActive={reviewFreqValue === 'Every other day'}
          onPress={() => {
            close();
            setReviewFreqValue('Every other day');
          }}
        />
      </RadioGroup>
    </BottomSheetView>
  );
});

interface CustomRadioButtonProps {
  label: string;
  value: string;
  isActive: boolean;
  onPress: () => void;
}

export const CustomRadioButton = memo(
  ({ label, value, isActive, onPress }: CustomRadioButtonProps) => {
    return (
      <Pressable
        onPress={onPress}
        className={cn('py-4 px-3 text-center', isActive ? 'bg-[#FAFAFA]' : '')}
      >
        <ThemedText
          className={cn(
            isActive ? 'text-black' : 'text-[#707070]',
            'text-base  text-center'
          )}
        >
          {label}
        </ThemedText>
      </Pressable>
    );
  }
);

const RemoveGoalBottomSheetContent = memo(() => {
  return (
    <BottomSheetView className='flex-1 p-4'>
      <View className='mt-auto'>
        <ThemedText variant='medium' className='text-center mb-2'>
          This goal will be removed
        </ThemedText>
        <ThemedText
          size={14}
          className='text-center text-[#707070] dark:text-[#909090] max-w-[288px] mx-auto'
        >
          This goal and all progress will be removed. This action cannot be
          undone.
        </ThemedText>
        <CustomButton className='mt-7'>Remove goal</CustomButton>
      </View>
    </BottomSheetView>
  );
});

export default function AllBottomSheet() {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const bottomSheetRef = useRef<BottomSheet>(null);

  const streakBottomSheetIndex = useBottomSheetStore(
    (state) => state.streakBottomSheetIndex
  );
  const startDateBottomSheetIndex = useBottomSheetStore(
    (state) => state.startDateBottomSheetIndex
  );
  const reviewFreqIndex = useBottomSheetStore((state) => state.reviewFreqIndex);
  const removeGoalIndex = useBottomSheetStore((state) => state.removeGoalIndex);
  const setRemoveGoalIndex = useBottomSheetStore(
    (state) => state.setRemoveGoalIndex
  );

  const setStreakBottomSheetIndex = useBottomSheetStore(
    (state) => state.setStreakBottomSheetIndex
  );
  const setStartDateBottomSheetIndex = useBottomSheetStore(
    (state) => state.setStartDateBottomSheetIndex
  );
  const setReviewFreqIndex = useBottomSheetStore(
    (state) => state.setReviewFreqIndex
  );

  const handleStreakBottomSheetChange = useCallback(
    (index: number) => {
      setStreakBottomSheetIndex(index);
    },
    [setStreakBottomSheetIndex]
  );

  const handleStartDateBottomSheetChange = useCallback(
    (index: number) => {
      setStartDateBottomSheetIndex(index);
    },
    [setStartDateBottomSheetIndex]
  );
  const handleReviewFreqChange = useCallback(
    (index: number) => {
      setReviewFreqIndex(index);
    },
    [setReviewFreqIndex]
  );
  const handleRemoveGoal = useCallback(
    (index: number) => {
      setRemoveGoalIndex(index);
    },
    [removeGoalIndex]
  );

  return (
    <>
      {/* Streak Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={streakBottomSheetIndex}
        snapPoints={['50%']}
        enablePanDownToClose={true}
        onChange={handleStreakBottomSheetChange}
        backgroundStyle={{
          backgroundColor: isDarkMode ? '#313131' : '#fff',
        }}
        style={{
          boxShadow: isDarkMode
            ? '0px -4px 26px rgba(0,0,0, 0.5)'
            : '0px -4px 26px rgba(0,0,0, 0.1)',
          borderRadius: 30,
        }}
      >
        <StreakBottomSheetContent />
      </BottomSheet>

      {/* Start Date Bottom Sheet */}
      <BottomSheet
        index={startDateBottomSheetIndex}
        snapPoints={['50%']}
        enablePanDownToClose={true}
        onChange={handleStartDateBottomSheetChange}
        backgroundStyle={{
          backgroundColor: isDarkMode ? '#313131' : '#fff',
        }}
        style={{
          boxShadow: isDarkMode
            ? '0px -4px 26px rgba(0,0,0, 0.5)'
            : '0px -4px 26px rgba(0,0,0, 0.1)',
          borderRadius: 30,
        }}
      >
        <StartDateBottomSheetContent />
      </BottomSheet>

      {/* Review Bottom Sheet */}
      {/* <BottomSheet
        index={reviewFreqIndex}
        snapPoints={['20%']}
        enablePanDownToClose={true}
        onChange={handleReviewFreqChange}
        backgroundStyle={{
          backgroundColor: isDarkMode ? '#313131' : '#fff',
        }}
        style={{
          boxShadow: isDarkMode
            ? '0px -4px 26px rgba(0,0,0, 0.5)'
            : '0px -4px 26px rgba(0,0,0, 0.1)',
          borderRadius: 30,
        }}
      >
        <ReviewFreqContent />
      </BottomSheet> */}

      {/* Remove Goal Bottom Sheet */}
      <BottomSheet
        index={removeGoalIndex}
        snapPoints={['25%']}
        enablePanDownToClose={true}
        onChange={handleRemoveGoal}
        backgroundStyle={{
          backgroundColor: isDarkMode ? '#313131' : '#fff',
        }}
        style={{
          boxShadow: isDarkMode
            ? '0px -4px 26px rgba(0,0,0, 0.5)'
            : '0px -4px 26px rgba(0,0,0, 0.1)',
          borderRadius: 30,
        }}
      >
        <RemoveGoalBottomSheetContent />
      </BottomSheet>
    </>
  );
}
