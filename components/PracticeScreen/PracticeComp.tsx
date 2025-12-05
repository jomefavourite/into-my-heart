import { View, Text, Platform } from 'react-native';
import React, { useState } from 'react';
import ThemedText from '../ThemedText';
import { Tabs, TabsContent, TabsList } from '../ui/tabs';
import CustomTabsTrigger from '../CustomTabsTrigger';
import { FlatList } from 'react-native';
import { ActivityIndicator } from 'react-native';
import CustomButton from '../CustomButton';
import { useRouter } from 'expo-router';
import { useGridListView } from '@/store/tab-store';
import { usePracticeStore } from '@/store/practiceStore';
import AddVersesEmpty from '../EmptyScreen/AddVersesEmpty';
import CollectionCard from '../Verses/CollectionCard';
import ItemSeparator from '../ItemSeparator';
import VerseCard from '../Verses/VerseCard';
import FlashCardIcon from '../icons/practice/FlashCardIcon';
import { api } from '@/convex/_generated/api';
import { usePaginatedQuery, useQuery } from 'convex-helpers/react/cache';
import { useAuth } from '@clerk/clerk-expo';
import FillInBlanksIcon from '../icons/practice/FillInBlanksIcon';
import { SvgProps } from 'react-native-svg';
import FlashListSkeletonLoader from '../FlashListSkeletonLoader';

export default function PracticeComp({ name }: { name: string }) {
  const { isSignedIn, isLoaded } = useAuth();
  // const {
  //   results: verses,
  //   isLoading,
  //   loadMore,
  // } = usePaginatedQuery(
  //   api.verses.getAllVerses,
  //   isSignedIn && isLoaded ? {} : 'skip',
  //   { initialNumItems: 10 }
  // );
  const verses = useQuery(
    api.verses.getVerses,
    isSignedIn && isLoaded ? {} : 'skip'
  );
  const collections = useQuery(
    api.collections.getCollections,
    isSignedIn && isLoaded ? {} : 'skip'
  );
  const totalVersesCount = useQuery(
    api.verses.getTotalVersesCount,
    isSignedIn && isLoaded ? {} : 'skip'
  );
  const totalCollectionsCount = useQuery(
    api.collections.getTotalCollectionsCount,
    isSignedIn && isLoaded ? {} : 'skip'
  );
  const [value, setValue] = useState('verses');
  const router = useRouter();
  const { gridView, setGridView } = useGridListView();
  const { setPracticeSession } = usePracticeStore();

  // const handleLoadMore = () => {
  //   if (!isLoading) {
  //     loadMore(2);
  //   }
  // };

  const practiceData: {
    [key: string]: { title: string; icon: React.ReactNode };
  } = {
    flashcards: {
      title: 'Practice verses using the Flashcards technique',
      icon: <FlashCardIcon />,
    },
    fillInBlanks: {
      title: 'Practice verses using the Fill in the blanks technique',
      icon: <FillInBlanksIcon />,
    },
  };
  return (
    <View className='flex-1 p-[18]'>
      <View className='flex-row items-center justify-between'>
        <ThemedText>{practiceData[name].title}</ThemedText>

        {
          practiceData[name as keyof typeof practiceData]
            .icon as React.ReactNode
        }
      </View>

      <Tabs
        value={value}
        onValueChange={setValue}
        className='mx-auto w-full flex-1 flex-col gap-4'
      >
        <TabsList className='w-full flex-row'>
          <CustomTabsTrigger value='verses' activeValue={value}>
            Verses
          </CustomTabsTrigger>
          <CustomTabsTrigger value='collections' activeValue={value}>
            Collections
          </CustomTabsTrigger>
        </TabsList>

        <TabsContent value='verses' className='flex-1'>
          <View className='flex-1 gap-3'>
            <ThemedText className='text-[13px]'>
              {totalVersesCount ?? 0} verses
            </ThemedText>

            <View
              className='flex-1'
              style={{ minHeight: Platform.OS === 'web' ? 400 : undefined }}
            >
              {verses === undefined ? (
                <FlashListSkeletonLoader type='verses' gridView={gridView} />
              ) : (
                <FlatList
                  key={gridView ? 'grid-myverses' : 'list-myverses'}
                  data={verses}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={gridView ? 2 : 1}
                  ListEmptyComponent={() => (
                    <>
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
                      containerClassName={gridView ? 'flex-1' : 'w-full'}
                      canCheck={false}
                    />
                  )}
                  columnWrapperStyle={
                    gridView ? { gap: 8, width: '100%' } : undefined
                  }
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={true}
                  // onEndReached={handleLoadMore}
                  onEndReachedThreshold={0.1}
                  // ListFooterComponent={() =>
                  //   isLoading ? <ActivityIndicator /> : null
                  // }
                  style={{ flex: 1 }}
                  contentContainerStyle={{ flexGrow: 1 }}
                />
              )}
            </View>

            <CustomButton
              onPress={() => {
                if (verses && verses.length > 0) {
                  setPracticeSession(verses, 'verses');
                  router.push(
                    name === 'flashcards'
                      ? '/memorize/flashcards/practice'
                      : '/memorize/fill-in-blanks/practice'
                  );
                }
              }}
              disabled={!verses || verses.length === 0}
            >
              Start Verses Practice
            </CustomButton>
          </View>
        </TabsContent>
        <TabsContent value='collections' className='flex-1'>
          <View className='flex-1 gap-3'>
            <ThemedText className='text-[13px]'>
              {totalCollectionsCount ?? 0} collections
            </ThemedText>

            <View
              className='flex-1'
              style={{ minHeight: Platform.OS === 'web' ? 400 : undefined }}
            >
              {collections === undefined ? (
                <FlashListSkeletonLoader
                  type='collections'
                  gridView={gridView}
                />
              ) : (
                <FlatList
                  key={gridView ? 'grid-collections' : 'list-collections'}
                  data={collections || []}
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
                      containerClassName={gridView ? 'flex-1' : 'w-full'}
                      canCheck={false}
                    />
                  )}
                  columnWrapperStyle={
                    gridView ? { gap: 8, width: '100%' } : undefined
                  }
                  ItemSeparatorComponent={ItemSeparator}
                />
              )}
            </View>

            <CustomButton
              onPress={() => {
                // Get all verses from all collections
                const allCollectionVerses =
                  collections?.flatMap(
                    collection => collection.collectionVerses
                  ) || [];

                if (allCollectionVerses.length === 0) {
                  // Show an alert or message that no collections are available
                  return;
                }

                setPracticeSession(allCollectionVerses, 'collections');
                router.push(
                  name === 'flashcards'
                    ? '/memorize/flashcards/practice'
                    : '/memorize/fill-in-blanks/practice'
                );
              }}
              disabled={
                !collections ||
                collections.length === 0 ||
                collections.every(c => c.collectionVerses.length === 0)
              }
            >
              Start Collections Practice
            </CustomButton>
          </View>
        </TabsContent>
      </Tabs>
    </View>
  );
}
