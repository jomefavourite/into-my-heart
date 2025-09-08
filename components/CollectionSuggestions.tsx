import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

interface CollectionSuggestion {
  _id: string;
  bookName: string;
  chapter: number;
  verses: string[];
  verseTexts: Array<{
    verse: string;
    text: string;
  }>;
  reviewFreq: string;
  userId: string;
}

export function CollectionSuggestions() {
  const collectionSuggestions =
    useQuery(api.collectionSuggestions.getCollectionsSuggestion) ?? [];

  const renderCollectionSuggestion = (suggestion: CollectionSuggestion) => (
    <View
      key={suggestion._id}
      className='bg-white rounded-lg p-4 mb-3 shadow-sm'
    >
      <View className='mb-2'>
        <Text className='text-lg font-semibold text-gray-900'>
          {suggestion.bookName} {suggestion.chapter}:
          {suggestion.verses.join(', ')}
        </Text>
        <Text className='text-sm text-gray-500 mb-2'>
          Review Frequency: {suggestion.reviewFreq}
        </Text>
      </View>

      <View className='space-y-2'>
        {suggestion.verseTexts.map((verse, index) => (
          <View key={index} className='bg-gray-50 p-3 rounded-md'>
            <Text className='text-sm font-medium text-gray-700 mb-1'>
              Verse {verse.verse}:
            </Text>
            <Text className='text-sm text-gray-600'>{verse.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView className='flex-1 bg-gray-50'>
      <View className='p-4'>
        <Text className='text-2xl font-bold text-gray-900 mb-4'>
          Collection Suggestions
        </Text>
        <Text className='text-sm text-gray-600 mb-4'>
          Discover curated collections of Bible verses for your memorization
          journey.
        </Text>

        {collectionSuggestions.length > 0 ? (
          collectionSuggestions.map(renderCollectionSuggestion)
        ) : (
          <View className='bg-white rounded-lg p-6 items-center'>
            <Text className='text-gray-500 text-center'>
              No collection suggestions available at the moment.
            </Text>
            <Text className='text-gray-400 text-center text-sm mt-2'>
              Check back later for new suggestions!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
