import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Platform,
  Modal,
} from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { AdminOnly } from './AdminOnly';
import { AddVerseForm } from './AddVerseForm';
import { BulkAddVerses } from './BulkAddVerses';
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormType, setAddFormType] = useState<'verse' | 'collection'>(
    'verse'
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{
    id: Id<'versesSuggestions'> | Id<'collectionSuggestions'>;
    type: 'verse' | 'collection';
    title: string;
  } | null>(null);

  const verseSuggestions =
    useQuery(
      api.verseSuggestions.getAllVerseSuggestions,
      isSignedIn && isLoaded ? {} : 'skip'
    ) ?? [];
  const collectionSuggestions =
    useQuery(
      api.collectionSuggestions.getAllCollectionSuggestions,
      isSignedIn && isLoaded ? {} : 'skip'
    ) ?? [];

  const deleteVerseSuggestion = useMutation(
    api.verseSuggestions.deleteVerseSuggestion
  );
  const deleteCollectionSuggestion = useMutation(
    api.collectionSuggestions.deleteCollectionSuggestion
  );

  const handleDeleteVerseSuggestion = async (id: Id<'versesSuggestions'>) => {
    const suggestion = verseSuggestions.find(s => s._id === id);
    const title = suggestion
      ? `${suggestion.bookName} ${suggestion.chapter}:${suggestion.verses.join(',')}`
      : 'Verse Suggestion';

    // Use native Alert on mobile, custom modal on web
    if (Platform.OS !== 'web') {
      Alert.alert(
        'Delete Verse Suggestion',
        'Are you sure you want to delete this verse suggestion?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => executeDelete(id, 'verse'),
          },
        ]
      );
    } else {
      setDeleteItem({
        id,
        type: 'verse',
        title: `Delete "${title}"`,
      });
      setShowDeleteModal(true);
    }
  };

  const handleDeleteCollectionSuggestion = async (
    id: Id<'collectionSuggestions'>
  ) => {
    const suggestion = collectionSuggestions.find(s => s._id === id);
    const title = suggestion
      ? `${suggestion.bookName} ${suggestion.chapter}:${suggestion.verses.join(',')}`
      : 'Collection Suggestion';

    // Use native Alert on mobile, custom modal on web
    if (Platform.OS !== 'web') {
      Alert.alert(
        'Delete Collection Suggestion',
        'Are you sure you want to delete this collection suggestion?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => executeDelete(id, 'collection'),
          },
        ]
      );
    } else {
      setDeleteItem({
        id,
        type: 'collection',
        title: `Delete "${title}"`,
      });
      setShowDeleteModal(true);
    }
  };

  const executeDelete = async (
    id: Id<'versesSuggestions'> | Id<'collectionSuggestions'>,
    type: 'verse' | 'collection'
  ) => {
    try {
      if (type === 'verse') {
        await deleteVerseSuggestion({ _id: id as Id<'versesSuggestions'> });
      } else {
        await deleteCollectionSuggestion({
          _id: id as Id<'collectionSuggestions'>,
        });
      }

      // Use native Alert on mobile, custom modal on web
      if (Platform.OS !== 'web') {
        Alert.alert(
          'Success',
          `${type === 'verse' ? 'Verse' : 'Collection'} suggestion deleted successfully!`
        );
      } else {
        // For web, we could show a toast or just close the modal
        setShowDeleteModal(false);
        setDeleteItem(null);
      }
    } catch (error) {
      // Use native Alert on mobile, custom modal on web
      if (Platform.OS !== 'web') {
        Alert.alert('Error', `Failed to delete ${type} suggestion: ${error}`);
      } else {
        // For web, we could show an error toast or modal
        console.error(`Failed to delete ${type} suggestion:`, error);
        setShowDeleteModal(false);
        setDeleteItem(null);
      }
    }
  };

  const handleAddVerse = () => {
    setAddFormType('verse');
    setShowAddForm(true);
  };

  const handleAddCollection = () => {
    setAddFormType('collection');
    setShowAddForm(true);
  };

  const handleFormSuccess = () => {
    // The queries will automatically refetch due to Convex reactivity
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

          {/* Bulk Add Bible Verses */}
          <BulkAddVerses />

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

          {/* Add Buttons */}
          <View className='mb-4 flex-row space-x-2'>
            <TouchableOpacity
              onPress={handleAddVerse}
              className='flex-1 rounded-md bg-green-600 px-4 py-2'
            >
              <Text className='text-center text-sm font-medium text-white'>
                Add Verse Suggestion
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAddCollection}
              className='flex-1 rounded-md bg-green-600 px-4 py-2'
            >
              <Text className='text-center text-sm font-medium text-white'>
                Add Collection Suggestion
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

        {/* Add Form Modal */}
        {showAddForm && (
          <AddVerseForm
            type={addFormType}
            onClose={() => setShowAddForm(false)}
            onSuccess={handleFormSuccess}
          />
        )}

        {/* Web Delete Confirmation Modal */}
        {showDeleteModal && deleteItem && (
          <Modal
            transparent
            visible={showDeleteModal}
            animationType='fade'
            onRequestClose={() => setShowDeleteModal(false)}
          >
            <View className='flex-1 items-center justify-center bg-black/50 p-4'>
              <View className='w-full max-w-sm rounded-lg bg-white p-6'>
                <Text className='mb-2 text-lg font-semibold text-gray-900'>
                  {deleteItem.title}
                </Text>
                <Text className='mb-6 text-sm text-gray-600'>
                  Are you sure you want to delete this {deleteItem.type}{' '}
                  suggestion? This action cannot be undone.
                </Text>
                <View className='flex-row space-x-3'>
                  <TouchableOpacity
                    onPress={() => setShowDeleteModal(false)}
                    className='flex-1 rounded-md bg-gray-200 px-4 py-2'
                  >
                    <Text className='text-center text-sm font-medium text-gray-700'>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      executeDelete(deleteItem.id, deleteItem.type)
                    }
                    className='flex-1 rounded-md bg-red-600 px-4 py-2'
                  >
                    <Text className='text-center text-sm font-medium text-white'>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </AdminOnly>
  );
}
