import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Button } from '~/components/ui/button';
import { useRouter } from 'expo-router';
import RemoveCircleIcon from '~/components/icons/RemoveCircleIcon';
import BackHeader from '~/components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '~/convex/_generated/api';
import { usePaginatedQuery } from 'convex-helpers/react/cache';
import { FlatList } from 'react-native-gesture-handler';
import AddVersesEmpty from '~/components/EmptyScreen/AddVersesEmpty';
import VerseCard from '~/components/Verses/VerseCard';
import ItemSeparator from '~/components/ItemSeparator';
import ThemedText from '~/components/ThemedText';

const AllCollectionScreen = () => {
  const router = useRouter();
  const [gridView, setGridView] = useState<boolean>(false);

  const { results, status, loadMore } = usePaginatedQuery(
    api.collections.getAllCollections,
    {},
    { initialNumItems: 20 }
  );

  console.log(results, 'results');

  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        title='My Verses'
        RightComponent={
          <Button
            size={'icon'}
            variant={'ghost'}
            onPress={() => router.push('/verses/remove-verses')}
          >
            <RemoveCircleIcon />
          </Button>
        }
        items={[
          { label: 'Verses', href: '/verses' },
          { label: 'My Collections', href: '/verses/all-collections' },
        ]}
      />

      {/* <ThemedText size={18} variant='semibold' className='py-2'>
        All My Collections
      </ThemedText> */}

      <View className='flex-1 px-[18px]'>
        <FlatList
          key={gridView ? 'grid-myverses' : 'list-myverses'}
          data={results}
          keyExtractor={(item, index) => index.toString()}
          numColumns={gridView ? 2 : 1}
          ListEmptyComponent={() => (
            <>
              {/* Loading */}
              {/* <VerseCardSkeleton /> */}
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
      </View>
    </SafeAreaView>
  );
};

export default AllCollectionScreen;
