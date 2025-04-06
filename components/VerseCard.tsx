import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AddCircleIcon from '~/assets/icons/AddCircleIcon';
import ThemedText from './ThemedText';
import { cn } from '~/lib/utils';


interface VerseCardProps {
  reference: string;
  text: string;
  onAddPress: () => void;
  containerClassName?: string;
  referenceClassName?: string;
  textClassName?: string;
  view?: 'list' | 'grid';
}

const VerseCard: React.FC<VerseCardProps> = ({ 
  reference, 
  text, 
  onAddPress,
  containerClassName = "",
  referenceClassName = "",
  textClassName = "",
  view = 'list',
}) => {
  const itemClassName = view === 'grid' ? 'flex-col-reverse items-start' : ' ';
  referenceClassName = view === 'grid' ? 'truncate' : ' ';

  return (
      <View className={cn('flex-row items-center py-[18px] px-4', containerClassName, itemClassName)}>
        <View className="flex-1">
          <ThemedText size={12} className={`font-medium my-2 text-base leading-5 ${textClassName}`}>{text}</ThemedText>
          <ThemedText size={14} className={cn('text-[#707070] dark:text-[#b3b3b3]', referenceClassName)}>{reference}</ThemedText>
        </View>
        <TouchableOpacity onPress={onAddPress}>
          <AddCircleIcon color={'#000'} />
        </TouchableOpacity>
      </View>
  );
};

export default VerseCard;