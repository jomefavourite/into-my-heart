import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useAuth } from '@clerk/clerk-expo';

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
  const { isSignedIn, isLoaded } = useAuth();
  const collectionSuggestions =
    useQuery(
      api.collectionSuggestions.getCollectionsSuggestion,
      isSignedIn && isLoaded ? {} : 'skip'
    ) ?? [];

  const renderCollectionSuggestion = (suggestion: CollectionSuggestion) => (
    <View
      key={suggestion._id}
      className='mb-3 rounded-lg bg-white p-4 shadow-sm'
    >
      <View className='mb-2'>
        <Text className='text-lg font-semibold text-gray-900'>
          {suggestion.bookName} {suggestion.chapter}:
          {suggestion.verses.join(', ')}
        </Text>
        <Text className='mb-2 text-sm text-gray-500'>
          Review Frequency: {suggestion.reviewFreq}
        </Text>
      </View>

      <View className='space-y-2'>
        {suggestion.verseTexts.map((verse, index) => (
          <View key={index} className='rounded-md bg-gray-50 p-3'>
            <Text className='mb-1 text-sm font-medium text-gray-700'>
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
        <Text className='mb-4 text-2xl font-bold text-gray-900'>
          Collection Suggestions
        </Text>
        <Text className='mb-4 text-sm text-gray-600'>
          Discover curated collections of Bible verses for your memorization
          journey.
        </Text>

        {collectionSuggestions.length > 0 ? (
          collectionSuggestions.map(renderCollectionSuggestion)
        ) : (
          <View className='items-center rounded-lg bg-white p-6'>
            <Text className='text-center text-gray-500'>
              No collection suggestions available at the moment.
            </Text>
            <Text className='mt-2 text-center text-sm text-gray-400'>
              Check back later for new suggestions!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
