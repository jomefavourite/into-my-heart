import { View, Platform, FlatList } from 'react-native';
import React from 'react';
import BackHeader from '@/components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddVersesEmpty from '@/components/EmptyScreen/AddVersesEmpty';
import VerseCard from '@/components/Verses/VerseCard';
import ItemSeparator from '@/components/ItemSeparator';
import { useGridListView } from '@/store/tab-store';
import FlashListSkeletonLoader from '@/components/FlashListSkeletonLoader';
import {
  useOfflineSyncStatus,
  useOfflineVerseSuggestions,
} from '@/hooks/useOfflineData';
import { useOfflineDataStore } from '@/store/offlineDataStore';

const AllVersesSuggestion = () => {
  const { gridView } = useGridListView();
  const addVerseSuggestionToUser = useOfflineDataStore(
    state => state.adoptVerseSuggestionLocal
  );
  const results = useOfflineVerseSuggestions(50);
  const { hasHydrated } = useOfflineSyncStatus();

  const handleAddVerseSuggestion = async (verseData: any) => {
    try {
      addVerseSuggestionToUser(verseData.syncId);
    } catch (error) {
      console.error('Error adding verse suggestion:', error);
    }
  };

  return (
    <SafeAreaView className='flex-1'>
      {Platform.OS === 'web' && (
        <>
          <title>Verse Suggestions - Into My Heart</title>
          <meta
            name='description'
            content='Browse curated Bible verse suggestions. Discover new verses to memorize and study.'
          />
          <meta
            name='keywords'
            content='Bible, memorization, verses, flashcards, practice, Christian, faith, scripture'
          />
          <meta name='author' content='Into My Heart' />
          <meta name='robots' content='index, follow' />
          <meta property='og:type' content='website' />
          <meta property='og:site_name' content='Into My Heart' />
          <meta property='og:locale' content='en_US' />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='theme-color' content='#313131' />
          <meta name='msapplication-TileColor' content='#313131' />
        </>
      )}

      <BackHeader
        title={'Verse Suggestions'}
        items={[
          { label: 'Verses', href: '/verses' },
          {
            label: 'Verse Suggestions',
            href: '/verses/all-verses-suggestions',
          },
        ]}
      />

      <View className='flex-1 pb-[18px]'>
        {!hasHydrated ? (
          <FlashListSkeletonLoader type='verses' gridView={gridView} />
        ) : (
          <FlatList
            key={gridView ? 'grid-myverses' : 'list-myverses'}
            data={results}
            keyExtractor={(_item, index) => index.toString()}
            contentContainerStyle={{ paddingHorizontal: 18 }}
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
                canCheck={true}
                onAddPress={() => handleAddVerseSuggestion(item)}
              />
            )}
            columnWrapperStyle={
              gridView ? { gap: 8, width: '100%' } : undefined
            }
            ItemSeparatorComponent={ItemSeparator}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default AllVersesSuggestion;
