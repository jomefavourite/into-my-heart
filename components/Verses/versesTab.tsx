import { FlatList, StyleSheet, View } from 'react-native';
import React, { memo } from 'react';
import VerseCard from '~/components/VerseCard';
import { verses } from '~/lib/constants';
import ThemedText from '../ThemedText';
import ItemSeparator from '../ItemSeparator';
import { useQuery } from 'convex/react';
import { api } from '~/convex/_generated/api';
import { Button } from '../ui/button';
import { useRouter } from 'expo-router';
import ArrowRightIcon from '../icons/ArrowRightIcon';

type VersesTabProps = {
  gridView: boolean;
};

const VersesTab = ({ gridView }: VersesTabProps) => {
  const getVerses = useQuery(api.verses.getVerses);
  const router = useRouter();

  // console.log(getVerses, 'getVerses');

  return (
    <View>
      <View>
        <View className='flex-row items-center justify-between'>
          <ThemedText size={18} variant='semibold' className='py-2'>
            My Verse
          </ThemedText>

          <Button
            size={'icon'}
            variant={'ghost'}
            onPress={() => router.push('/verses/all-verses')}
          >
            <ArrowRightIcon />
          </Button>
        </View>
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
          Verse Suggestions
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

export default memo(VersesTab);
