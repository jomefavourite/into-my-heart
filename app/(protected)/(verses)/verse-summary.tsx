import { View, Text } from 'react-native';
import React from 'react';
import ThemedText from '~/components/ThemedText';
import BackHeader from '~/components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/button';
import ArrowRightIcon from '~/assets/icons/ArrowRightIcon';
import CustomButton from '~/components/CustomButton';

export default function VerseSummary() {
  return (
    <SafeAreaView>
      <BackHeader
        title='Add Verse'
        items={[{ label: 'Verses', href: '/verses' }]}
      />

      <View className='px-[18]'>
        <View className='flex-row items-center justify-between w-full'>
          <ThemedText size={14}>Book</ThemedText>
          <Button variant={'ghost'} className='flex-row items-center text-sm'>
            <ThemedText size={14}>Genesis</ThemedText>
            <ArrowRightIcon />
          </Button>
        </View>
        <View className='flex-row items-center justify-between w-full'>
          <ThemedText size={14}>Verses</ThemedText>
          <Button variant={'ghost'} className='flex-row items-center text-sm'>
            <ThemedText size={14}>1</ThemedText>
            <ArrowRightIcon />
          </Button>
        </View>
        <View className='flex-row items-center justify-between w-full'>
          <ThemedText size={14}>Bible translation</ThemedText>
          <Button variant={'ghost'} className='flex-row items-center text-sm'>
            <ThemedText size={14}>KJV</ThemedText>
          </Button>
        </View>
        <View className='flex-row items-center justify-between w-full'>
          <ThemedText size={14}>Review Frequency</ThemedText>
          <Button variant={'ghost'} className='flex-row items-center text-sm'>
            <ThemedText size={14}>KJV</ThemedText>
          </Button>
        </View>

        <CustomButton>Add verse</CustomButton>
      </View>
    </SafeAreaView>
  );
}
