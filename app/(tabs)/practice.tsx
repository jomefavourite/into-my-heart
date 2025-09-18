import { View } from 'react-native';
import React from 'react';
import ThemedText from '@/components/ThemedText';
import CustomButton from '@/components/CustomButton';
import { Link } from 'expo-router';
import FillInBlanksIcon from '@/components/icons/practice/FillInBlanksIcon';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import FlashCardIcon1 from '@/components/icons/practice/FlashCardIcon1';
import RecitationIcon from '@/components/icons/practice/RecitationIcon';

export default function PracticeScreen() {
  return (
    <SafeAreaView className='flex-1'>
      <View className='p-[18]'>
        <ThemedText size={22} variant='semibold'>
          Practice
        </ThemedText>
      </View>

      <ScrollView className=''>
        <View className='mx-auto my-[76] max-w-[192px] px-[18px] md:mx-0 md:my-2 md:max-w-full md:flex-row md:items-start md:justify-between'>
          <View>
            <ThemedText
              size={18}
              variant='medium'
              className='text-center md:text-left'
            >
              All Verses Mode
            </ThemedText>
            <ThemedText
              size={14}
              className='mt-1 text-center text-[#707070] dark:text-[#909090] md:text-left'
            >
              Practice every verse you've added all in one session
            </ThemedText>
          </View>

          <CustomButton size='lg' className='mt-4 text-center md:mt-0'>
            Practice All
          </CustomButton>
        </View>

        <View className='px-[18px] md:mt-6'>
          <ThemedText variant='semibold'>Practice Techniques</ThemedText>

          <View className='mt-2 gap-3'>
            <Link href='/practice/flashcards'>
              <View className='w-full flex-row items-center justify-between rounded-lg border border-[#E8E8E8] px-4 py-2 web:p-6 dark:border-[#E8E8E8]'>
                <ThemedText variant='medium'>Flashcards</ThemedText>
                <FlashCardIcon1
                  // width={24}
                  // height={24}
                  className='bottom-0 right-0 web:absolute'
                />
              </View>
            </Link>

            <Link href='/practice/fill-in-blanks'>
              <View className='w-full flex-row items-center justify-between rounded-lg border border-[#E8E8E8] px-4 py-2 web:p-6 dark:border-[#E8E8E8]'>
                <ThemedText variant='medium'>Fill-in-the-blanks</ThemedText>
                <FillInBlanksIcon className='bottom-0 right-0 web:absolute' />
              </View>
            </Link>

            <View className='w-full cursor-not-allowed flex-row items-center justify-between rounded-lg border border-[#E8E8E8] px-4 py-2 opacity-50 web:p-6 dark:border-[#E8E8E8]'>
              <ThemedText variant='medium'>Recitation</ThemedText>
              <RecitationIcon className='bottom-0 right-0 web:absolute' />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
