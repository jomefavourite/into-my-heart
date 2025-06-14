import React, { useState } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import Container from '~/components/Container';
import Title from '~/components/Title';
import ThemedText from '~/components/ThemedText';
import VersesTab from '~/components/Verses/VersesTab';
import CollectionsTab from '~/components/Verses/CollectionsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { cn } from '~/lib/utils';
import { Animated } from 'react-native';
import AddIcon from '~/components/icons/AddIcon';
import GridViewIcon from '~/components/icons/GridViewIcon';
import { Button } from '~/components/ui/button';
import { useRouter } from 'expo-router';
import ListViewIcon from '~/components/icons/ListViewIcon';
import { useIsCollOrVerse, useVersesTabStore } from '~/store/tab-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

export default function VersesHomeScreen() {
  const { activeTab, setActiveTab } = useVersesTabStore();

  const { setIsCollOrVerse } = useIsCollOrVerse();
  const [gridView, setGridView] = useState<boolean>(false);
  const router = useRouter();

  // console.log(activeTab, 'activeTab in verses home screen');

  return (
    <SafeAreaView className='flex-1'>
      <View className='gap-5 flex-1'>
        <View className='p-[18px]'>
          <ThemedText size={22} variant='semibold'>
            Verses & Collections
          </ThemedText>
        </View>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='w-full mx-auto flex-col gap-1.5 flex-1'
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
              <TabsTrigger
                value='collections'
                className='w-fit'
                id='collections'
              >
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

            <View className='flex-row'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size={'icon'}
                    variant={'ghost'}
                    // onPress={() => router.push('/verses/select-book')}
                  >
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
                    <ThemedText size={14} variant='medium'>
                      Add Verse
                    </ThemedText>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onPress={() => {
                      setIsCollOrVerse('collections');
                      router.push('/verses/create-collection');
                    }}
                  >
                    <ThemedText size={14} variant='medium'>
                      Add Collection
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
            className='px-[18px]'
            data={[{ id: 'page' }]} // single item to render accordion
            keyExtractor={(item) => item.id}
            renderItem={() => (
              <>
                <Animated.View
                  style={{ opacity: activeTab === 'verses' ? 1 : 0 }}
                >
                  <TabsContent value='verses'>
                    <VersesTab gridView={gridView} />
                  </TabsContent>
                </Animated.View>

                <Animated.View
                  style={{ opacity: activeTab === 'collections' ? 1 : 0 }}
                >
                  <TabsContent value='collections'>
                    <CollectionsTab gridView={gridView} />
                  </TabsContent>
                </Animated.View>
              </>
            )}
          />
        </Tabs>
      </View>
    </SafeAreaView>
  );
}
