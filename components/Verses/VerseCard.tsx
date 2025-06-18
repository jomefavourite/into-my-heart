import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import AddCircleIcon from '~/components/icons/AddCircleIcon';
import ThemedText from '../ThemedText';
import { Skeleton } from '../ui/skeleton';
import { Link, useRouter } from 'expo-router';
import { Id } from '~/convex/_generated/dataModel';
import CircleIcon from '../icons/CircleIcon';
import CheckmarkCircleIcon from '../icons/CheckmarkCircleIcon';

interface VerseCardProps {
  _id: Id<'verses'>;
  bookName: string;
  chapter: number;
  verses?: string[];
  onAddPress?: () => void;
  onDeletePress?: () => void;
  containerClassName?: string;
  verseTexts: { verse: string; text: string }[];
  canCheck?: boolean;
  canDelete?: boolean;
  isSelectedForDelete?: boolean;
}

const VerseCard: React.FC<VerseCardProps> = ({
  _id,
  bookName = 'Genesis',
  chapter = '1',
  verses = [],
  onAddPress,
  containerClassName = '',
  verseTexts = [],
  canCheck = true,
  canDelete = false,
  onDeletePress,
  isSelectedForDelete,
}) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        canCheck || canDelete ? null : router.push(`/verses/${_id}`)
      }
      className={`flex-row bg-container rounded-xl items-center py-[18px] px-4 ${containerClassName}`}
    >
      <View className='flex-1 gap-2'>
        <View className='flex-row items-center justify-between'>
          <ThemedText
            numberOfLines={1}
            ellipsizeMode='tail'
            size={14}
            variant='medium'
          >
            {bookName} {chapter}:{verses.length > 0 ? verses.join(', ') : '1'}
          </ThemedText>

          {canDelete && (
            <TouchableOpacity className='' onPress={onDeletePress}>
              {isSelectedForDelete ? (
                <CheckmarkCircleIcon />
              ) : (
                <CircleIcon color={'#000'} />
              )}
            </TouchableOpacity>
          )}
        </View>

        <ThemedText
          numberOfLines={2}
          ellipsizeMode='tail'
          size={13}
          className='w-fit text-[#707070] dark:text-[#909090] !overflow-hidden !text-ellipsis'
        >
          {verseTexts.length > 0
            ? verseTexts.map((text, index) => `${text.verse}. ${text.text} `)
            : '...'}
        </ThemedText>
      </View>

      {canCheck && (
        <TouchableOpacity className='p-2' onPress={onAddPress}>
          <AddCircleIcon color={'#000'} />
        </TouchableOpacity>
      )}
    </Pressable>
  );
};

export default memo(VerseCard);

export const VerseCardSkeleton = () => {
  return (
    <View className='flex-row bg-container rounded-xl items-center py-[18px] px-4'>
      <Skeleton />
    </View>
  );
};
