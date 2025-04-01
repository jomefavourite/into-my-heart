import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Container from '~/components/Container';
import ThemedText from '~/components/ThemedText';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import CustomButton from '~/components/CustomButton';
import { cn } from '~/lib/utils';
import AddIcon from '~/assets/icons/AddIcon';
import ListViewIcon from '~/assets/icons/ListViewIcon';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import ArrowRightIcon from '~/assets/icons/ArrowRightIcon';
import GridViewIcon from '~/assets/icons/GridViewIcon';
import GoalCard from '~/components/GoalCard';

export default function GoalsScreen() {
  const [value, setValue] = useState('goals');
  const [view, setView] = useState<'list' | 'grid'>('list');

  const router = useRouter();

  const containerClassName =
    view === 'grid' ? 'flex-row flex-wrap' : 'flex-col';
  const itemClassName = view === 'grid' ? 'w-[49%]' : ' ';

  return (
    <Container>
      <View className='gap-5'>
        <ThemedText size={22} variant='semibold'>
          Goals
        </ThemedText>

        <Tabs
          value={value}
          onValueChange={setValue}
          className='w-full mx-auto flex-col gap-4'
        >
          <View className='flex-row justify-between'>
            <TabsList className='flex-row'>
              <TabsTrigger value='goals' className=''>
                <ThemedText
                  size={13}
                  variant='medium'
                  className={cn(
                    'text-muted-foreground',
                    value === 'goals' &&
                      'text-white dark:text-primary-foreground'
                  )}
                >
                  Goals
                </ThemedText>
              </TabsTrigger>
              <TabsTrigger value='completed' className='w-fit '>
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

            <View className='flex-row'>
              <Button
                size={'icon'}
                variant={'ghost'}
                onPress={() => router.push('/(goals)/create-goal')}
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

          <TabsContent value='goals'>
            <View className='gap-3'>
              <ThemedText variant='medium'>Goals suggested</ThemedText>

              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                // style={{
                //   flexWrap: 'wrap',
                //   flexDirection: 'row',
                //   width: 'auto',
                //   height: 'auto',
                //   backgroundColor: 'red',
                //   gap: 20,
                // }}
                // className='flex-wrap gap-3 w-[400px]'
              >
                {new Array(6).fill(null).map((_, index) => (
                  <CustomButton
                    key={index}
                    variant='outline'
                    className='rounded-lg'
                  >
                    Complete the beatitudes this week
                  </CustomButton>
                ))}
              </ScrollView>
            </View>

            <View className='gap-3'>
              <View className='flex-row items-center justify-between'>
                <ThemedText variant='medium'>My Goals</ThemedText>
                <Button
                  size={'icon'}
                  variant={'ghost'}
                  onPress={() => router.push('/(goals)/all-goals')}
                >
                  <ArrowRightIcon />
                </Button>
              </View>

              <View className={cn('gap-2', containerClassName)}>
                <GoalCard view={view} />
              </View>
            </View>
          </TabsContent>
          <TabsContent value='completed'>
            <GoalCard view={view} goalCompleted />
          </TabsContent>
        </Tabs>
      </View>
    </Container>
  );
}
