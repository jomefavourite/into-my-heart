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
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';
import { AdminOnly } from './AdminOnly';

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
  const [activeTab, setActiveTab] = useState<'verses' | 'collections'>(
    'verses'
  );

  const verseSuggestions =
    useQuery(api.verseSuggestions.getVersesSuggestion) ?? [];
  const collectionSuggestions =
    useQuery(api.collectionSuggestions.getCollectionsSuggestion) ?? [];

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
      className='bg-white rounded-lg p-4 mb-3 shadow-sm'
    >
      <View className='flex-row justify-between items-start mb-2'>
        <View className='flex-1'>
          <Text className='text-lg font-semibold text-gray-900'>
            {suggestion.bookName} {suggestion.chapter}:
            {suggestion.verses.join(', ')}
          </Text>
          <Text className='text-sm text-gray-500 mb-2'>
            Review Frequency: {suggestion.reviewFreq}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteVerseSuggestion(suggestion._id)}
          className='bg-red-100 px-3 py-1 rounded-md'
        >
          <Text className='text-red-600 text-sm font-medium'>Delete</Text>
        </TouchableOpacity>
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

  const renderCollectionSuggestion = (suggestion: CollectionSuggestion) => (
    <View
      key={suggestion._id}
      className='bg-white rounded-lg p-4 mb-3 shadow-sm'
    >
      <View className='flex-row justify-between items-start mb-2'>
        <View className='flex-1'>
          <Text className='text-lg font-semibold text-gray-900'>
            {suggestion.bookName} {suggestion.chapter}:
            {suggestion.verses.join(', ')}
          </Text>
          <Text className='text-sm text-gray-500 mb-2'>
            Review Frequency: {suggestion.reviewFreq}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteCollectionSuggestion(suggestion._id)}
          className='bg-red-100 px-3 py-1 rounded-md'
        >
          <Text className='text-red-600 text-sm font-medium'>Delete</Text>
        </TouchableOpacity>
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
    <AdminOnly
      fallback={<Text>Access denied. Admin privileges required.</Text>}
    >
      <View className='flex-1 bg-gray-50'>
        <View className='p-4'>
          <Text className='text-2xl font-bold text-gray-900 mb-4'>
            Suggestions Management
          </Text>
          <Text className='text-sm text-gray-600 mb-4'>
            Collection suggestions are visible to all users, but only admins can
            add or delete them.
          </Text>

          {/* Tab Navigation */}
          <View className='flex-row bg-white rounded-lg p-1 mb-4'>
            <TouchableOpacity
              onPress={() => setActiveTab('verses')}
              className={`flex-1 py-2 px-4 rounded-md ${
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
              className={`flex-1 py-2 px-4 rounded-md ${
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
                <View className='bg-white rounded-lg p-6 items-center'>
                  <Text className='text-gray-500 text-center'>
                    No verse suggestions found
                  </Text>
                </View>
              )
            ) : collectionSuggestions.length > 0 ? (
              collectionSuggestions.map(renderCollectionSuggestion)
            ) : (
              <View className='bg-white rounded-lg p-6 items-center'>
                <Text className='text-gray-500 text-center'>
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
