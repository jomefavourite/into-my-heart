import { FlatList, View } from 'react-native';
import React, { memo } from 'react';
import ThemedText from '../ThemedText';
import ItemSeparator from '../ItemSeparator';
import CollectionCard from './CollectionCard';
import CollectionSuggestionCard from './CollectionSuggestionCard';
import AddVersesEmpty from '../EmptyScreen/AddVersesEmpty';
import SuggestionEmpty from '../EmptyScreen/SuggestionEmpty';
import { Button } from '../ui/button';
import { useRouter } from 'expo-router';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import FlashListSkeletonLoader from '../FlashListSkeletonLoader';
import {
  useOfflineCollectionSuggestions,
  useOfflineCollections,
  useOfflineSyncStatus,
} from '@/hooks/useOfflineData';
import { useOfflineDataStore } from '@/store/offlineDataStore';

type CollectionsTabProps = {
  gridView: boolean;
};

const CollectionsTab = ({ gridView }: CollectionsTabProps) => {
  const getCollections = useOfflineCollections(5);
  const collectionSuggestions = useOfflineCollectionSuggestions(5);
  const addCollectionSuggestionToUser = useOfflineDataStore(
    state => state.adoptCollectionSuggestionLocal
  );
  const { hasHydrated } = useOfflineSyncStatus();
  const router = useRouter();

  const handleAddCollectionSuggestion = async (collectionData: any) => {
    try {
      addCollectionSuggestionToUser(collectionData.syncId);
    } catch (error) {
      console.error('Error adding collection suggestion:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View>
        <View className='flex-row items-center justify-between'>
          <ThemedText className='py-2 text-lg font-semibold'>
            My Collections
          </ThemedText>

          <Button
            size={'icon'}
            variant={'ghost'}
            onPress={() => router.push('/verses/all-collections')}
            className='flex-row gap-0'
          >
            <ThemedText className='pl-2 text-xs'>View all</ThemedText>
            <ArrowRightIcon />
          </Button>
        </View>

        {!hasHydrated ? (
          <FlashListSkeletonLoader type='collections' gridView={gridView} />
        ) : (
          <FlatList
            key={gridView ? 'grid-myverses' : 'list-myverses'}
            data={getCollections}
            keyExtractor={(_item, index) => index.toString()}
            numColumns={gridView ? 2 : 1}
            ListEmptyComponent={() => (
              <>
                <AddVersesEmpty collection />
              </>
            )}
            renderItem={({ item }) => (
              <CollectionCard
                _id={item.syncId}
                collectionName={item.collectionName}
                versesLength={item.versesLength}
                onAddPress={() => console.log(`${item} pressed`)}
                containerClassName={gridView ? 'flex-1' : 'w-full'}
                canCheck={false}
              />
            )}
            columnWrapperStyle={
              gridView ? { gap: 8, width: '100%' } : undefined
            }
            ItemSeparatorComponent={ItemSeparator}
            scrollEnabled={false}
          />
        )}
      </View>

      <View>
        <View className='flex-row items-center justify-between'>
          <ThemedText className='py-2 text-lg font-semibold'>
            Collection Suggestions
          </ThemedText>

          <Button
            size={'icon'}
            variant={'ghost'}
            onPress={() => router.push('/verses/all-collection-suggestions')}
            className='flex-row gap-0'
          >
            <ThemedText className='pl-2 text-xs'>View all</ThemedText>
            <ArrowRightIcon />
          </Button>
        </View>

        {!hasHydrated ? (
          <FlashListSkeletonLoader type='collections' gridView={gridView} />
        ) : (
          <FlatList
            key={gridView ? 'grid-suggestions' : 'list-suggestions'}
            data={collectionSuggestions}
            keyExtractor={(_item, index) => index.toString()}
            numColumns={gridView ? 2 : 1}
            ListEmptyComponent={() => (
              <>
                {/* Loading */}
                {/* <VerseCardSkeleton /> */}
                <SuggestionEmpty collection />
              </>
            )}
            renderItem={({ item }) => (
              <CollectionSuggestionCard
                _id={item.syncId}
                collectionName={item.collectionName}
                versesLength={item.versesLength}
                collectionVerses={item.collectionVerses}
                onAddPress={() => handleAddCollectionSuggestion(item)}
                containerClassName={gridView ? 'flex-1' : 'w-full'}
                canCheck={true}
              />
            )}
            columnWrapperStyle={
              gridView ? { gap: 8, width: '100%' } : undefined
            }
            ItemSeparatorComponent={ItemSeparator}
            scrollEnabled={true}
          />
        )}
      </View>
    </View>
  );
};

export default memo(CollectionsTab);
