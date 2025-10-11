import { FlatList, StyleSheet, View, ScrollView } from 'react-native';
import React, { memo } from 'react';
import VerseCard from '@/components/Verses/VerseCard';
import { verses } from '@/lib/utils';
import ThemedText from '../ThemedText';
import ItemSeparator from '../ItemSeparator';
// import { useQuery } from 'convex/react';
import { useQuery } from 'convex-helpers/react/cache';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import CollectionCard from './CollectionCard';
import CollectionSuggestionCard from './CollectionSuggestionCard';
import AddVersesEmpty from '../EmptyScreen/AddVersesEmpty';
import SuggestionEmpty from '../EmptyScreen/SuggestionEmpty';
import { Button } from '../ui/button';
import { useRouter } from 'expo-router';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import FlashListSkeletonLoader from '../FlashListSkeletonLoader';
import { useAuthGuard } from '@/hooks/useAuthGuard';

type CollectionsTabProps = {
  gridView: boolean;
};

const CollectionsTab = ({ gridView }: CollectionsTabProps) => {
  const { canMakeQueries, isLoading } = useAuthGuard();
  const getCollections = useQuery(
    api.collections.getCollections,
    canMakeQueries ? { take: 5 } : 'skip'
  );
  const collectionSuggestions = useQuery(
    api.collectionSuggestions.getCollectionsSuggestion,
    canMakeQueries ? { take: 5 } : 'skip'
  );

  const addCollectionSuggestionToUser = useMutation(
    api.collectionSuggestions.addCollectionSuggestionToUser
  );

  const router = useRouter();

  const handleAddCollectionSuggestion = async (collectionData: any) => {
    try {
      await addCollectionSuggestionToUser({
        suggestionId: collectionData._id,
      });
      // The UI will automatically update due to Convex reactivity
    } catch (error) {
      console.error('Error adding collection suggestion:', error);
      // You might want to show an alert here
    }
  };

  // console.log(getVerses, 'getVerses');

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

        {isLoading ? (
          <FlashListSkeletonLoader type='collections' gridView={gridView} />
        ) : (
          <FlatList
            key={gridView ? 'grid-myverses' : 'list-myverses'}
            data={getCollections}
            keyExtractor={(item, index) => index.toString()}
            numColumns={gridView ? 2 : 1}
            ListEmptyComponent={() => (
              <>
                <AddVersesEmpty collection />
              </>
            )}
            renderItem={({ item }) => (
              <CollectionCard
                _id={item._id}
                collectionName={item.collectionName}
                versesLength={item.versesLength}
                onAddPress={() => console.log(`${item} pressed`)}
                containerClassName={gridView ? 'w-[50%]' : 'w-full'}
                canCheck={false}
              />
            )}
            columnWrapperStyle={
              gridView ? { justifyContent: 'space-between', gap: 8 } : undefined
            }
            ItemSeparatorComponent={ItemSeparator}
            scrollEnabled={false}
          />
        )}
      </View>

      <View>
        <ThemedText className='py-2 text-lg font-semibold'>
          Collection Suggestions
        </ThemedText>

        {isLoading ? (
          <FlashListSkeletonLoader type='collections' gridView={gridView} />
        ) : (
          <FlatList
            key={gridView ? 'grid-suggestions' : 'list-suggestions'}
            data={collectionSuggestions}
            keyExtractor={(item, index) => index.toString()}
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
                _id={item._id}
                collectionName={item.collectionName}
                versesLength={item.versesLength}
                collectionVerses={item.collectionVerses}
                onAddPress={() => handleAddCollectionSuggestion(item)}
                containerClassName={gridView ? 'w-[50%]' : 'w-full'}
                canCheck={true}
              />
            )}
            columnWrapperStyle={
              // Apply gap between columns if gridView is true
              gridView ? { justifyContent: 'space-between', gap: 8 } : undefined
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
