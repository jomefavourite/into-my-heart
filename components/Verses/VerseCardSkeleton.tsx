import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '../ui/skeleton';

interface VerseCardSkeletonProps {
  containerClassName?: string;
}

const VerseCardSkeleton: React.FC<VerseCardSkeletonProps> = ({
  containerClassName = '',
}) => {
  return (
    <View
      className={`flex-row items-center rounded-xl bg-container px-4 py-[18px] ${containerClassName}`}
    >
      <View className='flex-1 gap-2'>
        {/* Header row with title and icon */}
        <View className='flex-row items-center justify-between'>
          <Skeleton className='h-4 w-24' />
          {/* <Skeleton className='h-6 w-6 rounded-full' /> */}
        </View>

        {/* Verse text lines */}
        <View className='gap-1'>
          <Skeleton className='h-3 w-full' />
          <Skeleton className='h-3 w-3/4' />
        </View>
      </View>
    </View>
  );
};

export default VerseCardSkeleton;
