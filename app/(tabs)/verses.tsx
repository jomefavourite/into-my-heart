import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Container from '~/components/Container';
import Title from '~/components/Title';
import ThemedText from '~/components/ThemedText';
import VersesTab from '../../components/versesTab';
import CollectionsTab from '../../components/CollectionsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { cn } from '~/lib/utils';
import { Animated } from 'react-native';
import AddIcon from '~/assets/icons/AddIcon';
import GridViewIcon from '~/assets/icons/GridViewIcon';
import { Button } from '~/components/ui/button';
import { useRouter } from 'expo-router';
import ListViewIcon from '~/assets/icons/ListViewIcon';

export default function VersesHomeScreen() {
  const [value, setValue] = useState('verses');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const router = useRouter();

  return (
    <Container>
      <View className="gap-5">
      <ThemedText size={22} variant='semibold'>
          Verses & Collections
      </ThemedText>

        <Tabs
          value={value}
          onValueChange={setValue}
          className="w-full mx-auto flex-col gap-1.5"
        >
          <View className='relative flex flex-row justify-between'>
          <TabsList className="flex flex-row">
            <TabsTrigger value="verses" className="">
              <ThemedText
                size={13}
                variant="medium"
                className={cn(
                  'text-muted-foreground',
                  value === 'verses' && 'text-white dark:text-primary-foreground'
                )}
              >
                Verses
              </ThemedText>
            </TabsTrigger>
            <TabsTrigger value="collections" className="w-fit">
              <ThemedText
                size={13}
                variant="medium"
                className={cn(
                  'text-muted-foreground',
                  value === 'collections' && 'text-white dark:text-primary-foreground'
                )}
              >
                Collections
              </ThemedText>
            </TabsTrigger>
          </TabsList>

          <View className='flex flex-row'>
              <Button
                size={'icon'}
                variant={'ghost'}
                onPress={() => router.push('/(verses)/add-book')}
              >
                <AddIcon stroke='white' />
              </Button>
              <Button
                size={'icon'}
                variant={'ghost'}
                onPress={() => setView(view === 'list' ? 'grid' : 'list')}
              >
                {view === 'list' ? (
                  <ListViewIcon stroke='white' />
                ) : (
                  <GridViewIcon />
                )}
              </Button>
            </View>
          </View>

          <Animated.View style={{ opacity: value === 'verses' ? 1 : 0 }}>
            <TabsContent value="verses">
              <VersesTab view={view} />
            </TabsContent>
          </Animated.View>
          
          <Animated.View style={{ opacity: value === 'collections' ? 1 : 0 }}>
            <TabsContent value="collections">
              <CollectionsTab view={view} />
            </TabsContent>
          </Animated.View>
        </Tabs>
      </View>
    </Container>
  );
}