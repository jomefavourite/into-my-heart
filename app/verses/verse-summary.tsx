import { View, Text } from 'react-native';
import React from 'react';
import ThemedText from '~/components/ThemedText';
import BackHeader from '~/components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/button';
import ArrowRightIcon from '~/components/icons/ArrowRightIcon';
import CustomButton from '~/components/CustomButton';
import { useRouter } from 'expo-router';

export default function VerseSummary() {
  const router = useRouter();
  return (
    <SafeAreaView>
      <BackHeader
        title='Add Verse'
        items={[
          { label: 'Verses', href: '/verses' },
          { label: 'Select Verse', href: '/verses/select-verses' },
          { label: 'Verse Summary', href: '/verses/verse-summary' },
        ]}
      />

      <View className='px-[18]'>
        <View className='flex-row items-center justify-between w-full'>
          <ThemedText size={14}>Book</ThemedText>
          <Button
            variant={'ghost'}
            className='flex-row items-center text-sm'
            onPress={() => router.push('/verses/select-book')}
          >
            <ThemedText size={14}>Genesis 1</ThemedText>
            <ArrowRightIcon />
          </Button>
        </View>
        <View className='flex-row items-center justify-between w-full'>
          <ThemedText size={14}>Verses</ThemedText>
          <Button
            variant={'ghost'}
            className='flex-row items-center text-sm'
            onPress={() => router.push('/verses/select-verses')}
          >
            <ThemedText size={14}>1</ThemedText>
            <ArrowRightIcon />
          </Button>
        </View>
        <View className='flex-row items-center justify-between w-full'>
          <ThemedText size={14}>Bible translation</ThemedText>
          <Button
            variant={'ghost'}
            className='flex-row items-center text-sm'
            disabled
          >
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
