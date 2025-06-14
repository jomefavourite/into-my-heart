import { View } from 'react-native';
import React from 'react';
import ThemedText from '../ThemedText';

export default function SuggestionEmpty({ collection = false }) {
  return (
    <View className='bg-container p-7 rounded-2xl '>
      <ThemedText className=' text-center max-w-[160px] mx-auto'>
        No {collection ? 'collection' : 'verse'} suggestions yet
      </ThemedText>
    </View>
  );
}
