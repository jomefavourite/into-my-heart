import React, { memo } from 'react';
import { View, TouchableOpacity, Pressable } from 'react-native';
import ThemedText from '../ThemedText';
import { Skeleton } from '../ui/skeleton';
import { useRouter } from 'expo-router';
import { Id } from '@/convex/_generated/dataModel';
import DeleteIcon from '../icons/DeleteIcon';
import CircleIcon from '../icons/CircleIcon';
import CheckmarkCircleIcon from '../icons/CheckmarkCircleIcon';

interface AffirmationCardProps {
  _id: Id<'affirmations'>;
  content: string;
  onDeletePress?: () => void;
  containerClassName?: string;
  canDelete?: boolean;
  noRoute?: boolean;
  isSelectedForDelete?: boolean;
}

const AffirmationCard: React.FC<AffirmationCardProps> = ({
  _id,
  content = '',
  onDeletePress,
  containerClassName = '',
  canDelete = false,
  noRoute = false,
  isSelectedForDelete = false,
}) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        if (canDelete || noRoute || !_id) {
          if (canDelete && onDeletePress) {
            onDeletePress();
          }
          return; // Don't navigate
        }
        router.push(`/verses/create-affirmation?affirmationId=${_id}`);
      }}
      className={`flex-row items-start rounded-xl bg-container px-4 py-[18px] ${containerClassName}`}
    >
      <View className='flex-1 gap-2'>
        <ThemedText
          numberOfLines={10}
          ellipsizeMode='tail'
          className='text-sm leading-6'
        >
          {content || '...'}
        </ThemedText>
      </View>

      {canDelete && (
        <TouchableOpacity className='ml-2 p-2' onPress={onDeletePress}>
          {isSelectedForDelete ? (
            <CheckmarkCircleIcon />
          ) : (
            <CircleIcon color={'#000'} />
          )}
        </TouchableOpacity>
      )}
    </Pressable>
  );
};

export default memo(AffirmationCard);

export const AffirmationCardSkeleton = () => {
  return (
    <View className='flex-row items-center rounded-xl bg-container px-4 py-[18px]'>
      <Skeleton />
    </View>
  );
};
