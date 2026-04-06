import { View, Platform, FlatList } from 'react-native';
import React, { useState, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/components/BackHeader';
import { useLocalSearchParams, useRouter } from 'expo-router';
import VerseCard from '@/components/Verses/VerseCard';
import ItemSeparator from '@/components/ItemSeparator';
import CustomButton from '@/components/CustomButton';
import { useGridListView } from '@/store/tab-store';
import AddVersesEmpty from '@/components/EmptyScreen/AddVersesEmpty';
import { Button } from '@/components/ui/button';
import RemoveCircleIcon from '@/components/icons/RemoveCircleIcon';
import CancelIcon from '@/components/icons/CancelIcon';
import { useOfflineCollection, useOfflineVerses } from '@/hooks/useOfflineData';
import { useOfflineDataStore } from '@/store/offlineDataStore';

const AddVersesToCollection = () => {
  const { collectionId } = useLocalSearchParams();
  const router = useRouter();
  const { gridView } = useGridListView();
  const [shouldSelect, setShouldSelect] = useState(true); // Auto-enable selection mode
  const [selectedVerses, setSelectedVerses] = useState<string[]>([]);
  const results = useOfflineVerses();
  const collection = useOfflineCollection(collectionId);
  const saveCollectionLocal = useOfflineDataStore(
    state => state.saveCollectionLocal
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
    if (!collection) return results || [];
    return results.filter(verse => !isVerseInCollection(verse));
  }, [results, collection]);

  const toggleSelectedVerse = (_id: string) => {
    setSelectedVerses(prev =>
      prev.includes(_id) ? prev.filter(id => id !== _id) : [...prev, _id]
    );
  };

  const handleAddVerses = async () => {
    if (selectedVerses.length === 0 || !collection) {
      return;
    }

    try {
      const selectedVerseEntries = results.filter(verse =>
        selectedVerses.includes(verse.syncId)
      );

      saveCollectionLocal({
        syncId: collection.syncId,
        remoteId: collection.remoteId,
        collectionName: collection.collectionName,
        collectionVerses: [
          ...collection.collectionVerses,
          ...selectedVerseEntries.map(verse => ({
            bookName: verse.bookName,
            chapter: verse.chapter,
            verses: verse.verses,
            reviewFreq: verse.reviewFreq,
            verseTexts: verse.verseTexts,
            importSource: verse.importSource,
          })),
        ],
      });
      router.back();
    } catch (error) {
      console.error('Error adding verses to collection:', error);
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
        {availableVerses.length === 0 ? (
          <FlatList
            key={gridView ? 'grid-myverses' : 'list-myverses'}
            data={availableVerses}
            keyExtractor={(_item, index) => index.toString()}
            numColumns={gridView ? 2 : 1}
            ListEmptyComponent={() => (
              <>
                <AddVersesEmpty />
              </>
            )}
            renderItem={({ item }) => (
              <VerseCard
                _id={item.syncId}
                bookName={item.bookName}
                chapter={item.chapter}
                verses={item.verses}
                verseTexts={item.verseTexts}
                containerClassName={gridView ? 'flex-1' : 'w-full'}
                canCheck={false}
                canDelete={shouldSelect}
                onDeletePress={() => toggleSelectedVerse(item.syncId)}
                isSelectedForDelete={selectedVerses.includes(item.syncId)}
                noRoute={true}
              />
            )}
            columnWrapperStyle={
              gridView ? { gap: 8, width: '100%' } : undefined
            }
            ItemSeparatorComponent={ItemSeparator}
          />
        ) : (
          <FlatList
            key={gridView ? 'grid-myverses' : 'list-myverses'}
            data={availableVerses}
            keyExtractor={(_item, index) => index.toString()}
            numColumns={gridView ? 2 : 1}
            renderItem={({ item }) => (
              <VerseCard
                _id={item.syncId}
                bookName={item.bookName}
                chapter={item.chapter}
                verses={item.verses}
                verseTexts={item.verseTexts}
                containerClassName={gridView ? 'flex-1' : 'w-full'}
                canCheck={false}
                canDelete={shouldSelect}
                onDeletePress={() => toggleSelectedVerse(item.syncId)}
                isSelectedForDelete={selectedVerses.includes(item.syncId)}
                noRoute={true}
              />
            )}
            columnWrapperStyle={
              gridView ? { gap: 8, width: '100%' } : undefined
            }
            ItemSeparatorComponent={ItemSeparator}
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
