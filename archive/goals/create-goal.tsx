import { View, Text } from 'react-native';
import React, { memo, useCallback, useRef, useState } from 'react';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import Container from '~/components/Container';
import ThemedText from '~/components/ThemedText';
import { Button } from '~/components/ui/button';
import AddIcon from '~/components/icons/AddIcon';
import { cn, useBottomSheetStore } from '~/lib/utils';
import UnfoldMoreIcon from '~/components/icons/UnfoldMoreIcon';
import { useColorScheme } from '~/hooks/useColorScheme';
import ArrowLeftIcon from '~/components/icons/ArrowLeftIcon';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '~/components/BackHeader';
import CustomButton from '~/components/CustomButton';
import CustomBottomSheet from '~/components/CustomBottomSheet';
import {
  CustomRadioButton,
  ReviewFreqContent,
  StartDateBottomSheetContent,
} from '~/components/AllBottomSheet';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { RadioGroup } from '@rn-primitives/dropdown-menu';
import { Calendar } from 'react-native-calendars';

import ArrowRightIcon from '~/components/icons/ArrowRightIcon';
import CustomCalendar from '~/components/CustomCalendar';

export default function CreateGoal() {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const startDateBottomSheetRef = useRef<BottomSheet>(null);
  const endDateBottomSheetRef = useRef<BottomSheet>(null);

  // weeksList: CalendarDayMetadata[][];
  //   calendarRowMonth: string;
  //   weekDaysList: string[];

  const [reviewFreqValue, setReviewFreqValue] = useState('Daily');

  // const [selectedDate, setSelectedDate] = useState();
  const [startDate, setStartDate] = useState<string | null>(null);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());

  const handleReviewFreqChange = useCallback(
    (index: string) => {
      setReviewFreqValue(index);
    },
    [setReviewFreqValue]
  );

  // const handlePreviousMonth = useCallback(() => {
  //   setCurrentCalendarMonth(sub(currentCalendarMonth, { months: 1 }));
  // }, [currentCalendarMonth]);

  // const handleNextMonth = useCallback(() => {
  //   setCurrentCalendarMonth(add(currentCalendarMonth, { months: 1 }));
  // }, [currentCalendarMonth]);

  return (
    <>
      <SafeAreaView className='flex-1'>
        <BackHeader
          title='Create Goal'
          items={[{ label: 'Verses', href: '/verses' }]}
        />

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
              onPress={() => router.push('/add-book')}
            >
              <AddIcon stroke='white' />
            </Button>
          </View>

          <View className='p-[18px] border-b border-[#E8E8E8] dark:border-[#E8E8E8] py-4 flex-row gap-5'>
            <View className='flex-1'>
              <ThemedText size={14} variant='medium'>
                Start date
              </ThemedText>
              <Button
                variant={'secondary'}
                className='bg-[#FCFCFC]'
                onPress={() => startDateBottomSheetRef?.current?.expand()}
              >
                {startDate ? (
                  <ThemedText>{startDate}</ThemedText>
                ) : (
                  <ThemedText size={14} className='text-[#707070]'>
                    Set Date
                  </ThemedText>
                )}
              </Button>
            </View>
            <View className='flex-1'>
              <ThemedText size={14} variant='medium'>
                End date
              </ThemedText>
              <Button onPress={() => endDateBottomSheetRef?.current?.expand()}>
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
              onPress={() => bottomSheetRef?.current?.expand()}
            >
              <ThemedText>{reviewFreqValue}</ThemedText>
              <UnfoldMoreIcon />
            </Button>
          </View>

          <CustomButton className='mt-8'>Create goal</CustomButton>
        </View>

        {/* BottomSheet */}
        <CustomBottomSheet ref={bottomSheetRef} index={-1} snapPoints={['20%']}>
          <BottomSheetView className='flex-1 py-4'>
            <RadioGroup
              value={reviewFreqValue}
              onValueChange={handleReviewFreqChange}
              className='gap-0'
            >
              <CustomRadioButton
                label='Daily'
                value='sDaily'
                isActive={reviewFreqValue === 'Daily'}
                onPress={() => {
                  bottomSheetRef?.current?.close();
                  setReviewFreqValue('Daily');
                }}
              />
              <CustomRadioButton
                label='Weekly'
                value='Weekly'
                isActive={reviewFreqValue === 'Weekly'}
                onPress={() => {
                  bottomSheetRef?.current?.close();
                  setReviewFreqValue('Weekly');
                }}
              />
              <CustomRadioButton
                label='Every other day'
                value='Every other day'
                isActive={reviewFreqValue === 'Every other day'}
                onPress={() => {
                  bottomSheetRef?.current?.close();
                  setReviewFreqValue('Every other day');
                }}
              />
            </RadioGroup>
          </BottomSheetView>
        </CustomBottomSheet>

        <CustomBottomSheet
          ref={startDateBottomSheetRef}
          index={-1}
          snapPoints={['50%']}
        >
          <BottomSheetView className='flex-1 px-4'>
            <CustomCalendar
              selectedDate={startDate}
              setSelectedDate={setStartDate}
            />
          </BottomSheetView>
        </CustomBottomSheet>

        <CustomBottomSheet
          ref={endDateBottomSheetRef}
          index={-1}
          snapPoints={['50%']}
        >
          <StartDateBottomSheetContent />
        </CustomBottomSheet>
      </SafeAreaView>
    </>
  );
}
