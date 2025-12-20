import { View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/components/BackHeader';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ThemedText from '@/components/ThemedText';
import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import AddIcon from '@/components/icons/AddIcon';
import { FlatList } from 'react-native';
import { useBookStore } from '@/store/bookStore';
import VerseCard from '@/components/Verses/VerseCard';
import ItemSeparator from '@/components/ItemSeparator';
import CustomButton from '@/components/CustomButton';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import AddVersesEmpty from '@/components/EmptyScreen/AddVersesEmpty';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useIsCollOrVerse } from '@/store/tab-store';
import { Id } from '@/convex/_generated/dataModel';
import { useLocalSearchParams } from 'expo-router';

const CreateCollection = () => {
  const router = useRouter();
  const { collectionId, moveVerses } = useLocalSearchParams();

  const {
    collectionName,
    collectionVerses,
    setCollectionName,
    setVerses,
    resetAll,
    isCollectionUpdate,
    selectedVerseIds,
    setCollectionVersesArray,
    removeCollectionVerse,
  } = useBookStore();

  const addCollection = useMutation(api.collections.addCollection);
  const updateCollection = useMutation(api.collections.updateCollection);
  const addVersesToCollection = useMutation(
    api.collections.addVersesToCollection
  );

  const { setIsCollOrVerse } = useIsCollOrVerse();

  const [hasInputError, setHasInputError] = useState(false);
  const [isMovingVerses, setIsMovingVerses] = useState(false);

  // If we're moving verses to an existing collection, fetch the collection data
  const existingCollection = useQuery(
    api.collections.getCollectionById,
    collectionId && moveVerses
      ? { id: collectionId as Id<'collections'> }
      : 'skip'
  );

  // Fetch selected verses when moving verses
  const selectedVerses = useQuery(
    api.verses.getVersesByIds,
    moveVerses === 'true' && selectedVerseIds.length > 0
      ? { ids: selectedVerseIds as Id<'verses'>[] }
      : 'skip'
  );

  // Handle moving verses to existing collection
  useEffect(() => {
    if (moveVerses === 'true' && collectionId && existingCollection) {
      setCollectionName(existingCollection.collectionName);
      setIsMovingVerses(true);

      // Combine existing collection verses with selected verses
      const existingVerses = existingCollection.collectionVerses || [];
      const newVerses = selectedVerses
        ? selectedVerses.map(verse => ({
            bookName: verse.bookName,
            chapter: verse.chapter,
            verses: verse.verses,
            reviewFreq: verse.reviewFreq ?? '',
            verseTexts: verse.verseTexts,
          }))
        : [];

      setCollectionVersesArray([...existingVerses, ...newVerses]);
    }
  }, [
    moveVerses,
    collectionId,
    existingCollection,
    selectedVerses,
    setCollectionName,
    setCollectionVersesArray,
  ]);

  // Handle creating new collection with selected verses
  useEffect(() => {
    if (moveVerses === 'true' && !collectionId && selectedVerses) {
      setIsMovingVerses(true);

      // Convert selected verses to collection format
      const newVerses = selectedVerses.map(verse => ({
        bookName: verse.bookName,
        chapter: verse.chapter,
        verses: verse.verses,
        reviewFreq: verse.reviewFreq ?? '',
        verseTexts: verse.verseTexts,
      }));

      setCollectionVersesArray(newVerses);
    }
  }, [moveVerses, collectionId, selectedVerses, setCollectionVersesArray]);

  const handleRemoveVerse = (index: number) => {
    removeCollectionVerse(index);
  };

  const handleCreateCollection = async () => {
    if (!collectionName) {
      setHasInputError(true);
      return;
    }

    setHasInputError(false);

    try {
      if (isMovingVerses && collectionId) {
        // Moving verses to existing collection - update the collection with combined verses
        const mappedCollectionVerses = collectionVerses.map(verse => ({
          ...verse,
          reviewFreq: verse.reviewFreq ?? '',
        }));

        await updateCollection({
          id: collectionId as Id<'collections'>,
          collectionName,
          collectionVerses: mappedCollectionVerses,
          // versesLength: mappedCollectionVerses.length,
        });
        resetAll();
        router.push('/verses#collections');
      } else if (isCollectionUpdate) {
        // Updating existing collection
        const mappedCollectionVerses = collectionVerses.map(verse => ({
          ...verse,
          reviewFreq: verse.reviewFreq ?? '',
        }));

        await updateCollection({
          id: collectionId as Id<'collections'>,
          collectionName,
          collectionVerses: mappedCollectionVerses,
          // versesLength: mappedCollectionVerses.length,
        });
        resetAll();
        router.push('/verses#collections');
      } else {
        // Creating new collection
        const mappedCollectionVerses = collectionVerses.map(verse => ({
          ...verse,
          reviewFreq: verse.reviewFreq ?? '',
        }));

        const payload = {
          collectionName,
          collectionVerses: mappedCollectionVerses,
        };

        await addCollection(payload);
        resetAll();
        router.push('/verses#collections');
      }
    } catch (error) {
      console.error('Error handling collection:', error);
    }
  };
  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        title={isMovingVerses ? 'Add to Collection' : 'Create Collection'}
        items={[
          { label: 'Verses', href: '/verses' },
          {
            label: isMovingVerses ? 'Add to Collection' : 'Create Collection',
            href: '/verses/create-collection',
          },
        ]}
      />

      <View className='flex-1 px-[18px]'>
        <View className='gap-1 pb-3'>
          <Label nativeID='collectionName'>Collection name</Label>
          <Input
            aria-aria-labelledby='collectionName'
            defaultValue={collectionName}
            placeholder='Enter goal name'
            className={`dark:text-white ${hasInputError ? 'border border-red-500' : ''}`}
            onChangeText={text => {
              setCollectionName(text);
              if (hasInputError && text.trim()) setHasInputError(false);
            }}
          />
          {hasInputError && (
            <ThemedText className='mt-1 text-xs text-red-500'>
              Collection name is required
            </ThemedText>
          )}
        </View>

        <View className='flex-row items-center justify-between'>
          <ThemedText>Verses</ThemedText>

          {!isMovingVerses && (
            <Button
              size={'icon'}
              variant={'ghost'}
              onPress={() => {
                setIsCollOrVerse('collections');
                setVerses([]); // Clear any existing verses before starting new selection
                router.push('/verses/select-book');
              }}
            >
              <AddIcon stroke='white' />
            </Button>
          )}
        </View>

        <View className='flex-1 justify-between'>
          {collectionVerses.length < 1 && <AddVersesEmpty collection />}

          <FlatList
            data={collectionVerses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <VerseCard
                // _id={item._id}
                bookName={item.bookName}
                chapter={item.chapter}
                verses={item.verses}
                verseTexts={item.verseTexts}
                onAddPress={() => console.log(`${item} pressed`)}
                canCheck={false}
                collectionDelete={true}
                onCollectionDeletePress={() => handleRemoveVerse(index)}
                // containerClassName={gridView ? 'w-[50%]' : 'w-full'}
              />
            )}
            ItemSeparatorComponent={ItemSeparator}
          />

          <View className='my-5'>
            <CustomButton
              disabled={collectionVerses.length < 1}
              onPress={handleCreateCollection}
            >
              {isMovingVerses ? 'Add to Collection' : 'Create Collection'}
            </CustomButton>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateCollection;
