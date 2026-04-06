import { FlatList, Platform, View } from 'react-native';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import CustomButton from '../CustomButton';
import CustomTabsTrigger from '../CustomTabsTrigger';
import AddVersesEmpty from '../EmptyScreen/AddVersesEmpty';
import FlashListSkeletonLoader from '../FlashListSkeletonLoader';
import ThemedText from '../ThemedText';
import CollectionCard from '../Verses/CollectionCard';
import VerseCard from '../Verses/VerseCard';
import ItemSeparator from '../ItemSeparator';
import FlashCardIcon from '../icons/practice/FlashCardIcon';
import FillInBlanksIcon from '../icons/practice/FillInBlanksIcon';
import RecitationIcon from '../icons/practice/RecitationIcon';
import { Tabs, TabsContent, TabsList } from '../ui/tabs';
import {
  useOfflineCollections,
  useOfflineSyncStatus,
  useOfflineVerses,
} from '@/hooks/useOfflineData';
import {
  buildTechniqueCollectionSession,
  buildTechniqueVerseSession,
  getPracticeMethodMeta,
  type PracticeMethod,
} from '@/lib/practiceFlow';
import { usePracticeStore } from '@/store/practiceStore';
import {
  useGridListView,
  usePracticeLauncherPreferences,
} from '@/store/tab-store';

const practiceData: Record<PracticeMethod, { title: string; icon: React.ReactNode }> = {
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

export default function PracticeComp({ name }: { name: PracticeMethod }) {
  const verses = useOfflineVerses();
  const collections = useOfflineCollections();
  const { hasHydrated } = useOfflineSyncStatus();
  const [value, setValue] = useState('verses');
  const router = useRouter();
  const { gridView } = useGridListView();
  const { setPracticeSession } = usePracticeStore();
  const randomizePracticeOrder = usePracticeLauncherPreferences(
    state => state.randomizePracticeOrder
  );
  const practiceMeta = getPracticeMethodMeta(name);
  const totalCollectionsCount = collections.length;
  const totalCollectionVerses = useMemo(
    () => collections.flatMap(collection => collection.collectionVerses).length,
    [collections]
  );
  const practiceOrderLabel = randomizePracticeOrder
    ? 'Randomized each time you start'
    : 'Same order as shown';

  return (
    <View className='flex-1 p-[18px]'>
      <View className='gap-2'>
        <View className='flex-row items-center justify-between gap-3'>
          <ThemedText className='flex-1'>{practiceData[name].title}</ThemedText>
          {practiceData[name].icon}
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
              {verses.length} saved verse{verses.length === 1 ? '' : 's'}
            </ThemedText>

            <ThemedText className='text-xs text-muted-foreground'>
              Practice order: {practiceOrderLabel}
            </ThemedText>

            <View
              className='flex-1'
              style={{ minHeight: Platform.OS === 'web' ? 400 : undefined }}
            >
              {!hasHydrated ? (
                <FlashListSkeletonLoader type='verses' gridView={gridView} />
              ) : (
                <FlatList
                  key={gridView ? 'grid-myverses' : 'list-myverses'}
                  data={verses}
                  keyExtractor={(_item, index) => index.toString()}
                  numColumns={gridView ? 2 : 1}
                  ListEmptyComponent={() => <AddVersesEmpty />}
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
                  style={{ flex: 1 }}
                  contentContainerStyle={{ flexGrow: 1 }}
                />
              )}
            </View>

            <CustomButton
              onPress={() => {
                const versesForSession = buildTechniqueVerseSession({
                  verses,
                  randomizeOrder: randomizePracticeOrder,
                });

                if (versesForSession.length === 0) {
                  return;
                }

                setPracticeSession(
                  versesForSession,
                  'verses',
                  name,
                  'manualTechnique'
                );
                router.push(practiceMeta.practiceRoute);
              }}
              disabled={verses.length === 0}
            >
              Practice all verses
            </CustomButton>
          </View>
        </TabsContent>

        <TabsContent value='collections' className='flex-1'>
          <View className='flex-1 gap-3'>
            <ThemedText className='text-[13px]'>
              {totalCollectionsCount} collection
              {totalCollectionsCount === 1 ? '' : 's'}
            </ThemedText>

            <ThemedText className='text-xs text-muted-foreground'>
              {totalCollectionVerses} saved verse
              {totalCollectionVerses === 1 ? '' : 's'} across your collections.
              Practice order: {practiceOrderLabel}
            </ThemedText>

            <View
              className='flex-1'
              style={{ minHeight: Platform.OS === 'web' ? 400 : undefined }}
            >
              {!hasHydrated ? (
                <FlashListSkeletonLoader type='collections' gridView={gridView} />
              ) : (
                <FlatList
                  key={gridView ? 'grid-collections' : 'list-collections'}
                  data={collections || []}
                  keyExtractor={(_item, index) => index.toString()}
                  numColumns={gridView ? 2 : 1}
                  ListEmptyComponent={() => <AddVersesEmpty collection />}
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
                const allCollectionVerses = buildTechniqueCollectionSession({
                  collections,
                  randomizeOrder: randomizePracticeOrder,
                });

                if (allCollectionVerses.length === 0) {
                  return;
                }

                setPracticeSession(
                  allCollectionVerses,
                  'collections',
                  name,
                  'manualTechnique'
                );
                router.push(practiceMeta.practiceRoute);
              }}
              disabled={totalCollectionVerses === 0}
            >
              Practice all collections
            </CustomButton>
          </View>
        </TabsContent>
      </Tabs>
    </View>
  );
}
