import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '~/components/CustomButton';
import Container from '~/components/Container';
import { ThemedText } from '~/components/ThemedText';
import OnboardIcon1 from '~/assets/icons/onboarding/onboarding-1.svg';

export default function OnboardingStep1() {
  const router = useRouter();

  return (
    <Container>
      <View className='flex flex-row gap-1'>
        <View className='h-[5px] bg-black w-10 rounded-full'></View>
        <View className='h-[5px] bg-[#E8E8E8] w-10 rounded-full'></View>
        <View className='h-[5px] bg-[#E8E8E8] w-10 rounded-full'></View>
      </View>

      <View className='justify-center items-center'>
        <OnboardIcon1 className='' />
      </View>

      <View>
        <View className='mb-20'>
          <ThemedText
            type='subtitle'
            className='text-lg font-medium text-black dark:text-white'
          >
            God's Word Hidden in Your Heart.
          </ThemedText>

          <ThemedText className='text-[#707070]'>
            Build a habit of hiding God's Word in your heart with interactive
            tools designed to help you remember and apply scripture.
          </ThemedText>
        </View>

        <CustomButton onPress={() => router.push('/(onboarding)/step2')}>
          Next
        </CustomButton>
      </View>
    </Container>
  );
}
