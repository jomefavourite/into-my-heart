import { View, Text } from 'react-native';
import React from 'react';
import Container from '~/components/Container';
import ThemedText from '~/components/ThemedText';
import CustomButton from '~/components/CustomButton';
import { Link } from 'expo-router';
import FillInBlanksIcon from '~/assets/icons/practice/FillInBlanksIcon';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PracticeScreen() {
  return (
    <SafeAreaView className='flex-1'>
      <View className='p-[18]'>
        <ThemedText size={22} variant='semibold'>
          Practice
        </ThemedText>
      </View>

      <ScrollView className=' p-[18px]'>
        <View className='my-[76] max-w-[192px] mx-auto text-center'>
          <ThemedText size={18} variant='medium' className='text-center'>
            All Verses Mode
          </ThemedText>
          <ThemedText
            size={14}
            className='text-center text-[#707070] dark:text-[#909090] mt-1'
          >
            Practice every verse you've added all in one session
          </ThemedText>
          <CustomButton className='mt-4 text-center'>Practice</CustomButton>
        </View>

        <View>
          <ThemedText variant='semibold'>Practice Techniques</ThemedText>

          <View className='gap-3 mt-2'>
            <Link href='/practice/fill-in-blanks'>
              <View className='flex-row justify-between items-center w-full px-4 py-2 web:p-6 border border-[#E8E8E8] dark:border-[#E8E8E8] rounded-lg my-2'>
                <ThemedText variant='medium'>Fill-in-the-blanks</ThemedText>
                <FillInBlanksIcon className='web:absolute right-0 bottom-0' />
              </View>
            </Link>

            <Link href='/practice/recitation'>
              <View className='flex-row justify-between items-center w-full px-4 py-2 web:p-6 border border-[#E8E8E8] dark:border-[#E8E8E8] rounded-lg my-2'>
                <ThemedText variant='medium'>Recitation</ThemedText>
                <FillInBlanksIcon className='web:absolute right-0 bottom-0' />
              </View>
            </Link>

            <Link href='/practice/flashcards'>
              <View className='flex-row justify-between items-center w-full px-4 py-2 web:p-6 border border-[#E8E8E8] dark:border-[#E8E8E8] rounded-lg my-2'>
                <ThemedText variant='medium'>Flashcards</ThemedText>
                <FillInBlanksIcon className='web:absolute right-0 bottom-0' />
              </View>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
