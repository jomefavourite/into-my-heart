import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useAuth } from '@clerk/clerk-expo';

interface CollectionSuggestion {
  _id: string;
  collectionName: string;
  versesLength: number;
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
          {suggestion.collectionName}
        </Text>
        <Text className='mb-2 text-sm text-gray-500'>
          {suggestion.versesLength} verses in this collection
        </Text>
      </View>

      <View className='space-y-3'>
        {suggestion.collectionVerses &&
        suggestion.collectionVerses.length > 0 ? (
          suggestion.collectionVerses.map((verseGroup, groupIndex) => (
            <View key={groupIndex} className='rounded-md bg-gray-50 p-3'>
              <Text className='mb-2 text-sm font-medium text-gray-700'>
                {verseGroup.bookName} {verseGroup.chapter}:
                {verseGroup.verses.join(', ')}
              </Text>
              <Text className='mb-2 text-xs text-gray-500'>
                Review Frequency: {verseGroup.reviewFreq}
              </Text>
              <View className='space-y-2'>
                {verseGroup.verseTexts && verseGroup.verseTexts.length > 0 ? (
                  verseGroup.verseTexts.map((verse, verseIndex) => (
                    <View key={verseIndex} className='rounded bg-white p-2'>
                      <Text className='mb-1 text-xs font-medium text-gray-600'>
                        Verse {verse.verse}:
                      </Text>
                      <Text className='text-xs text-gray-600'>
                        {verse.text}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text className='text-xs text-gray-500'>
                    No verse texts available
                  </Text>
                )}
              </View>
            </View>
          ))
        ) : (
          <View className='rounded-md bg-gray-50 p-3'>
            <Text className='text-sm text-gray-500'>
              This collection appears to be using an old format. Please contact
              an admin to update it.
            </Text>
          </View>
        )}
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
