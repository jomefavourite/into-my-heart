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

export default function FillInBlanks() {
  const [value, setValue] = useState('verses');
  const router = useRouter();

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
            <TabsTrigger value='verses' className={cn('!bg-none rounded-none')}>
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
            <TabsTrigger value='collection' className=''>
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
            <TabsTrigger value='goals' className=''>
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
              <ThemedText size={13}>10 verses</ThemedText>

              <View>
                <FlatList
                  data={verses}
                  // style={{flex: 1}}

                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <VerseCard
                      reference={item.reference}
                      text={item.text}
                      onAddPress={() => console.log(`${item.text} pressed`)}
                    />
                  )}
                />
              </View>

              <CustomButton onPress={() => console.log('Practice started')}>
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
