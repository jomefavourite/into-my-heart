import { View, TextInput, ScrollView, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/components/BackHeader';
import { Label } from '@/components/ui/label';
import ThemedText from '@/components/ThemedText';
import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { BOOKS } from '@/lib/books';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useBookStore } from '@/store/bookStore';

interface ParsedVerse {
  bookName: string;
  chapter: number;
  verses: string[];
  verseTexts: Array<{ verse: string; text: string }>;
  version?: string;
  error?: string;
}

const ImportVerses = () => {
  const router = useRouter();
  const [pastedText, setPastedText] = useState('');
  const [parsedVerse, setParsedVerse] = useState<ParsedVerse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addVerse = useMutation(api.verses.addVerse);
  const { setCollectionVersesArray, resetAll } = useBookStore();

  // Normalize book names for matching
  const normalizeBookName = (name: string): string => {
    const normalized = name.trim();
    const normalizedLower = normalized.toLowerCase();

    // Handle plural to singular conversions
    if (normalizedLower === 'psalms' || normalizedLower === 'psalm') {
      return 'Psalm';
    }
    if (normalizedLower === 'proverbs' || normalizedLower === 'proverb') {
      return 'Proverbs'; // This book is actually plural in the Bible
    }

    // Check against BOOKS array for exact match
    const book = BOOKS.find(
      b =>
        b.name.toLowerCase() === normalizedLower ||
        b.abbreviation.toLowerCase() === normalizedLower ||
        b.id.toLowerCase() === normalizedLower
    );

    return book ? book.name : normalized;
  };

  const parseVerse = (text: string): ParsedVerse | null => {
    try {
      // Remove URLs
      const urlRegex = /https?:\/\/[^\s]+/g;
      let cleanedText = text.replace(urlRegex, '').trim();

      // Extract verse reference pattern: "BookName Chapter:Verse Version"
      // Example: "Psalms 119:1 NKJV"
      const referencePattern =
        /([A-Za-z\s]+?)\s+(\d+):(\d+(?:-\d+)?)\s+([A-Z]+)/;
      const match = cleanedText.match(referencePattern);

      if (!match) {
        // Try without version
        const refPattern2 = /([A-Za-z\s]+?)\s+(\d+):(\d+(?:-\d+)?)/;
        const match2 = cleanedText.match(refPattern2);
        if (!match2) {
          setError(
            'Could not parse verse reference. Expected format: "Book Chapter:Verse" or "Book Chapter:Verse Version"'
          );
          return null;
        }

        const bookName = normalizeBookName(match2[1].trim());
        const chapter = parseInt(match2[2]);
        const verseRange = match2[3];
        const version = undefined;

        // Find the book
        const book = BOOKS.find(
          b => b.name === bookName || b.abbreviation === bookName
        );
        if (!book) {
          setError(`Book "${match2[1].trim()}" not found.`);
          return null;
        }

        // Parse verse range (e.g., "1", "1-5", "1,3-5")
        const verses: string[] = [];
        if (verseRange.includes('-')) {
          const [start, end] = verseRange.split('-').map(Number);
          for (let i = start; i <= end; i++) {
            verses.push(i.toString());
          }
        } else {
          verses.push(verseRange);
        }

        // Extract the verse text itself (everything before the reference)
        const verseReference = match2[0];
        const textBeforeRef = cleanedText
          .substring(0, cleanedText.indexOf(verseReference))
          .trim();

        const verseTexts = verses.map(v => ({
          verse: v,
          text: textBeforeRef || 'Imported text',
        }));

        return {
          bookName,
          chapter,
          verses,
          verseTexts,
          version,
        };
      }

      const bookName = normalizeBookName(match[1].trim());
      const chapter = parseInt(match[2]);
      const verseRange = match[3];
      const version = match[4];

      // Find the book
      const book = BOOKS.find(
        b => b.name === bookName || b.abbreviation === bookName
      );
      if (!book) {
        setError(`Book "${match[1].trim()}" not found.`);
        return null;
      }

      // Parse verse range (e.g., "1", "1-5", "1,3-5")
      const verses: string[] = [];
      if (verseRange.includes('-')) {
        const [start, end] = verseRange.split('-').map(Number);
        for (let i = start; i <= end; i++) {
          verses.push(i.toString());
        }
      } else {
        verses.push(verseRange);
      }

      // Extract the verse text itself (everything before the reference)
      const verseReference = match[0];
      const textBeforeRef = cleanedText
        .substring(0, cleanedText.indexOf(verseReference))
        .trim();

      const verseTexts = verses.map(v => ({
        verse: v,
        text: textBeforeRef || 'Imported text',
      }));

      return {
        bookName,
        chapter,
        verses,
        verseTexts,
        version,
      };
    } catch (err) {
      setError('Failed to parse verse. Please check the format.');
      return null;
    }
  };

  const handleParse = () => {
    setError(null);
    const parsed = parseVerse(pastedText);
    setParsedVerse(parsed);
  };

  const handleSaveToVerses = async () => {
    if (!parsedVerse) return;

    try {
      await addVerse({
        bookName: parsedVerse.bookName,
        chapter: parsedVerse.chapter,
        verses: parsedVerse.verses,
        verseTexts: parsedVerse.verseTexts,
        reviewFreq: '',
      });
      router.back();
    } catch (error) {
      console.error('Error saving verse:', error);
      setError('Failed to save verse. Please try again.');
    }
  };

  const handleSaveToCollection = () => {
    if (!parsedVerse) return;
    setCollectionVersesArray([parsedVerse]);
    router.push('/verses/create-collection');
  };

  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        title='Import Verse'
        items={[
          { label: 'Verses', href: '/verses' },
          { label: 'Import Verse', href: '/verses/import-verses' },
        ]}
      />

      <View className='flex-1 px-[18px] py-4'>
        <View className='mb-4'>
          <Label nativeID='verseInput'>Paste verse text</Label>
          <TextInput
            className='mt-2 h-40 rounded-md border border-gray-300 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
            multiline
            numberOfLines={10}
            placeholder='Paste your verse here...'
            value={pastedText}
            onChangeText={setPastedText}
            textAlignVertical='top'
          />
          <ThemedText className='mt-1 text-xs text-gray-500'>
            Example: Bible verse text... Psalms 119:1 NKJV
          </ThemedText>
        </View>

        <CustomButton onPress={handleParse} className='mb-4'>
          Parse Verse
        </CustomButton>

        {error && (
          <View className='mb-4 rounded-md bg-red-100 p-3 dark:bg-red-900'>
            <ThemedText className='text-red-800 dark:text-red-200'>
              {error}
            </ThemedText>
          </View>
        )}

        {parsedVerse && (
          <View className='mb-4 rounded-md bg-green-100 p-4 dark:bg-green-900'>
            <ThemedText className='mb-2 font-semibold text-green-800 dark:text-green-200'>
              Parsed Successfully!
            </ThemedText>
            <ThemedText className='text-green-800 dark:text-green-200'>
              Book: {parsedVerse.bookName}
            </ThemedText>
            <ThemedText className='text-green-800 dark:text-green-200'>
              Chapter: {parsedVerse.chapter}
            </ThemedText>
            <ThemedText className='text-green-800 dark:text-green-200'>
              Verses: {parsedVerse.verses.join(', ')}
            </ThemedText>
            {parsedVerse.version && (
              <ThemedText className='text-green-800 dark:text-green-200'>
                Version: {parsedVerse.version}
              </ThemedText>
            )}
            <ScrollView className='mt-2 max-h-32'>
              {parsedVerse.verseTexts.map((vt, i) => (
                <ThemedText
                  key={i}
                  className='text-green-800 dark:text-green-200'
                >
                  {vt.verse}. {vt.text}
                </ThemedText>
              ))}
            </ScrollView>
          </View>
        )}

        {parsedVerse && (
          <View className='flex-row gap-2'>
            <CustomButton
              variant='outline'
              onPress={handleSaveToCollection}
              className='flex-1'
            >
              Add to Collection
            </CustomButton>
            <CustomButton onPress={handleSaveToVerses} className='flex-1'>
              Save to Verses
            </CustomButton>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ImportVerses;
