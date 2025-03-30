import { View, Text } from 'react-native';
import React from 'react';
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

export default function GoalsScreen() {
  const [value, setValue] = React.useState('goals');
  const router = useRouter();
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
                className='bg-transparent'
                onPress={() => router.push('/(tabs)/goals/create-goal')}
              >
                <AddIcon stroke='white' />
              </Button>
              <Button size={'icon'} className='bg-transparent'>
                <ListViewIcon stroke='white' />
              </Button>
            </View>
          </View>

          <TabsContent value='goals'>
            <View className='gap-3'>
              <ThemedText variant='medium'>Goals suggested</ThemedText>

              <ScrollView
                horizontal={true}
                style={{
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  width: 200,
                  height: 500,
                  backgroundColor: 'red',
                }}
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
          </TabsContent>
          <TabsContent value='completed'></TabsContent>
        </Tabs>
      </View>
    </Container>
  );
}
