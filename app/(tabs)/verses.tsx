import React from 'react';
import { FlatList, View, Platform } from 'react-native';
import ThemedText from '@/components/ThemedText';
import VersesTab from '@/components/Verses/versesTab';
import CollectionsTab from '@/components/Verses/CollectionsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Animated } from 'react-native';
import AddIcon from '@/components/icons/AddIcon';
import GridViewIcon from '@/components/icons/GridViewIcon';
import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import ListViewIcon from '@/components/icons/ListViewIcon';
import {
  useGridListView,
  useIsCollOrVerse,
  useVersesTabStore,
} from '@/store/tab-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PageHeader from '@/components/PageHeader';

export default function VersesHomeScreen() {
  const { activeTab, setActiveTab } = useVersesTabStore();
  const { setIsCollOrVerse } = useIsCollOrVerse();
  const { gridView, setGridView } = useGridListView();

  const router = useRouter();

  // console.log(activeTab, 'activeTab in verses home screen');

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className='flex-1 gap-5'>
      {Platform.OS === 'web' && (
        <>
          <title>My Verses - Into My Heart</title>
          <meta
            name='description'
            content='View and manage your memorized Bible verses. Add new verses, organize collections, and track your progress.'
          />
          <meta
            name='keywords'
            content='Bible, memorization, verses, flashcards, practice, Christian, faith, scripture'
          />
          <meta name='author' content='Into My Heart' />
          <meta name='robots' content='index, follow' />
          <meta property='og:type' content='website' />
          <meta property='og:site_name' content='Into My Heart' />
          <meta property='og:locale' content='en_US' />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='theme-color' content='#313131' />
          <meta name='msapplication-TileColor' content='#313131' />
        </>
      )}

      <PageHeader title='Verses & Collections' />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='mx-auto w-full flex-1 flex-col gap-1.5'
      >
        <View className='flex-row justify-between px-[18px]'>
          <TabsList className='flex-row'>
            <TabsTrigger value='verses' className='' id='verses'>
              <ThemedText
                size={13}
                variant='medium'
                className={cn(
                  'text-muted-foreground',
                  activeTab === 'verses' &&
                    'text-white dark:text-primary-foreground'
                )}
              >
                Verses
              </ThemedText>
            </TabsTrigger>
            <TabsTrigger value='collections' className='w-fit' id='collections'>
              <ThemedText
                size={13}
                variant='medium'
                className={cn(
                  'text-muted-foreground',
                  activeTab === 'collections' &&
                    'text-white dark:text-primary-foreground'
                )}
              >
                Collections
              </ThemedText>
            </TabsTrigger>
          </TabsList>

          <View className='flex-row gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size={'icon'}
                  variant={'ghost'}
                  // onPress={() => router.push('/verses/select-book')}
                  className='flex-row items-center gap-1'
                >
                  <ThemedText className='hidden md:block'>Add</ThemedText>
                  <AddIcon stroke='white' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='mr-4'>
                <DropdownMenuItem
                  onPress={() => {
                    setIsCollOrVerse('verses');
                    router.push('/verses/select-book');
                  }}
                >
                  <ThemedText className='text-sm font-medium'>
                    Add Verse
                  </ThemedText>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onPress={() => {
                    setIsCollOrVerse('collections');
                    router.push('/verses/create-collection');
                  }}
                >
                  <ThemedText className='text-sm font-medium'>
                    Add Collection
                  </ThemedText>
                </DropdownMenuItem>
                <DropdownMenuItem
                disabled={true}
                  onPress={() => {
                  
                    router.push('/verses/import-verses');
                  }}
                >
                  <ThemedText className='text-sm font-medium'>
                   Import Verses
                  </ThemedText>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size={'icon'}
              variant={'ghost'}
              onPress={() => setGridView(!gridView)}
            >
              {gridView ? <GridViewIcon /> : <ListViewIcon stroke='white' />}
            </Button>
          </View>
        </View>

        <FlatList
          className='flex-1 px-[18px] pb-[18px]'
          data={[{ id: 'page' }]} // single item to render accordion
          keyExtractor={item => item.id}
          renderItem={() => (
            <View style={{ width: '100%' }}>
              {activeTab === 'verses' && (
                <Animated.View
                  style={{
                    opacity: 1,
                    flex: 1,
                  }}
                >
                  <TabsContent value='verses' className='flex-1'>
                    <VersesTab gridView={gridView} />
                  </TabsContent>
                </Animated.View>
              )}

              {activeTab === 'collections' && (
                <Animated.View
                  style={{
                    opacity: 1,
                    flex: 1,
                  }}
                >
                  <TabsContent value='collections' className='flex-1'>
                    <CollectionsTab gridView={gridView} />
                  </TabsContent>
                </Animated.View>
              )}
            </View>
          )}
        />
      </Tabs>
    </SafeAreaView>
  );
}
