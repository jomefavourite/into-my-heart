import { View, Platform, FlatList } from 'react-native';
import React, { useState, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/components/BackHeader';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Id } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';
import { usePaginatedQuery } from 'convex-helpers/react/cache';
import { useMutation, useQuery } from 'convex/react';
import { useAuth } from '@clerk/clerk-expo';
import ThemedText from '@/components/ThemedText';
import VerseCard from '@/components/Verses/VerseCard';
import ItemSeparator from '@/components/ItemSeparator';
import CustomButton from '@/components/CustomButton';
import { useGridListView } from '@/store/tab-store';
import FlashListSkeletonLoader from '@/components/FlashListSkeletonLoader';
import AddVersesEmpty from '@/components/EmptyScreen/AddVersesEmpty';
import { Button } from '@/components/ui/button';
import RemoveCircleIcon from '@/components/icons/RemoveCircleIcon';
import CancelIcon from '@/components/icons/CancelIcon';

const AddVersesToCollection = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { collectionId } = useLocalSearchParams();
  const router = useRouter();
  const { gridView } = useGridListView();
  const [shouldSelect, setShouldSelect] = useState(true); // Auto-enable selection mode
  const [selectedVerses, setSelectedVerses] = useState<Id<'verses'>[]>([]);

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.verses.getAllVerses,
    isSignedIn && isLoaded ? {} : 'skip',
    { initialNumItems: 20 }
  );

  // Fetch collection details to get the collection name
  const collection = useQuery(
    api.collections.getCollectionById,
    isSignedIn && isLoaded && collectionId
      ? { id: collectionId as Id<'collections'> }
      : 'skip'
  );

  const addVersesToCollection = useMutation(
    api.collections.addVersesToCollection
  );

  // Helper function to check if a verse already exists in the collection
  const isVerseInCollection = (verse: {
    bookName: string;
    chapter: number;
    verses: string[];
  }): boolean => {
    if (!collection?.collectionVerses) return false;

    return collection.collectionVerses.some(existingVerse => {
      // Check if bookName and chapter match
      if (
        existingVerse.bookName === verse.bookName &&
        existingVerse.chapter === verse.chapter
      ) {
        // Check if any verse numbers overlap
        return verse.verses.some(v => existingVerse.verses.includes(v));
      }
      return false;
    });
  };

  // Filter out verses that already exist in the collection
  const availableVerses = useMemo(() => {
    if (!results || !collection) return results || [];
    return results.filter(verse => !isVerseInCollection(verse));
  }, [results, collection]);

  const toggleSelectedVerse = (_id: Id<'verses'>) => {
    setSelectedVerses(prev =>
      prev.includes(_id) ? prev.filter(id => id !== _id) : [...prev, _id]
    );
  };

  const handleAddVerses = async () => {
    if (selectedVerses.length === 0) {
      return;
    }

    try {
      await addVersesToCollection({
        collectionId: collectionId as Id<'collections'>,
        verseIds: selectedVerses,
      });
      // Navigate back to collection page
      router.back();
    } catch (error) {
      console.error('Error adding verses to collection:', error);
      // You might want to show an alert here
    }
  };

  const RightComponent = (
    <View className='flex flex-row gap-2'>
      {!shouldSelect && (
        <Button
          size={'icon'}
          variant={'ghost'}
          onPress={() => setShouldSelect(true)}
        >
          <RemoveCircleIcon />
        </Button>
      )}

      {Platform.OS === 'web' && shouldSelect ? (
        <Button
          size={'icon'}
          variant={'ghost'}
          onPress={() => {
            setShouldSelect(false);
            setSelectedVerses([]);
          }}
        >
          <CancelIcon />
        </Button>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView className='flex-1'>
      {Platform.OS === 'web' && (
        <>
          <title>Add Verses to Collection - Into My Heart</title>
          <meta
            name='description'
            content='Select verses to add to your collection.'
          />
        </>
      )}

      <BackHeader
        title={
          shouldSelect
            ? collection
              ? `Select Verses for ${collection.collectionName}`
              : 'Select Verses'
            : 'Add Verses to Collection'
        }
        BreadcrumbRightComponent={RightComponent}
        LiftComponent={
          shouldSelect ? (
            <Button
              size={'icon'}
              variant={'ghost'}
              onPress={() => {
                setShouldSelect(false);
                setSelectedVerses([]);
              }}
            >
              <CancelIcon />
            </Button>
          ) : null
        }
        RightComponent={RightComponent}
        items={[
          { label: 'Verses', href: '/verses' },
          {
            label: 'Add Verses to Collection',
            href: '/verses/add-verses-to-collection',
          },
        ]}
      />

      <View className='flex-1 justify-between px-[18px] pb-[18px]'>
        {isLoading && results?.length === 0 ? (
          <FlashListSkeletonLoader type='verses' gridView={gridView} />
        ) : (
          <FlatList
            key={gridView ? 'grid-myverses' : 'list-myverses'}
            data={availableVerses}
            keyExtractor={(item, index) => index.toString()}
            numColumns={gridView ? 2 : 1}
            ListEmptyComponent={() => (
              <>
                <AddVersesEmpty />
              </>
            )}
            renderItem={({ item }) => (
              <VerseCard
                _id={item._id}
                bookName={item.bookName}
                chapter={item.chapter}
                verses={item.verses}
                verseTexts={item.verseTexts}
                containerClassName={gridView ? 'flex-1' : 'w-full'}
                canCheck={false}
                canDelete={shouldSelect}
                onDeletePress={() => toggleSelectedVerse(item._id)}
                isSelectedForDelete={selectedVerses.includes(item._id)}
                noRoute={true}
              />
            )}
            columnWrapperStyle={
              gridView ? { gap: 8, width: '100%' } : undefined
            }
            ItemSeparatorComponent={ItemSeparator}
            onEndReached={() => {
              if (status === 'CanLoadMore') {
                loadMore(20);
              }
            }}
          />
        )}

        {shouldSelect && (
          <View className='my-5'>
            <CustomButton
              disabled={selectedVerses.length === 0}
              onPress={handleAddVerses}
            >
              {(() => {
                const verseText =
                  selectedVerses.length > 0 ? `${selectedVerses.length} ` : '';
                const pluralText = selectedVerses.length !== 1 ? 's' : '';
                const collectionText = collection
                  ? ` to ${collection.collectionName}`
                  : ' to Collection';
                return `Add ${verseText}Verse${pluralText}${collectionText}`;
              })()}
            </CustomButton>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AddVersesToCollection;
