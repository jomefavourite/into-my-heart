import React from 'react';
import { View, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import ThemedText from '@/components/ThemedText';
import { Button } from '@/components/ui/button';
import { cn, ONBOARDING_DATA } from '@/lib/utils';
import CancelIcon from '@/components/icons/CancelIcon';

interface OnboardingProps {
  stepNumber: number;
  onNext?: () => void;
  onPrevious?: () => void;
  onStepChange?: (step: number) => void;
}

export default function Onboarding({
  stepNumber,
  onNext,
  onStepChange,
}: OnboardingProps) {
  const router = useRouter();
  const stepData = ONBOARDING_DATA[stepNumber];

  return (
    <>
      <View className='flex-row items-center justify-between'>
        <View className='flex flex-row gap-1'>
          <Pressable
            onPress={() => onStepChange?.(1)}
            className={cn(
              'h-[5px] w-10 rounded-full bg-[#E8E8E8] dark:bg-[#E8E8E8]/15',
              stepNumber == 1 && 'bg-black dark:bg-white'
            )}
          ></Pressable>
          <Pressable
            onPress={() => onStepChange?.(2)}
            className={cn(
              'h-[5px] w-10 rounded-full bg-[#E8E8E8] dark:bg-[#E8E8E8]/15',
              stepNumber == 2 && 'bg-black dark:bg-white'
            )}
          ></Pressable>
          <Pressable
            onPress={() => onStepChange?.(3)}
            className={cn(
              'h-[5px] w-10 rounded-full bg-[#E8E8E8] dark:bg-[#E8E8E8]/15',
              stepNumber == 3 && 'bg-black dark:bg-white'
            )}
          ></Pressable>
        </View>

        <Button variant={'ghost'} size='icon' className='w-fit'>
          <Link href={'/(onboarding)/onboard'}>
            <CancelIcon />
          </Link>
        </Button>
      </View>

      <View className='items-center justify-center'>
        {stepData.Icon && <stepData.Icon />}
      </View>

      <View>
        <View className='mb-20'>
          <ThemedText className='text-black dark:text-white'>
            {stepData.title}
          </ThemedText>

          <ThemedText className='text-[#707070]'>{stepData.subtile}</ThemedText>
        </View>

        <View className='flex-row gap-3'>
          <CustomButton
            onPress={
              stepNumber < 3
                ? onNext
                : () => router.push('/(onboarding)/onboard')
            }
            className='flex-1'
          >
            {stepData.btnText}
          </CustomButton>
        </View>
      </View>
    </>
  );
}
