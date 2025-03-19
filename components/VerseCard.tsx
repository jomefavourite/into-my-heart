import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import PlusIcon from '../assets/icons/light=add-circle.svg'


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
      <View className={`flex-row items-center py-3 border-b border-gray-100 ${containerClassName}`}>
        <View className="flex-1">
          <Text className={`font-medium mb-1 ${referenceClassName}`}>{reference}</Text>
          <Text className={`text-gray-600 ${textClassName}`}>{text}</Text>
        </View>
        <TouchableOpacity className="p-2" onPress={onAddPress}>
          <PlusIcon />
        </TouchableOpacity>
      </View>
  );
};

export default VerseCard;