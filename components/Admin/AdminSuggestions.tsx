import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { AdminOnly } from './AdminOnly';
import { useAuth } from '@clerk/clerk-expo';

interface VerseSuggestion {
  _id: Id<'versesSuggestions'>;
  bookName: string;
  chapter: number;
  verses: string[];
  verseTexts: Array<{
    verse: string;
    text: string;
  }>;
  reviewFreq: string;
  userId: Id<'users'>;
}

interface CollectionSuggestion {
  _id: Id<'collectionSuggestions'>;
  bookName: string;
  chapter: number;
  verses: string[];
  verseTexts: Array<{
    verse: string;
    text: string;
  }>;
  reviewFreq: string;
  userId: Id<'users'>;
}

export function AdminSuggestions() {
  const { isSignedIn, isLoaded } = useAuth();
  const [activeTab, setActiveTab] = useState<'verses' | 'collections'>(
    'verses'
  );

  const verseSuggestions =
    useQuery(
      api.verseSuggestions.getVersesSuggestion,
      isSignedIn && isLoaded ? {} : 'skip'
    ) ?? [];
  const collectionSuggestions =
    useQuery(
      api.collectionSuggestions.getCollectionsSuggestion,
      isSignedIn && isLoaded ? {} : 'skip'
    ) ?? [];

  const deleteVerseSuggestion = useMutation(
    api.verseSuggestions.deleteVerseSuggestion
  );
  const deleteCollectionSuggestion = useMutation(
    api.collectionSuggestions.deleteCollectionSuggestion
  );

  const handleDeleteVerseSuggestion = async (id: Id<'versesSuggestions'>) => {
    Alert.alert(
      'Delete Verse Suggestion',
      'Are you sure you want to delete this verse suggestion?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteVerseSuggestion({ _id: id });
              Alert.alert('Success', 'Verse suggestion deleted successfully!');
            } catch (error) {
              Alert.alert(
                'Error',
                `Failed to delete verse suggestion: ${error}`
              );
            }
          },
        },
      ]
    );
  };

  const handleDeleteCollectionSuggestion = async (
    id: Id<'collectionSuggestions'>
  ) => {
    Alert.alert(
      'Delete Collection Suggestion',
      'Are you sure you want to delete this collection suggestion?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCollectionSuggestion({ _id: id });
              Alert.alert(
                'Success',
                'Collection suggestion deleted successfully!'
              );
            } catch (error) {
              Alert.alert(
                'Error',
                `Failed to delete collection suggestion: ${error}`
              );
            }
          },
        },
      ]
    );
  };

  const renderVerseSuggestion = (suggestion: VerseSuggestion) => (
    <View
      key={suggestion._id}
      className='mb-3 rounded-lg bg-white p-4 shadow-sm'
    >
      <View className='mb-2 flex-row items-start justify-between'>
        <View className='flex-1'>
          <Text className='text-lg font-semibold text-gray-900'>
            {suggestion.bookName} {suggestion.chapter}:
            {suggestion.verses.join(', ')}
          </Text>
          <Text className='mb-2 text-sm text-gray-500'>
            Review Frequency: {suggestion.reviewFreq}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteVerseSuggestion(suggestion._id)}
          className='rounded-md bg-red-100 px-3 py-1'
        >
          <Text className='text-sm font-medium text-red-600'>Delete</Text>
        </TouchableOpacity>
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

  const renderCollectionSuggestion = (suggestion: CollectionSuggestion) => (
    <View
      key={suggestion._id}
      className='mb-3 rounded-lg bg-white p-4 shadow-sm'
    >
      <View className='mb-2 flex-row items-start justify-between'>
        <View className='flex-1'>
          <Text className='text-lg font-semibold text-gray-900'>
            {suggestion.bookName} {suggestion.chapter}:
            {suggestion.verses.join(', ')}
          </Text>
          <Text className='mb-2 text-sm text-gray-500'>
            Review Frequency: {suggestion.reviewFreq}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteCollectionSuggestion(suggestion._id)}
          className='rounded-md bg-red-100 px-3 py-1'
        >
          <Text className='text-sm font-medium text-red-600'>Delete</Text>
        </TouchableOpacity>
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
    <AdminOnly
      fallback={<Text>Access denied. Admin privileges required.</Text>}
    >
      <View className='flex-1 bg-gray-50'>
        <View className='p-4'>
          <Text className='mb-4 text-2xl font-bold text-gray-900'>
            Suggestions Management
          </Text>
          <Text className='mb-4 text-sm text-gray-600'>
            Collection suggestions are visible to all users, but only admins can
            add or delete them.
          </Text>

          {/* Tab Navigation */}
          <View className='mb-4 flex-row rounded-lg bg-white p-1'>
            <TouchableOpacity
              onPress={() => setActiveTab('verses')}
              className={`flex-1 rounded-md px-4 py-2 ${
                activeTab === 'verses' ? 'bg-blue-600' : 'bg-transparent'
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === 'verses' ? 'text-white' : 'text-gray-600'
                }`}
              >
                Verse Suggestions ({verseSuggestions.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('collections')}
              className={`flex-1 rounded-md px-4 py-2 ${
                activeTab === 'collections' ? 'bg-blue-600' : 'bg-transparent'
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === 'collections' ? 'text-white' : 'text-gray-600'
                }`}
              >
                Collection Suggestions ({collectionSuggestions.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView className='flex-1'>
            {activeTab === 'verses' ? (
              verseSuggestions.length > 0 ? (
                verseSuggestions.map(renderVerseSuggestion)
              ) : (
                <View className='items-center rounded-lg bg-white p-6'>
                  <Text className='text-center text-gray-500'>
                    No verse suggestions found
                  </Text>
                </View>
              )
            ) : collectionSuggestions.length > 0 ? (
              collectionSuggestions.map(renderCollectionSuggestion)
            ) : (
              <View className='items-center rounded-lg bg-white p-6'>
                <Text className='text-center text-gray-500'>
                  No collection suggestions found
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </AdminOnly>
  );
}
