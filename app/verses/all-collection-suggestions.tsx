import { View, Platform, FlatList } from 'react-native';
import React from 'react';
import BackHeader from '@/components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddVersesEmpty from '@/components/EmptyScreen/AddVersesEmpty';
import ItemSeparator from '@/components/ItemSeparator';
import { useGridListView } from '@/store/tab-store';
import FlashListSkeletonLoader from '@/components/FlashListSkeletonLoader';
import CollectionSuggestionCard from '@/components/Verses/CollectionSuggestionCard';
import {
  useOfflineCollectionSuggestions,
  useOfflineSyncStatus,
} from '@/hooks/useOfflineData';
import { useOfflineDataStore } from '@/store/offlineDataStore';

const AllCollectionSuggestions = () => {
  const { gridView } = useGridListView();
  const addCollectionSuggestionToCollection = useOfflineDataStore(
    state => state.adoptCollectionSuggestionLocal
  );
  const results = useOfflineCollectionSuggestions();
  const { hasHydrated } = useOfflineSyncStatus();

  const handleAddCollectionSuggestion = async (collectionData: any) => {
    try {
      addCollectionSuggestionToCollection(collectionData.syncId);
    } catch (error) {
      console.error('Error adding collection suggestion:', error);
    }
  };

  return (
    <SafeAreaView className='flex-1'>
      {Platform.OS === 'web' && (
        <>
          <title>Collection Suggestions - Into My Heart</title>
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
        title={'Collection Suggestions'}
        items={[
          { label: 'Collections', href: '/verses' },
          {
            label: 'Collection Suggestions',
            href: '/verses/all-collection-suggestions',
          },
        ]}
      />

      <View className='flex-1 pb-[18px]'>
        {!hasHydrated ? (
          <FlashListSkeletonLoader type='collections' gridView={gridView} />
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
              <CollectionSuggestionCard
                _id={item.syncId}
                collectionName={item.collectionName}
                versesLength={item.versesLength}
                collectionVerses={item.collectionVerses}
                containerClassName={gridView ? 'flex-1' : 'w-full'}
                canCheck={true}
                onAddPress={() => handleAddCollectionSuggestion(item)}
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

export default AllCollectionSuggestions;
