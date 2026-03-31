import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import AddCircleIcon from '@/components/icons/AddCircleIcon';
import ThemedText from '../ThemedText';
import { Skeleton } from '../ui/skeleton';
import { Link, useRouter } from 'expo-router';
import { Id } from '@/convex/_generated/dataModel';
import CircleIcon from '../icons/CircleIcon';
import CheckmarkCircleIcon from '../icons/CheckmarkCircleIcon';
import DeleteIcon from '../icons/DeleteIcon';
import { formatVerseDisplay } from '@/lib/utils';
import { normalizeBibleText } from '@/lib/verseText';

interface VerseCardProps {
  _id?: Id<'verses'>;
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
  noRoute?: boolean;
  collectionDelete?: boolean;
  onCollectionDeletePress?: () => void;
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
  noRoute = false,
  collectionDelete = false,
  onCollectionDeletePress,
}) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        if (canDelete || noRoute || !_id) {
          return; // Don't navigate
        }
        router.push(`/verses/${_id}`);
      }}
      className={`flex-row items-center rounded-xl bg-container px-4 py-[18px] ${containerClassName}`}
    >
      <View className='flex-1 gap-2'>
        <View className='flex-row items-center justify-between'>
          <ThemedText
            numberOfLines={1}
            ellipsizeMode='tail'
            className='text-sm font-medium'
          >
            {bookName} {chapter}:{formatVerseDisplay(verses)}
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

          {collectionDelete && (
            <TouchableOpacity className='' onPress={onCollectionDeletePress}>
              <DeleteIcon color={'#000'} />
            </TouchableOpacity>
          )}
        </View>

        <ThemedText
          numberOfLines={2}
          ellipsizeMode='tail'
          className='w-fit !overflow-hidden !text-ellipsis text-[13px] text-[#707070] dark:text-[#909090]'
        >
          {verseTexts.length > 0
            ? verseTexts.map(text => `${text.verse}. ${normalizeBibleText(text.text)} `)
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
    <View className='flex-row items-center rounded-xl bg-container px-4 py-[18px]'>
      <Skeleton />
    </View>
  );
};
