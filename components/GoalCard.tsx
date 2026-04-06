import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import ThemedText from './ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import Svg, { Path } from 'react-native-svg';
import { Button } from './ui/button';
import { Link } from 'expo-router';

type GoalCardProps = {
  view?: 'list' | 'grid';
  checkMark?: boolean;
  goalCompleted?: boolean;
  isPractice?: boolean;
};

export default function GoalCard({
  view = 'list',
  checkMark = false,
  goalCompleted = false,
  isPractice = false,
}: GoalCardProps) {
  const { isDarkMode } = useColorScheme();

  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (goalCompleted) setIsChecked(true);
  }, [goalCompleted]);

  const itemClassName = view === 'grid' ? 'w-[49%]' : ' ';

  return (
    <Link href='/verses'>
      <View className={cn('gap-1 rounded-lg bg-container p-4', itemClassName)}>
        <View className='flex-row items-center justify-between'>
          <ThemedText className='text-sm font-medium' numberOfLines={2}>
            Enter goal name
          </ThemedText>

          {(checkMark || goalCompleted) && (
            <Button
              size={'icon'}
              variant={'ghost'}
              disabled={goalCompleted}
              onPress={() => setIsChecked(!isChecked)}
            >
              <Svg width={24} height={24} fill='none'>
                <Path
                  stroke={isDarkMode ? '#fff' : '#303030'}
                  fill={
                    !isChecked ? 'transparent' : isDarkMode ? '#fff' : '#303030'
                  }
                  strokeWidth={1.5}
                  d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10 10-4.477 10-10Z'
                />
                {isChecked && (
                  <Path
                    stroke={isDarkMode ? '#303030' : '#fff'}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='m8 12.5 2.5 2.5L16 9'
                  />
                )}
              </Svg>
            </Button>
          )}
        </View>
        <View className='flex-row justify-between'>
          {isPractice ? (
            <ThemedText
              size={12}
              className='text-[#707070] dark:text-[#909090]'
            >
              1 verse
            </ThemedText>
          ) : (
            <>
              <ThemedText
                size={12}
                className='text-[#707070] dark:text-[#909090]'
              >
                Daily
              </ThemedText>
              <ThemedText
                size={12}
                className='text-[#707070] dark:text-[#909090]'
              >
                {goalCompleted ? 'Completed' : 'Due 17 Jan'}
              </ThemedText>
            </>
          )}
        </View>
      </View>
    </Link>
  );
}
