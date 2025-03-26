import React, { memo, useCallback, useEffect, useRef } from 'react';
import { View, Text, Platform, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useColorScheme } from '~/hooks/useColorScheme';
import Svg, { Path } from 'react-native-svg';
import ThemedText from './ThemedText';
import { useBottomSheetStore } from '~/lib/utils';
// import { Calendar, toDateId } from '@marceloterreiro/flash-calendar';
import { FlashList } from '@shopify/flash-list';
import { Calendar, CalendarUtils } from 'react-native-calendars';
import { useNavigation } from 'expo-router';

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

const StartDateBottomSheetContent = memo(() => {
  const customHeaderProps: any = useRef();

  const setCustomHeaderNewMonth = (next = false) => {};
  const moveNext = () => {
    setCustomHeaderNewMonth(true);
  };
  const movePrevious = () => {
    setCustomHeaderNewMonth(false);
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString();

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
    <BottomSheetView>
      <Calendar />
    </BottomSheetView>
  );
});

export default function AllBottomSheet() {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const bottomSheetRef = useRef<BottomSheet>(null);

  const navigation = useNavigation();

  const streakBottomSheetIndex = useBottomSheetStore(
    (state) => state.streakBottomSheetIndex
  );
  const startDateBottomSheetIndex = useBottomSheetStore(
    (state) => state.startDateBottomSheetIndex
  );
  const setStreakBottomSheetIndex = useBottomSheetStore(
    (state) => state.setStreakBottomSheetIndex
  );
  const setStartDateBottomSheetIndex = useBottomSheetStore(
    (state) => state.setStartDateBottomSheetIndex
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
    </>
  );
}
