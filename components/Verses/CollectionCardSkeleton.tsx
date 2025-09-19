import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '../ui/skeleton';

interface CollectionCardSkeletonProps {
  containerClassName?: string;
}

const CollectionCardSkeleton: React.FC<CollectionCardSkeletonProps> = ({
  containerClassName = '',
}) => {
  return (
    <View
      className={`flex-row items-center rounded-xl bg-container px-4 py-[18px] ${containerClassName}`}
    >
      <View className='flex-1 gap-2'>
        {/* Header row with collection name and icon */}
        <View className='flex-row items-center justify-between'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-6 w-6 rounded-full' />
        </View>

        {/* Verse count */}
        <Skeleton className='h-3 w-16' />

        {/* Description lines */}
        <View className='gap-1'>
          <Skeleton className='h-3 w-full' />
          <Skeleton className='h-3 w-2/3' />
        </View>

        {/* Bottom row with stats */}
        <View className='mt-2 flex-row items-center justify-between'>
          <Skeleton className='h-3 w-24' />
          <Skeleton className='h-4 w-4 rounded-full' />
        </View>
      </View>
    </View>
  );
};

export default CollectionCardSkeleton;


