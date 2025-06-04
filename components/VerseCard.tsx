import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AddCircleIcon from '~/components/icons/AddCircleIcon';
import ThemedText from './ThemedText';

interface VerseCardProps {
  bookName: string;
  chapter: string;
  onAddPress: () => void;
  containerClassName?: string;
  referenceClassName?: string;
  textClassName?: string;
}

const VerseCard: React.FC<VerseCardProps> = ({
  bookName = 'Genesis',
  chapter = '1',
  onAddPress,
  containerClassName = '',
  referenceClassName = '',
  textClassName = '',
}) => {
  return (
    <View
      className={`flex-row bg-container rounded-xl items-center py-[18px] px-4 ${containerClassName}`}
    >
      <View className='flex-1'>
        {/* <ThemedText
          className={`font-medium mb-1 text-base leading-5 ${textClassName}`}
        >
          {text}
        </ThemedText> */}
        {/* <ThemedText
          className={`text-gray-500 text-[15px] ${referenceClassName}`}
        >
          {reference}
        </ThemedText> */}
        <ThemedText size={14} variant='medium'>
          {bookName} {chapter}:1
        </ThemedText>

        <ThemedText
          size={13}
          className='w-fit text-[#707070] dark:text-[#909090]'
        >
          In the beginning, God created the heavens and the earth.
        </ThemedText>
      </View>

      <TouchableOpacity className='p-2' onPress={onAddPress}>
        <AddCircleIcon color={'#000'} />
      </TouchableOpacity>
    </View>
  );
};

export default VerseCard;
