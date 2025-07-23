import { View, Text, ScrollView, FlatList } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '~/components/BackHeader';
import ThemedText from '~/components/ThemedText';
import { TabsContent, TabsList, TabsTrigger, Tabs } from '~/components/ui/tabs';
import { cn } from '~/lib/utils';
import CustomButton from '~/components/CustomButton';
import { verses } from '~/lib/constants';
import VerseCard from '~/components/Verses/VerseCard';
import SettingsIcon from '~/components/icons/SettingsIcon';
import { Button } from '~/components/ui/button';
import { useRouter } from 'expo-router';
import ItemSeparator from '~/components/ItemSeparator';
import { useQuery } from 'convex-helpers/react/cache';
import { api } from '~/convex/_generated/api';
import { useGridListView } from '~/store/tab-store';
import AddVersesEmpty from '~/components/EmptyScreen/AddVersesEmpty';

export default function FillInBlanks() {
  const getVerses = useQuery(api.verses.getVerses, { take: 5 });
  const [value, setValue] = useState('verses');
  const router = useRouter();
  const { gridView, setGridView } = useGridListView();

  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        RightComponent={
          <Button
            size={'icon'}
            variant='ghost'
            onPress={() => router.push('/practice/fill-in-blanks/settings')}
          >
            <SettingsIcon />
          </Button>
        }
        items={[{ label: 'Verses', href: '/verses' }]}
      />

      <View className='p-[18]'>
        <View>
          <ThemedText>
            Practice verses using the Recitation technique
          </ThemedText>
        </View>

        <Tabs
          value={value}
          onValueChange={setValue}
          className='w-full mx-auto flex-col gap-4'
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

          <TabsContent value='verses'>
            <View className='gap-3 '>
              <ThemedText size={13}>{getVerses?.length ?? 0} verses</ThemedText>

              <FlatList
                key={gridView ? 'grid-myverses' : 'list-myverses'}
                data={getVerses}
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
                scrollEnabled={false}
              />

              <CustomButton
                onPress={() => router.push('/practice/fill-in-blanks/pratice')}
              >
                Start Practice
              </CustomButton>
            </View>
          </TabsContent>
          <TabsContent value='completed'>
            {/* <GoalCard view={view} goalCompleted /> */}
          </TabsContent>
        </Tabs>
      </View>
    </SafeAreaView>
  );
}
