import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Container from '~/components/Container';
import Title from '~/components/Title';
import ThemedText from '~/components/ThemedText';
import VersesTab from '~/components/Verses/versesTab';
import CollectionsTab from '~/components/Verses/CollectionsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { cn } from '~/lib/utils';
import { Animated } from 'react-native';
import AddIcon from '~/components/icons/AddIcon';
import GridViewIcon from '~/components/icons/GridViewIcon';
import { Button } from '~/components/ui/button';
import { useRouter } from 'expo-router';
import ListViewIcon from '~/components/icons/ListViewIcon';
import { useVersesTabStore } from '~/store/tab-store';

export default function VersesHomeScreen() {
  const { activeTab, setActiveTab } = useVersesTabStore();
  const [gridView, setGridView] = useState<boolean>(false);
  const router = useRouter();

  console.log(activeTab, 'activeTab in verses home screen');

  return (
    <Container>
      <View className='gap-5'>
        <ThemedText size={22} variant='semibold'>
          Verses & Collections
        </ThemedText>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='w-full mx-auto flex-col gap-1.5'
        >
          <View className='flex-row justify-between'>
            <TabsList className='flex-row'>
              <TabsTrigger value='verses' className=''>
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
              <TabsTrigger value='collections' className='w-fit'>
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
              <Button
                size={'icon'}
                variant={'ghost'}
                onPress={() => router.push('/verses/select-book')}
              >
                <AddIcon stroke='white' />
              </Button>
              <Button
                size={'icon'}
                variant={'ghost'}
                onPress={() => setGridView(!gridView)}
              >
                {gridView ? <GridViewIcon /> : <ListViewIcon stroke='white' />}
              </Button>
            </View>
          </View>

          <Animated.View style={{ opacity: activeTab === 'verses' ? 1 : 0 }}>
            <TabsContent value='verses'>
              <VersesTab gridView={gridView} />
            </TabsContent>
          </Animated.View>

          <Animated.View
            style={{ opacity: activeTab === 'collections' ? 1 : 0 }}
          >
            <TabsContent value='collections'>
              <CollectionsTab />
            </TabsContent>
          </Animated.View>
        </Tabs>
      </View>
    </Container>
  );
}
