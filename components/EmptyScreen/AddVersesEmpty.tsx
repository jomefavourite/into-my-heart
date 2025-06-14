import { View, Text } from 'react-native';
import React from 'react';
import ThemedText from '../ThemedText';
import CustomButton from '../CustomButton';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import { useRouter } from 'expo-router';

export default function AddVersesEmpty() {
  const router = useRouter();

  return (
    <View className='bg-container p-7 rounded-2xl '>
      <ThemedText
        // variant='medium'
        className=' text-center max-w-[160px] mx-auto'
      >
        Start hiding God's Word in your heart
      </ThemedText>
      <CustomButton
        variant='ghost'
        rightIcon
        Icon={ArrowRightIcon}
        className='mt-3'
        onPress={() => router.push('/verses/select-book')}
      >
        Add verse
      </CustomButton>
    </View>
  );
}
