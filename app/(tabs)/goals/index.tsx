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
          className='w-full mx-auto flex-col gap-1.5'
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
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Make changes to your account here. Click save when you're
                  done.
                </CardDescription>
              </CardHeader>
              <CardContent className='gap-4 native:gap-2'>
                <View className='gap-1'>
                  <Label nativeID='name'>Name</Label>
                  <Input
                    aria-aria-labelledby='name'
                    defaultValue='Pedro Duarte'
                  />
                </View>
                <View className='gap-1'>
                  <Label nativeID='username'>Username</Label>
                  <Input id='username' defaultValue='@peduarte' />
                </View>
              </CardContent>
              <CardFooter>
                <Button>
                  <Text>Save changes</Text>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value='completed'>
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className='gap-4 native:gap-2'>
                <View className='gap-1'>
                  <Label nativeID='current'>Current password</Label>
                  <Input
                    placeholder='********'
                    aria-labelledby='current'
                    secureTextEntry
                  />
                </View>
                <View className='gap-1'>
                  <Label nativeID='new'>New password</Label>
                  <Input
                    placeholder='********'
                    aria-labelledby='new'
                    secureTextEntry
                  />
                </View>
              </CardContent>
              <CardFooter>
                <Button>
                  <Text>Save password</Text>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </View>
    </Container>
  );
}
