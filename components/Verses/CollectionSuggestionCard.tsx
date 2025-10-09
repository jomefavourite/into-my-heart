import React, { memo, useState } from 'react';
import { View, TouchableOpacity, Pressable } from 'react-native';
import AddCircleIcon from '@/components/icons/AddCircleIcon';
import ThemedText from '../ThemedText';
import { Id } from '@/convex/_generated/dataModel';
import VerseCard from './VerseCard';
import ItemSeparator from '../ItemSeparator';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import ChevronUpIcon from '../icons/ChevronUpIcon';

interface CollectionSuggestionCardProps {
  _id: Id<'collectionSuggestions'>;
  collectionName: string;
  versesLength?: number;
  collectionVerses?: Array<{
    bookName: string;
    chapter: number;
    verses: string[];
    reviewFreq: string;
    verseTexts: Array<{
      verse: string;
      text: string;
    }>;
  }>;
  containerClassName?: string;
  onAddPress?: () => void;
  canCheck?: boolean;
}

const CollectionSuggestionCard: React.FC<CollectionSuggestionCardProps> = ({
  _id,
  collectionName = 'Genesis',
  versesLength = 0,
  collectionVerses = [],
  containerClassName = '',
  onAddPress = () => {},
  canCheck = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardPress = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAddPress = () => {
    onAddPress();
  };

  return (
    <View className={`rounded-xl bg-container ${containerClassName}`}>
      <Pressable
        onPress={handleCardPress}
        className='flex-row items-center px-4 py-[18px]'
      >
        <View className='flex-1 gap-2'>
          <View className='flex-row items-center justify-between'>
            <ThemedText
              numberOfLines={1}
              ellipsizeMode='tail'
              size={14}
              variant='medium'
            >
              {collectionName}
            </ThemedText>

            <View className='flex-row items-center gap-2'>
              {canCheck && (
                <TouchableOpacity className='p-2' onPress={handleAddPress}>
                  <AddCircleIcon color={'#000'} />
                </TouchableOpacity>
              )}

              <TouchableOpacity className='p-1' onPress={handleCardPress}>
                {isExpanded ? (
                  <ChevronUpIcon color={'#707070'} />
                ) : (
                  <ChevronDownIcon color={'#707070'} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <ThemedText
            numberOfLines={2}
            ellipsizeMode='tail'
            size={13}
            className='w-fit !overflow-hidden !text-ellipsis text-[13px] text-[#707070] dark:text-[#909090]'
          >
            {versesLength > 0
              ? `${versesLength} verse${versesLength > 1 ? 's' : ''}`
              : 'No verses added yet.'}
          </ThemedText>
        </View>
      </Pressable>

      {/* Expanded verses section */}
      {isExpanded && collectionVerses.length > 0 && (
        <View className='px-4 pb-4'>
          <View className='mt-2'>
            <ThemedText className='mb-2 text-xs text-[#707070] dark:text-[#909090]'>
              Verses in this collection:
            </ThemedText>
            {collectionVerses.map((verse, index) => (
              <View key={index}>
                <VerseCard
                  bookName={verse.bookName}
                  chapter={verse.chapter}
                  verses={verse.verses}
                  verseTexts={verse.verseTexts}
                  containerClassName=''
                  canCheck={false}
                  noRoute={true}
                />
                {index < collectionVerses.length - 1 && <ItemSeparator />}
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default memo(CollectionSuggestionCard);
