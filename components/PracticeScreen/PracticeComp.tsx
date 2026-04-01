import { View, Platform, FlatList } from 'react-native';
import React, { useMemo, useState } from 'react';
import ThemedText from '../ThemedText';
import { Tabs, TabsContent, TabsList } from '../ui/tabs';
import CustomTabsTrigger from '../CustomTabsTrigger';
import CustomButton from '../CustomButton';
import { useRouter } from 'expo-router';
import { useGridListView } from '@/store/tab-store';
import { usePracticeStore } from '@/store/practiceStore';
import AddVersesEmpty from '../EmptyScreen/AddVersesEmpty';
import CollectionCard from '../Verses/CollectionCard';
import ItemSeparator from '../ItemSeparator';
import VerseCard from '../Verses/VerseCard';
import FlashCardIcon from '../icons/practice/FlashCardIcon';
import FillInBlanksIcon from '../icons/practice/FillInBlanksIcon';
import RecitationIcon from '../icons/practice/RecitationIcon';
import FlashListSkeletonLoader from '../FlashListSkeletonLoader';
import { STARTER_FILL_IN_THE_BLANKS_VERSES } from '@/lib/starterVerses';
import {
  useOfflineCollections,
  useOfflineSyncStatus,
  useOfflineVerses,
} from '@/hooks/useOfflineData';
import {
  getPracticeMethodMeta,
  type PracticeMethod,
} from '@/lib/practiceFlow';

export default function PracticeComp({ name }: { name: PracticeMethod }) {
  const verses = useOfflineVerses();
  const collections = useOfflineCollections();
  const totalVersesCount = verses.length;
  const totalCollectionsCount = collections.length;
  const { hasHydrated } = useOfflineSyncStatus();
  const [value, setValue] = useState('verses');
  const router = useRouter();
  const { gridView } = useGridListView();
  const { setPracticeSession } = usePracticeStore();
  const practiceMeta = getPracticeMethodMeta(name);

  const versesForCurrentTechnique = useMemo(() => {
    if (verses === undefined) {
      return undefined;
    }

    if (name === 'fillInBlanks' && verses.length === 0) {
      return STARTER_FILL_IN_THE_BLANKS_VERSES.slice(0, practiceMeta.verseLimit);
    }

    return verses.slice(0, practiceMeta.verseLimit);
  }, [name, practiceMeta.verseLimit, verses]);

  const usingStarterVerses =
    name === 'fillInBlanks' && verses !== undefined && verses.length === 0;
  const sessionVerseCount = versesForCurrentTechnique?.length ?? 0;

  const isLimitedSession =
    verses !== undefined && totalVersesCount > practiceMeta.verseLimit;

  // const handleLoadMore = () => {
  //   if (!isLoading) {
  //     loadMore(2);
  //   }
  // };

  const practiceData: {
    [key: string]: { title: string; icon: React.ReactNode };
  } = {
    flashcards: {
      title: 'Start with references and recall the verse before you flip',
      icon: <FlashCardIcon />,
    },
    fillInBlanks: {
      title: 'Fill in missing words to strengthen recall',
      icon: <FillInBlanksIcon />,
    },
    recitation: {
      title: 'Recite aloud with light prompts before checking yourself',
      icon: <RecitationIcon />,
    },
  };
  return (
    <View className='flex-1 p-[18]'>
      <View className='gap-2'>
        <View className='flex-row items-center justify-between gap-3'>
          <ThemedText className='flex-1'>{practiceData[name].title}</ThemedText>

          {
            practiceData[name as keyof typeof practiceData]
              .icon as React.ReactNode
          }
        </View>

        <ThemedText className='text-sm text-muted-foreground'>
          {practiceMeta.tip}
        </ThemedText>
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
              {isLimitedSession
                ? `Showing ${sessionVerseCount} of ${totalVersesCount} verses`
                : `${sessionVerseCount} verses`}
            </ThemedText>

            {usingStarterVerses && (
              <ThemedText className='text-xs text-muted-foreground'>
                Using starter verses so you can practice right away.
              </ThemedText>
            )}

            {isLimitedSession && (
              <ThemedText className='text-xs text-muted-foreground'>
                {practiceMeta.shortLabel} currently uses up to{' '}
                {practiceMeta.verseLimit} verses per session to keep practice
                focused.
              </ThemedText>
            )}

            {isLimitedSession && !usingStarterVerses && (
              <ThemedText className='text-xs text-muted-foreground'>
                Starting with your {practiceMeta.verseLimit} most recent verses
                helps you memorize in smaller, repeatable chunks.
              </ThemedText>
            )}

            <View
              className='flex-1'
              style={{ minHeight: Platform.OS === 'web' ? 400 : undefined }}
            >
              {!hasHydrated ? (
                <FlashListSkeletonLoader type='verses' gridView={gridView} />
              ) : (
                <FlatList
                  key={gridView ? 'grid-myverses' : 'list-myverses'}
                  data={versesForCurrentTechnique}
                  keyExtractor={(_item, index) => index.toString()}
                  numColumns={gridView ? 2 : 1}
                  ListEmptyComponent={() => (
                    <>
                      <AddVersesEmpty />
                    </>
                  )}
                  renderItem={({ item }) => (
                    <VerseCard
                      _id={
                        typeof item === 'object' &&
                        item !== null &&
                        'syncId' in item &&
                        typeof item.syncId === 'string'
                          ? item.syncId
                          : undefined
                      }
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
                if (
                  versesForCurrentTechnique &&
                  versesForCurrentTechnique.length > 0
                ) {
                  setPracticeSession(versesForCurrentTechnique, 'verses');
                  router.push(practiceMeta.practiceRoute);
                }
              }}
              disabled={
                !versesForCurrentTechnique ||
                versesForCurrentTechnique.length === 0
              }
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

            <ThemedText className='text-xs text-muted-foreground'>
              Collections practice also starts in smaller batches so longer
              sessions do not become overwhelming.
            </ThemedText>

            <View
              className='flex-1'
              style={{ minHeight: Platform.OS === 'web' ? 400 : undefined }}
            >
              {!hasHydrated ? (
                <FlashListSkeletonLoader
                  type='collections'
                  gridView={gridView}
                />
              ) : (
                <FlatList
                  key={gridView ? 'grid-collections' : 'list-collections'}
                  data={collections || []}
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
                />
              )}
            </View>

            <CustomButton
              onPress={() => {
                // Get all verses from all collections
                const allCollectionVerses = (
                  collections?.flatMap(
                    collection => collection.collectionVerses
                  ) ?? []
                ).slice(0, practiceMeta.verseLimit);

                if (allCollectionVerses.length === 0) {
                  // Show an alert or message that no collections are available
                  return;
                }

                setPracticeSession(allCollectionVerses, 'collections');
                router.push(practiceMeta.practiceRoute);
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
