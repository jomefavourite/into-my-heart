import { FlatList, StyleSheet, View, ScrollView } from 'react-native';
import React, { memo } from 'react';
import VerseCard from '@/components/Verses/VerseCard';
import { verses } from '@/lib/utils';
import ThemedText from '../ThemedText';
import ItemSeparator from '../ItemSeparator';
// import { useQuery } from 'convex/react';
import { useQuery } from 'convex-helpers/react/cache';
import { api } from '@/convex/_generated/api';
import CollectionCard from './CollectionCard';
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
  const { canMakeQueries } = useAuthGuard();
  const getCollections = useQuery(
    api.collections.getCollections,
    canMakeQueries ? {} : 'skip'
  );
  const router = useRouter();

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
            className='flex-row'
          >
            <ThemedText className='pl-2 text-xs'>View all</ThemedText>
            <ArrowRightIcon />
          </Button>
        </View>

        {getCollections === undefined ? (
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
            scrollEnabled={true}
          />
        )}
      </View>

      <View>
        <ThemedText className='py-2 text-lg font-semibold'>
          Collection Suggestions
        </ThemedText>

        <FlatList
          key={gridView ? 'grid-suggestions' : 'list-suggestions'}
          data={verses}
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
            <VerseCard
              bookName={item.bookName}
              chapter={item.chapter}
              verses={item.verses}
              verseTexts={[{ verse: item.verses[0], text: item.reference }]}
              onAddPress={() => console.log(`${item.reference} pressed`)}
              containerClassName={gridView ? 'w-[50%]' : 'w-full'} // Keep this for card sizing
            />
          )}
          columnWrapperStyle={
            // Apply gap between columns if gridView is true
            gridView ? { justifyContent: 'space-between', gap: 8 } : undefined
          }
          ItemSeparatorComponent={ItemSeparator}
          scrollEnabled={true}
        />
      </View>
    </View>
  );
};

export default memo(CollectionsTab);
