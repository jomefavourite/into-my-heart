import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { BOOKS } from '../../lib/books';

// Helper function to parse verse reference
function parseVerseReference(verseRef: string) {
  // Remove emojis and extra spaces
  const cleanRef = verseRef.replace(/[^\w\s:.-]/g, '').trim();

  // Split by colon to separate chapter and verses
  const parts = cleanRef.split(':');
  if (parts.length !== 2) {
    throw new Error(`Invalid verse reference format: ${verseRef}`);
  }

  const bookChapter = parts[0].trim();
  const verses = parts[1].trim();

  // Extract book name and chapter number
  const bookChapterMatch = bookChapter.match(/^(.+?)\s+(\d+)$/);
  if (!bookChapterMatch) {
    throw new Error(`Could not parse book and chapter from: ${bookChapter}`);
  }

  const bookName = bookChapterMatch[1].trim();
  const chapter = parseInt(bookChapterMatch[2]);

  // Parse verse numbers (handle ranges like "5-6")
  const verseNumbers = [];
  if (verses.includes('-')) {
    const [start, end] = verses.split('-').map(v => parseInt(v.trim()));
    for (let i = start; i <= end; i++) {
      verseNumbers.push(i);
    }
  } else {
    verseNumbers.push(parseInt(verses));
  }

  return {
    bookName,
    chapter,
    verses: verseNumbers.map((v: number) => v.toString()),
    verseNumbers,
  };
}

// Function to fetch verse texts from Bible API
async function fetchVerseTexts(
  bookName: string,
  chapter: number,
  verseNumbers: number[]
) {
  try {
    console.log(
      `fetchVerseTexts: Looking for book "${bookName}" in BOOKS database`
    );
    const bookId = BOOKS.find(book => book.name === bookName)?.id;
    console.log(`fetchVerseTexts: Found bookId: ${bookId}`);

    if (!bookId) {
      console.error(
        `fetchVerseTexts: Book "${bookName}" not found in BOOKS database`
      );
      console.log('Available books:', BOOKS.map(b => b.name).slice(0, 10));
      throw new Error(`Book "${bookName}" not found in BOOKS database`);
    }

    const apiUrl = `https://bible.helloao.org/api/eng-kjv/${bookId}/${chapter}.json`;
    console.log(`fetchVerseTexts: Fetching from ${apiUrl}`);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error(
        `fetchVerseTexts: API request failed with status ${response.status}`
      );
      throw new Error(
        `Failed to fetch data for ${bookName} ${chapter} (Status: ${response.status})`
      );
    }

    const chapterData = await response.json();
    console.log(`fetchVerseTexts: Received chapter data:`, chapterData);

    const verseTexts = verseNumbers
      .map((verseNumber: number) => {
        const verse = chapterData.chapter.content.find(
          (i: any) => i.type === 'verse' && i.number === verseNumber
        );
        if (verse && verse.content && verse.content[0]) {
          // Extract just the text string from the verse content
          const verseContent = verse.content[0];
          console.log(
            `fetchVerseTexts: Verse ${verseNumber} content:`,
            verseContent
          );

          const textString =
            typeof verseContent === 'string'
              ? verseContent
              : verseContent.text || verseContent.toString();

          console.log(
            `fetchVerseTexts: Extracted text for verse ${verseNumber}:`,
            textString
          );
          return { text: textString, verse: verseNumber };
        }
        return null;
      })
      .filter(Boolean);

    console.log(`fetchVerseTexts: Extracted ${verseTexts.length} verse texts`);
    return verseTexts;
  } catch (error) {
    console.error(`Error fetching ${bookName} ${chapter}:`, error);
    throw error;
  }
}

export function BulkAddVerses() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<{
    success: string[];
    failed: string[];
  }>({ success: [], failed: [] });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completeMessage, setCompleteMessage] = useState('');
  const [customBulkText, setCustomBulkText] = useState('');
  const [versesToProcess, setVersesToProcess] = useState<string[]>([]);
  const [addMode, setAddMode] = useState<'verses' | 'collections'>('verses');
  const [collectionName, setCollectionName] = useState('');

  const addVerseSuggestion = useMutation(
    api.verseSuggestions.addVerseSuggestion
  );
  const addCollectionSuggestion = useMutation(
    api.collectionSuggestions.addCollectionSuggestion
  );

  // Function to parse custom bulk text input
  const parseCustomBulkText = (text: string): string[] => {
    if (!text.trim()) return [];

    // Split by lines and filter out empty lines
    const lines = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Filter out comment lines (starting with // or #)
    const verses = lines.filter(
      line => !line.startsWith('//') && !line.startsWith('#')
    );

    return verses;
  };

  const handleBulkAdd = async () => {
    console.log('BulkAddVerses: handleBulkAdd called');

    // Parse custom text input
    const versesToProcess = parseCustomBulkText(customBulkText);

    if (versesToProcess.length === 0) {
      Alert.alert(
        'Error',
        'No verses to process. Please add some verse references.'
      );
      return;
    }

    // Validate collection name if in collection mode
    if (addMode === 'collections' && !collectionName.trim()) {
      Alert.alert(
        'Error',
        'Please enter a collection name for collection mode.'
      );
      return;
    }

    console.log(
      `BulkAddVerses: Processing ${versesToProcess.length} verses:`,
      versesToProcess
    );

    // Use native Alert on mobile, custom modal on web
    if (Platform.OS !== 'web') {
      Alert.alert(
        'Bulk Add Bible Verses',
        `This will add ${versesToProcess.length} Bible verses to ${addMode === 'verses' ? 'verse suggestions' : 'collection suggestions'}. Continue?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: `Add All ${addMode === 'verses' ? 'Verses' : 'Collections'}`,
            onPress: () => startBulkAddProcess(versesToProcess),
          },
        ]
      );
    } else {
      setVersesToProcess(versesToProcess);
      setShowConfirmModal(true);
    }
  };

  const startBulkAddProcess = async (versesToProcess: string[]) => {
    setShowConfirmModal(false);
    setIsLoading(true);
    setProgress({ current: 0, total: versesToProcess.length });
    setResults({ success: [], failed: [] });

    const successList: string[] = [];
    const failedList: string[] = [];

    if (addMode === 'verses') {
      // Process each verse individually
      for (let i = 0; i < versesToProcess.length; i++) {
        const verse = versesToProcess[i];
        console.log(
          `Processing verse ${i + 1}/${versesToProcess.length}: ${verse}`
        );

        setProgress({ current: i + 1, total: versesToProcess.length });

        try {
          console.log(`Parsing verse reference: ${verse}`);
          const { bookName, chapter, verses, verseNumbers } =
            parseVerseReference(verse);
          console.log(`Parsed: ${bookName} ${chapter}:${verses.join(',')}`);

          // Fetch verse texts from API
          console.log(`Fetching verse texts from API...`);
          const verseTexts = await fetchVerseTexts(
            bookName,
            chapter,
            verseNumbers
          );
          console.log(`Fetched ${verseTexts.length} verse texts`);

          if (verseTexts.length === 0) {
            console.warn(`No verse texts found for ${verse}`);
            failedList.push(`${verse} - No verse texts found`);
            continue;
          }

          // Add to database
          console.log(`Adding to database...`);
          await addVerseSuggestion({
            bookName,
            chapter: parseFloat(chapter.toString()),
            verses,
            versesTexts: verseTexts.map((vt: any) => ({
              verse: vt.verse.toString(),
              text: vt.text,
            })),
            reviewFreq: 'daily',
          });

          console.log(`Successfully added ${verse}`);
          successList.push(verse);
        } catch (error) {
          console.error(`Failed to add ${verse}:`, error);
          failedList.push(`${verse} - ${error}`);
        }

        // Add a small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } else {
      // Process all verses as a single collection
      const collectionVerses = [];
      let totalVersesLength = 0;

      for (let i = 0; i < versesToProcess.length; i++) {
        const verse = versesToProcess[i];
        console.log(
          `Processing verse ${i + 1}/${versesToProcess.length}: ${verse}`
        );

        setProgress({ current: i + 1, total: versesToProcess.length });

        try {
          console.log(`Parsing verse reference: ${verse}`);
          const { bookName, chapter, verses, verseNumbers } =
            parseVerseReference(verse);
          console.log(`Parsed: ${bookName} ${chapter}:${verses.join(',')}`);

          // Fetch verse texts from API
          console.log(`Fetching verse texts from API...`);
          const verseTexts = await fetchVerseTexts(
            bookName,
            chapter,
            verseNumbers
          );
          console.log(`Fetched ${verseTexts.length} verse texts`);

          if (verseTexts.length === 0) {
            console.warn(`No verse texts found for ${verse}`);
            failedList.push(`${verse} - No verse texts found`);
            continue;
          }

          // Add to collection verses array
          collectionVerses.push({
            bookName,
            chapter: parseFloat(chapter.toString()),
            verses,
            reviewFreq: 'daily',
            verseTexts: verseTexts.map((vt: any) => ({
              verse: vt.verse.toString(),
              text: vt.text,
            })),
          });

          totalVersesLength += verseNumbers.length;
          successList.push(verse);
        } catch (error) {
          console.error(`Failed to add ${verse}:`, error);
          failedList.push(`${verse} - ${error}`);
        }

        // Add a small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Create the collection if we have any successful verses
      if (collectionVerses.length > 0) {
        try {
          console.log(
            `Creating collection with ${collectionVerses.length} verse groups...`
          );
          console.log('Collection data:', {
            collectionName: collectionName.trim(),
            versesLength: totalVersesLength,
            collectionVerses,
          });

          await addCollectionSuggestion({
            collectionName: collectionName.trim(),
            versesLength: totalVersesLength,
            collectionVerses,
          });
          console.log(`Successfully created collection: ${collectionName}`);
        } catch (error) {
          console.error(`Failed to create collection:`, error);
          failedList.push(`Collection creation failed - ${error}`);
        }
      }
    }

    setResults({ success: successList, failed: failedList });
    setIsLoading(false);

    // Use native Alert on mobile, custom modal on web
    if (Platform.OS !== 'web') {
      Alert.alert(
        'Bulk Add Complete',
        `Successfully added: ${successList.length}\nFailed: ${failedList.length}`,
        [{ text: 'OK' }]
      );
    } else {
      setCompleteMessage(
        `Successfully added: ${successList.length}\nFailed: ${failedList.length}`
      );
      setShowCompleteModal(true);
    }
  };

  return (
    <View className='mb-6 rounded-lg bg-white p-4 shadow-sm'>
      <Text className='mb-3 text-lg font-semibold text-gray-900'>
        Bulk Add Bible Verses
      </Text>
      <Text className='mb-4 text-sm text-gray-600'>
        Add Bible verses to{' '}
        {addMode === 'verses' ? 'verse suggestions' : 'collection suggestions'}
        automatically. This will fetch verse texts from the Bible API and add
        them to the database.
      </Text>

      {/* Add Mode Selector */}
      <View className='mb-4'>
        <Text className='mb-2 text-sm font-medium text-gray-700'>Add as:</Text>
        <View className='flex-row rounded-lg bg-gray-100 p-1'>
          <TouchableOpacity
            onPress={() => setAddMode('verses')}
            className={`flex-1 rounded-md px-3 py-2 ${
              addMode === 'verses' ? 'bg-white shadow-sm' : 'bg-transparent'
            }`}
          >
            <Text
              className={`text-center text-sm font-medium ${
                addMode === 'verses' ? 'text-gray-900' : 'text-gray-600'
              }`}
            >
              Individual Verses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setAddMode('collections')}
            className={`flex-1 rounded-md px-3 py-2 ${
              addMode === 'collections'
                ? 'bg-white shadow-sm'
                : 'bg-transparent'
            }`}
          >
            <Text
              className={`text-center text-sm font-medium ${
                addMode === 'collections' ? 'text-gray-900' : 'text-gray-600'
              }`}
            >
              Collections
            </Text>
          </TouchableOpacity>
        </View>
        <Text className='mt-1 text-xs text-gray-500'>
          {addMode === 'verses'
            ? 'Each verse will be added as a separate suggestion'
            : 'All verses will be grouped into a single collection'}
        </Text>
      </View>

      {/* Collection Name Input (only for collection mode) */}
      {addMode === 'collections' && (
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
          <Text className='mt-1 text-xs text-gray-500'>
            All verses will be grouped under this collection name
          </Text>
        </View>
      )}

      {isLoading && (
        <View className='mb-4 rounded-md bg-blue-50 p-3'>
          <View className='mb-2 flex-row items-center justify-between'>
            <Text className='text-sm font-medium text-blue-800'>
              Adding verses...
            </Text>
            <Text className='text-sm text-blue-600'>
              {progress.current} / {progress.total}
            </Text>
          </View>
          <View className='h-2 w-full rounded-full bg-blue-200'>
            <View
              className='h-2 rounded-full bg-blue-600'
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </View>
        </View>
      )}

      {results.success.length > 0 && (
        <View className='mb-3 rounded-md bg-green-50 p-3'>
          <Text className='mb-1 text-sm font-medium text-green-800'>
            Successfully Added ({results.success.length})
          </Text>
          <ScrollView className='max-h-20'>
            {results.success.map((verse, index) => (
              <Text key={index} className='text-xs text-green-700'>
                • {verse}
              </Text>
            ))}
          </ScrollView>
        </View>
      )}

      {results.failed.length > 0 && (
        <View className='mb-3 rounded-md bg-red-50 p-3'>
          <Text className='mb-1 text-sm font-medium text-red-800'>
            Failed ({results.failed.length})
          </Text>
          <ScrollView className='max-h-20'>
            {results.failed.map((verse, index) => (
              <Text key={index} className='text-xs text-red-700'>
                • {verse}
              </Text>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Verse List Input */}
      <View className='mb-4'>
        <Text className='mb-2 text-sm font-medium text-gray-700'>
          Bible Verse References
        </Text>
        <Text className='mb-2 text-sm text-gray-600'>
          Enter Bible verse references (one per line):
        </Text>
        <TextInput
          value={customBulkText}
          onChangeText={setCustomBulkText}
          placeholder={`Genesis 1:1\nJohn 3:16\nPsalm 23:1\nProverbs 3:5-6\n...`}
          multiline
          numberOfLines={6}
          className='rounded-md border border-gray-300 bg-white p-3 text-sm text-gray-900'
          style={{ textAlignVertical: 'top' }}
        />
        <Text className='mt-1 text-xs text-gray-500'>
          Lines starting with // or # will be ignored as comments
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => {
          console.log('BulkAddVerses: Button clicked!');
          handleBulkAdd();
        }}
        disabled={isLoading}
        className={`rounded-md px-4 py-3 ${
          isLoading ? 'bg-gray-400' : 'bg-green-600'
        }`}
      >
        <View className='flex-row items-center justify-center'>
          {isLoading && (
            <ActivityIndicator size='small' color='white' className='mr-2' />
          )}
          <Text className='text-center text-sm font-medium text-white'>
            {isLoading
              ? `Adding ${addMode === 'verses' ? 'Verses' : 'Collection'}...`
              : `Add Bible ${addMode === 'verses' ? 'Verses' : 'Collection'}`}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Web Confirmation Modal */}
      {showConfirmModal && (
        <Modal
          transparent
          visible={showConfirmModal}
          animationType='fade'
          onRequestClose={() => setShowConfirmModal(false)}
        >
          <View className='flex-1 items-center justify-center bg-black/50 p-4'>
            <View className='w-full max-w-sm rounded-lg bg-white p-6'>
              <Text className='mb-2 text-lg font-semibold text-gray-900'>
                Bulk Add Bible {addMode === 'verses' ? 'Verses' : 'Collection'}
              </Text>
              <Text className='mb-6 text-sm text-gray-600'>
                This will add {versesToProcess.length} Bible verses to{' '}
                {addMode === 'verses'
                  ? 'verse suggestions'
                  : 'a collection suggestion'}
                . Continue?
              </Text>
              <View className='flex-row space-x-3'>
                <TouchableOpacity
                  onPress={() => setShowConfirmModal(false)}
                  className='flex-1 rounded-md bg-gray-200 px-4 py-2'
                >
                  <Text className='text-center text-sm font-medium text-gray-700'>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => startBulkAddProcess(versesToProcess)}
                  className='flex-1 rounded-md bg-green-600 px-4 py-2'
                >
                  <Text className='text-center text-sm font-medium text-white'>
                    Add {addMode === 'verses' ? 'Verses' : 'Collection'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Web Completion Modal */}
      {showCompleteModal && (
        <Modal
          transparent
          visible={showCompleteModal}
          animationType='fade'
          onRequestClose={() => setShowCompleteModal(false)}
        >
          <View className='flex-1 items-center justify-center bg-black/50 p-4'>
            <View className='w-full max-w-sm rounded-lg bg-white p-6'>
              <Text className='mb-2 text-lg font-semibold text-gray-900'>
                Bulk Add Complete
              </Text>
              <Text className='mb-6 text-sm text-gray-600'>
                {completeMessage}
              </Text>
              <TouchableOpacity
                onPress={() => setShowCompleteModal(false)}
                className='rounded-md bg-blue-600 px-4 py-2'
              >
                <Text className='text-center text-sm font-medium text-white'>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
