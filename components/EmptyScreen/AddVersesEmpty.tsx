import { View } from 'react-native';
import React from 'react';
import ThemedText from '../ThemedText';
import CustomButton from '../CustomButton';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import { useRouter } from 'expo-router';
import { useIsCollOrVerse } from '@/store/tab-store';
import { useBookStore } from '@/store/bookStore';

export default function AddVersesEmpty({ collection = false }) {
  const router = useRouter();
  const { setIsCollOrVerse } = useIsCollOrVerse();
  const { setVerses } = useBookStore();

  return (
    <View className='bg-container p-7 rounded-2xl '>
      <ThemedText
        // variant='medium'
        className=' text-center max-w-[160px] mx-auto'
      >
        Start hiding {"God's"} Word in your heart
      </ThemedText>
      <CustomButton
        variant='ghost'
        rightIcon
        Icon={ArrowRightIcon}
        className='mt-3'
        onPress={() => {
          setIsCollOrVerse(collection ? 'collections' : 'verses');
          setVerses([]); // Clear any existing verses before starting new selection
          router.push('/verses/select-book');
        }}
      >
        Add Verse
      </CustomButton>
    </View>
  );
}
