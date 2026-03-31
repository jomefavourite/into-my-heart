import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { BOOKS } from '../../lib/books';
import { useAlert } from '@/hooks/useAlert';
import { normalizeBibleText, normalizeVerseTexts } from '@/lib/verseText';

interface AddVerseFormProps {
  type: 'verse' | 'collection';
  onClose: () => void;
  onSuccess: () => void;
}

// Helper function to get verse text from API response
function getVerseText(
  chapterData: {
    content: { type: string; number: number; content: unknown }[];
  },
  verseNumber: number
) {
  const verse = chapterData.content.find(
    i => i.type === 'verse' && i.number === verseNumber
  );

  return verse
    ? { text: normalizeBibleText(verse.content), verse: verseNumber }
    : null;
}

// Function to fetch verse texts from API
const fetchVerseTexts = async (
  bookName: string,
  chapter: number,
  verseNumbers: number[]
) => {
  try {
    const bookId = BOOKS.find(book => book.name === bookName)?.id;
    if (!bookId) {
      throw new Error(`Book "${bookName}" not found`);
    }

    const response = await fetch(
      `https://bible.helloao.org/api/eng-kjv/${bookId}/${chapter}.json`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${bookName} ${chapter}`);
    }

    const chapterData = await response.json();

    const verseTexts = verseNumbers.map(verseNumber => {
      const verseData = getVerseText(chapterData.chapter, verseNumber);
      return (
        verseData || { verse: verseNumber.toString(), text: 'Verse not found' }
      );
    });

    return verseTexts;
  } catch (error) {
    console.error(`Error fetching ${bookName} ${chapter}:`, error);
    throw error;
  }
};

export function AddVerseForm({ type, onClose, onSuccess }: AddVerseFormProps) {
  const [collectionName, setCollectionName] = useState('');
  const [bookName, setBookName] = useState('');
  const [chapter, setChapter] = useState('');
  const [verses, setVerses] = useState('');
  const [verseTexts, setVerseTexts] = useState('');
  const [reviewFreq, setReviewFreq] = useState('daily');
  const [isLoadingVerses, setIsLoadingVerses] = useState(false);

  // Clear verse texts when book, chapter, or verses change
  useEffect(() => {
    if (verseTexts) {
      setVerseTexts('');
    }
  }, [bookName, chapter, verses]);

  const addVerseSuggestion = useMutation(
    api.verseSuggestions.addVerseSuggestion
  );
  const addCollectionSuggestion = useMutation(
    api.collectionSuggestions.addCollectionSuggestion
  );
  const { alert } = useAlert();

  const handleFetchVerses = async () => {
    if (!bookName.trim() || !chapter.trim() || !verses.trim()) {
      alert(
        'Error',
        'Please fill in book name, chapter, and verse numbers first'
      );
      return;
    }

    try {
      setIsLoadingVerses(true);
      const verseNumbers = verses
        .split(',')
        .map(v => parseInt(v.trim()))
        .filter(n => !isNaN(n));

      if (verseNumbers.length === 0) {
        alert('Error', 'Please enter valid verse numbers');
        return;
      }

      const fetchedTexts = await fetchVerseTexts(
        bookName.trim(),
        parseInt(chapter),
        verseNumbers
      );

      // Format the texts for display
      const formattedTexts = fetchedTexts
        .map(vt => normalizeBibleText(vt.text))
        .join('\n');
      setVerseTexts(formattedTexts);

      alert('Success', 'Verse texts fetched successfully!');
    } catch (error) {
      alert('Error', `Failed to fetch verse texts: ${error}`);
    } finally {
      setIsLoadingVerses(false);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate inputs
      if (type === 'collection' && !collectionName.trim()) {
        alert('Error', 'Please enter a collection name');
        return;
      }
      if (!bookName.trim()) {
        alert('Error', 'Please enter a book name');
        return;
      }
      if (!chapter.trim()) {
        alert('Error', 'Please enter a chapter number');
        return;
      }
      if (!verses.trim()) {
        alert('Error', 'Please enter verse numbers');
        return;
      }
      if (!verseTexts.trim()) {
        alert('Error', 'Please enter verse texts');
        return;
      }

      // Parse verses
      const verseNumbers = verses.split(',').map(v => v.trim());

      // Parse verse texts
      const texts = verseTexts.split('\n').filter(text => text.trim());

      if (texts.length !== verseNumbers.length) {
        alert('Error', 'Number of verse texts must match number of verses');
        return;
      }

      const verseTextsArray = normalizeVerseTexts(
        verseNumbers.map((verse, index) => ({
          verse,
          text: texts[index]?.trim() || '',
        }))
      );

      if (type === 'verse') {
        const args = {
          bookName: bookName.trim(),
          chapter: parseInt(chapter),
          verses: verseNumbers,
          verseTexts: verseTextsArray,
          reviewFreq,
        };
        await addVerseSuggestion(args);
        alert('Success', 'Verse suggestion added successfully!');
      } else {
        const args = {
          collectionName: collectionName.trim(),
          versesLength: verseNumbers.length,
          collectionVerses: [
            {
              bookName: bookName.trim(),
              chapter: parseInt(chapter),
              verses: verseNumbers,
              reviewFreq,
              verseTexts: verseTextsArray,
            },
          ],
        };
        await addCollectionSuggestion(args);
        alert('Success', 'Collection suggestion added successfully!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      alert('Error', `Failed to add ${type} suggestion: ${error}`);
    }
  };

  const getBookSuggestions = () => {
    return BOOKS.filter(book =>
      book.name.toLowerCase().includes(bookName.toLowerCase())
    ).slice(0, 5);
  };

  return (
    <Modal visible={true} animationType='slide' presentationStyle='pageSheet'>
      <View className='flex-1 bg-gray-50'>
        <View className='flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-3'>
          <Text className='text-lg font-semibold text-gray-900'>
            Add {type === 'verse' ? 'Verse' : 'Collection'} Suggestion
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className='rounded-md bg-gray-100 px-3 py-1'
          >
            <Text className='text-sm font-medium text-gray-600'>Cancel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className='flex-1 p-4'>
          {/* Collection Name (only for collection type) */}
          {type === 'collection' && (
            <View className='mb-4'>
              <Text className='mb-2 text-sm font-medium text-gray-700'>
                Collection Name
              </Text>
              <TextInput
                value={collectionName}
                onChangeText={setCollectionName}
                placeholder='e.g., Faith & Trust, Love Verses, etc.'
                className='rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900'
              />
            </View>
          )}

          {/* Book Name */}
          <View className='mb-4'>
            <Text className='mb-2 text-sm font-medium text-gray-700'>
              Book Name
            </Text>
            <TextInput
              value={bookName}
              onChangeText={setBookName}
              placeholder='e.g., John, Psalms, Genesis'
              className='rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900'
            />
            {bookName && getBookSuggestions().length > 0 && (
              <View className='mt-2 rounded-md border border-gray-200 bg-white'>
                {getBookSuggestions().map(book => (
                  <TouchableOpacity
                    key={book.id}
                    onPress={() => setBookName(book.name)}
                    className='border-b border-gray-100 px-3 py-2'
                  >
                    <Text className='text-sm text-gray-700'>{book.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Chapter */}
          <View className='mb-4'>
            <Text className='mb-2 text-sm font-medium text-gray-700'>
              Chapter
            </Text>
            <TextInput
              value={chapter}
              onChangeText={setChapter}
              placeholder='e.g., 3'
              keyboardType='numeric'
              className='rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900'
            />
          </View>

          {/* Verses */}
          <View className='mb-4'>
            <Text className='mb-2 text-sm font-medium text-gray-700'>
              Verse Numbers
            </Text>
            <TextInput
              value={verses}
              onChangeText={setVerses}
              placeholder='e.g., 16, 17, 18 (comma-separated)'
              className='rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900'
            />
            <TouchableOpacity
              onPress={handleFetchVerses}
              disabled={isLoadingVerses}
              className={`mt-2 rounded-md px-4 py-2 ${
                isLoadingVerses ? 'bg-gray-400' : 'bg-blue-500'
              }`}
            >
              <View className='flex-row items-center justify-center'>
                {isLoadingVerses && (
                  <ActivityIndicator
                    size='small'
                    color='white'
                    className='mr-2'
                  />
                )}
                <Text className='text-center text-sm font-medium text-white'>
                  {isLoadingVerses ? 'Fetching...' : 'Fetch Verse Texts'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Verse Texts */}
          <View className='mb-4'>
            <Text className='mb-2 text-sm font-medium text-gray-700'>
              Verse Texts
            </Text>
            <TextInput
              value={verseTexts}
              onChangeText={setVerseTexts}
              placeholder='Click "Fetch Verse Texts" to automatically load verses, or enter manually...'
              multiline
              numberOfLines={6}
              className='rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900'
              textAlignVertical='top'
            />
            <Text className='mt-1 text-xs text-gray-500'>
              {verseTexts
                ? 'Texts loaded from API. You can edit if needed.'
                : 'Each line should correspond to one verse in order'}
            </Text>
          </View>

          {/* Review Frequency */}
          <View className='mb-6'>
            <Text className='mb-2 text-sm font-medium text-gray-700'>
              Review Frequency
            </Text>
            <View className='flex-row space-x-2'>
              {['daily', 'weekly', 'monthly'].map(freq => (
                <TouchableOpacity
                  key={freq}
                  onPress={() => setReviewFreq(freq)}
                  className={`flex-1 rounded-md px-3 py-2 ${
                    reviewFreq === freq
                      ? 'bg-blue-600'
                      : 'border border-gray-300 bg-white'
                  }`}
                >
                  <Text
                    className={`text-center text-sm font-medium ${
                      reviewFreq === freq ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className='rounded-md bg-blue-600 px-4 py-3'
          >
            <Text className='text-center text-sm font-medium text-white'>
              Add {type === 'verse' ? 'Verse' : 'Collection'} Suggestion
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}
