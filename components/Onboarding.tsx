import React from 'react';
import { View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import CustomButton from '~/components/CustomButton';
import ThemedText from '~/components/ThemedText';
import CloseIcon from '~/assets/icons/light=cancel-01.svg';
import { Button } from '~/components/ui/button';
import { cn, ONBOARDING_DATA } from '~/lib/utils';

export default function Onboarding({ stepNumber }: { stepNumber: number }) {
  const router = useRouter();
  const stepData = ONBOARDING_DATA[stepNumber];

  return (
    <>
      <View className='flex-row justify-between items-center'>
        <View className='flex flex-row gap-1'>
          <View
            className={cn(
              'h-[5px] bg-[#E8E8E8] w-10 rounded-full',
              stepNumber == 1 && 'bg-black dark:bg-white'
            )}
          ></View>
          <View
            className={cn(
              'h-[5px] bg-[#E8E8E8] w-10 rounded-full',
              stepNumber == 2 && 'bg-black dark:bg-white'
            )}
          ></View>
          <View
            className={cn(
              'h-[5px] bg-[#E8E8E8] w-10 rounded-full',
              stepNumber == 3 && 'bg-black dark:bg-white'
            )}
          ></View>
        </View>

        <Button variant={'ghost'} size='icon' className='w-fit'>
          <Link href={'/(onboarding)/create-account'}>
            <CloseIcon />
          </Link>
        </Button>
      </View>

      <View className='justify-center items-center'>
        {stepData.Icon && <stepData.Icon />}
      </View>

      <View>
        <View className='mb-20'>
          <ThemedText type='subtitle' className=' text-black dark:text-white'>
            {stepData.title}
          </ThemedText>

          <ThemedText className='text-[#707070]'>{stepData.subtile}</ThemedText>
        </View>

        <CustomButton onPress={() => router.push(stepData.link)}>
          {stepData.btnText}
        </CustomButton>
      </View>
    </>
  );
}
