import { View, Text } from 'react-native';
import React from 'react';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import Container from '~/components/Container';
import ThemedText from '~/components/ThemedText';
import { Button } from '~/components/ui/button';
import AddIcon from '~/assets/icons/AddIcon';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useBottomSheetStore } from '~/lib/utils';

export default function CreateGoal() {
  const setStartDateBottomSheetIndex = useBottomSheetStore(
    (state) => state.setStartDateBottomSheetIndex
  );

  return (
    <View className='flex-1 p-4'>
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

      <View className='border-b border-[#E8E8E8] dark:border-[#E8E8E8] py-4'>
        <ThemedText size={14} variant='medium'>
          Review Frequency
        </ThemedText>
      </View>
    </View>
  );
}
