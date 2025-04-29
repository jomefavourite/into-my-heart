import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Container from '~/components/Container';
import Title from '~/components/Title';
import ThemedText from '~/components/ThemedText';
import VersesTab from '../../../components/Verses/versesTab';
import CollectionsTab from '../../../components/Verses/CollectionsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { cn } from '~/lib/utils';
import { Animated } from 'react-native';
import AddIcon from '~/components/icons/AddIcon';
import GridViewIcon from '~/components/icons/GridViewIcon';

export default function VersesHomeScreen() {
  const [value, setValue] = useState('verses');

  return (
    <Container>
      <View className='gap-5'>
        <ThemedText size={22} variant='semibold'>
          Verses & Collections
        </ThemedText>

        <Tabs
          value={value}
          onValueChange={setValue}
          className='w-full mx-auto flex-col gap-1.5'
        >
          <View className='relative flex justify-center'>
            <TabsList className='flex-row'>
              <TabsTrigger value='verses' className=''>
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
              <TabsTrigger value='collections' className='w-fit'>
                <ThemedText
                  size={13}
                  variant='medium'
                  className={cn(
                    'text-muted-foreground',
                    value === 'collections' &&
                      'text-white dark:text-primary-foreground'
                  )}
                >
                  Collections
                </ThemedText>
              </TabsTrigger>
            </TabsList>
            <View className='absolute right-0 flex items-center px-2'>
              <AddIcon />
              <GridViewIcon />
            </View>
          </View>

          <Animated.View style={{ opacity: value === 'verses' ? 1 : 0 }}>
            <TabsContent value='verses'>
              <VersesTab />
            </TabsContent>
          </Animated.View>

          <Animated.View style={{ opacity: value === 'collections' ? 1 : 0 }}>
            <TabsContent value='collections'>
              <CollectionsTab />
            </TabsContent>
          </Animated.View>
        </Tabs>
      </View>
    </Container>
  );
}
