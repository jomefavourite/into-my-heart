import { FlatList, StyleSheet, View } from 'react-native';
import React, { memo } from 'react';
import VerseCard from '~/components/VerseCard';
import { verses } from '~/lib/constants';
import ThemedText from '../ThemedText';
import ItemSeparator from '../ItemSeparator';
import { useQuery } from 'convex/react';
import { api } from '~/convex/_generated/api';

type CollectionsTabProps = {
  gridView: boolean;
};

const CollectionsTab = ({ gridView }: CollectionsTabProps) => {
  const getVerses = useQuery(api.verses.getVerses);

  // console.log(getVerses, 'getVerses');

  return (
    <View>
      <View>
        <ThemedText size={18} variant='semibold' className='py-2'>
          My Collections
        </ThemedText>

        <FlatList
          key={gridView ? 'grid-myverses' : 'list-myverses'}
          data={getVerses}
          keyExtractor={(item, index) => index.toString()}
          numColumns={gridView ? 2 : 1}
          renderItem={({ item }) => (
            <VerseCard
              bookName={item.bookName}
              chapter={item.chapter}
              verses={item.verses}
              text={'hello'}
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
