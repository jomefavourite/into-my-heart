import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AddCircleIcon from '~/assets/icons/AddCircleIcon';


interface VerseCardProps {
  reference: string;
  text: string;
  onAddPress: () => void;
  containerClassName?: string;
  referenceClassName?: string;
  textClassName?: string;
}

const VerseCard: React.FC<VerseCardProps> = ({ 
  reference, 
  text, 
  onAddPress,
  containerClassName = "",
  referenceClassName = "",
  textClassName = ""
}) => {
  return (
      <View className={`flex-row items-center py-[18px] px-4 ${containerClassName}`}>
        <View className="flex-1">
          <Text className={`font-medium mb-1 text-base leading-5 ${textClassName}`}>{text}</Text>
          <Text className={`text-gray-500 text-[15px] ${referenceClassName}`}>{reference}</Text>
        </View>
        <TouchableOpacity className="p-2" onPress={onAddPress}>
          <AddCircleIcon color={'#000'} />
        </TouchableOpacity>
      </View>
  );
};

export default VerseCard;