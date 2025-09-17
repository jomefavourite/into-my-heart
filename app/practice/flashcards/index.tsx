import { View, Text, ScrollView, FlatList } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/components/BackHeader';
import ThemedText from '@/components/ThemedText';
import { TabsContent, TabsList, TabsTrigger, Tabs } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import CustomButton from '@/components/CustomButton';
import { verses } from '@/lib/utils';
import VerseCard from '@/components/Verses/VerseCard';
import CollectionCard from '@/components/Verses/CollectionCard';
import SettingsIcon from '@/components/icons/SettingsIcon';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import ItemSeparator from '@/components/ItemSeparator';
import { usePaginatedQuery, useQuery } from 'convex-helpers/react/cache';
import { api } from '@/convex/_generated/api';
import { useGridListView } from '@/store/tab-store';
import AddVersesEmpty from '@/components/EmptyScreen/AddVersesEmpty';
import SuggestionEmpty from '@/components/EmptyScreen/SuggestionEmpty';
import { Platform } from 'react-native';
import { ActivityIndicator } from 'react-native';
import FlashCardIcon from '@/components/icons/practice/FlashCardIcon';

export default function Flashcards() {
  const {
    results: verses,
    isLoading,
    loadMore,
  } = usePaginatedQuery(api.verses.getAllVerses, {}, { initialNumItems: 10 });
  const collections = useQuery(api.collections.getCollections);
  const [value, setValue] = useState('verses');
  const router = useRouter();
  const { gridView, setGridView } = useGridListView();

  const handleLoadMore = () => {
    if (!isLoading) {
      loadMore(2);
    }
  };

  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        RightComponent={
          <Button
            size={'icon'}
            variant='ghost'
            onPress={() => router.push('/practice/flashcards')}
          >
            <SettingsIcon />
          </Button>
        }
        items={[
          { label: 'Practice', href: '/practice' },
          { label: 'Flashcards', href: '/practice/flashcards' },
        ]}
      />

      <View className='flex-1 p-[18]'>
        <View className='flex-row items-center justify-between'>
          <ThemedText>
            Practice verses using the Flashcards technique
          </ThemedText>

          <FlashCardIcon />
        </View>

        <Tabs
          value={value}
          onValueChange={setValue}
          className='w-full mx-auto flex-col gap-4 flex-1'
        >
          <TabsList className='flex-row w-full'>
            <TabsTrigger
              value='verses'
              className={cn(
                "flex-1 px-3 py-2 border-b-2 border-[#313131] [font-family:'Inter',Helvetica] font-medium text-[#313131] text-base data-[state=active]:text-[#313131] data-[state=active]:!bg-red-500 data-[state=inactive]:text-[#707070] data-[state=inactive]:border-b-0"
              )}
            >
              <ThemedText
                size={13}
                variant='medium'
                className={cn(
                  'text-muted-foreground',
                  value === 'verses' &&
                    'text-white dark:text-primary-foreground'
                )}
              >
                Verses
              </ThemedText>
            </TabsTrigger>
            <TabsTrigger
              value='collections'
              className="flex-1 px-3 py-2 [font-family:'Inter',Helvetica] font-medium text-[#707070] text-base data-[state=active]:text-[#313131] data-[state=active]:border-b-2 data-[state=active]:border-[#313131]"
            >
              <ThemedText
                size={13}
                variant='medium'
                className={cn(
                  'text-muted-foreground',
                  value === 'completed' &&
                    'text-white dark:text-primary-foreground'
                )}
              >
                Collections
              </ThemedText>
            </TabsTrigger>
            <TabsTrigger
              value='goals'
              className="flex-1 px-3 py-2 [font-family:'Inter',Helvetica] font-medium text-[#707070] text-base data-[state=active]:text-[#313131] data-[state=active]:border-b-2 data-[state=active]:border-[#313131]"
            >
              <ThemedText
                size={13}
                variant='medium'
                className={cn(
                  'text-muted-foreground',
                  value === 'completed' &&
                    'text-white dark:text-primary-foreground'
                )}
              >
                Completed
              </ThemedText>
            </TabsTrigger>
          </TabsList>

          <TabsContent value='verses' className='flex-1'>
            <View className='gap-3 flex-1'>
              <ThemedText size={13}>{verses?.length ?? 0} verses</ThemedText>

              <View
                className='flex-1'
                style={{ minHeight: Platform.OS === 'web' ? 400 : undefined }}
              >
                <FlatList
                  key={gridView ? 'grid-myverses' : 'list-myverses'}
                  data={verses}
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
                    gridView
                      ? { justifyContent: 'space-between', gap: 8 }
                      : undefined
                  }
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={true}
                  onEndReached={handleLoadMore}
                  onEndReachedThreshold={0.1}
                  ListFooterComponent={() =>
                    isLoading ? <ActivityIndicator /> : null
                  }
                  style={{ flex: 1 }}
                  contentContainerStyle={{ flexGrow: 1 }}
                />
              </View>

              <CustomButton
                onPress={() => router.push('/practice/flashcards/practice')}
              >
                Start Practice
              </CustomButton>
            </View>
          </TabsContent>
          <TabsContent value='collections' className='flex-1'>
            <View className='gap-3 flex-1'>
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
                  key={gridView ? 'grid-collections' : 'list-collections'}
                  data={collections || []}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={gridView ? 2 : 1}
                  ListEmptyComponent={() => (
                    <>
                      {/* Loading */}
                      {/* <CollectionCardSkeleton /> */}
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
                    gridView
                      ? { justifyContent: 'space-between', gap: 8 }
                      : undefined
                  }
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                />
              </View>

              <CustomButton
                onPress={() => router.push('/practice/flashcards/practice')}
              >
                Start Practice
              </CustomButton>
            </View>
          </TabsContent>
          <TabsContent value='goals'>
            {/* <GoalCard view={view} goalCompleted /> */}
          </TabsContent>
        </Tabs>
      </View>
    </SafeAreaView>
  );
}
