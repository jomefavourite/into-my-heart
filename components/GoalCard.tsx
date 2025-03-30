import { View, Text } from 'react-native';
import React from 'react';
import { cn } from '~/lib/utils';
import ThemedText from './ThemedText';

export default function GoalCard({ view }: { view: 'list' | 'grid' }) {
  const itemClassName = view === 'grid' ? 'w-[49%]' : ' ';

  return (
    <View className={cn('bg-container p-4 rounded-lg gap-1', itemClassName)}>
      <ThemedText size={14} variant='medium'>
        Enter goal name
      </ThemedText>
      <View className='flex-row justify-between'>
        <ThemedText size={12} className='text-[#707070] dark:text-[#909090]'>
          Daily
        </ThemedText>
        <ThemedText size={12} className='text-[#707070] dark:text-[#909090]'>
          Due 17 Jan
        </ThemedText>
      </View>
    </View>
  );
}
