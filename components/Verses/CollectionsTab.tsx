import { FlatList, StyleSheet, View } from 'react-native';
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
import { useConvexAuth } from 'convex/react';

type CollectionsTabProps = {
  gridView: boolean;
};

const CollectionsTab = ({ gridView }: CollectionsTabProps) => {
  const { isAuthenticated } = useConvexAuth();
  const getCollections = useQuery(
    api.collections.getCollections,
    isAuthenticated ? {} : 'skip'
  );
  const router = useRouter();

  // console.log(getVerses, 'getVerses');

  return (
    <View>
      <View>
        <View className='flex-row items-center justify-between'>
          <ThemedText size={18} variant='semibold' className='py-2'>
            My Collections
          </ThemedText>

          <Button
            size={'icon'}
            variant={'ghost'}
            onPress={() => router.push('/verses/all-collections')}
            className='flex-row '
          >
            <ThemedText size={12} className='pl-2'>
              View all
            </ThemedText>
            <ArrowRightIcon />
          </Button>
        </View>

        <FlatList
          key={gridView ? 'grid-myverses' : 'list-myverses'}
          data={getCollections}
          keyExtractor={(item, index) => index.toString()}
          numColumns={gridView ? 2 : 1}
          ListEmptyComponent={() => (
            <>
              {/* Loading */}
              {/* <VerseCardSkeleton /> */}
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
          // contentContainerStyle={
          //   gridView
          //     ? { paddingVertical: 8, paddingHorizontal: 16 }
          //     : { paddingVertical: 8, paddingHorizontal: 16 }
          // }
          scrollEnabled={false}
        />
      </View>

      <View>
        <ThemedText size={18} variant='semibold' className='py-2'>
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
              reference={item.reference}
              text={item.text}
              onAddPress={() => console.log(`${item.text} pressed`)}
              containerClassName={gridView ? 'w-[50%]' : 'w-full'} // Keep this for card sizing
            />
          )}
          columnWrapperStyle={
            // Apply gap between columns if gridView is true
            gridView ? { justifyContent: 'space-between', gap: 8 } : undefined
          }
          ItemSeparatorComponent={ItemSeparator}
          // contentContainerStyle={
          //   gridView
          //     ? { paddingVertical: 8, paddingHorizontal: 16 }
          //     : { paddingVertical: 8, paddingHorizontal: 16 }
          // }
          scrollEnabled={false}
        />
      </View>
    </View>
  );
};

export default memo(CollectionsTab);

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: 500,
  },
});
