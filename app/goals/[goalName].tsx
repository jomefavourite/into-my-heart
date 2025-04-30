import { View, Text } from 'react-native';
import React from 'react';
import ThemedText from '~/components/ThemedText';
import { Button } from '~/components/ui/button';
import ArrowLeftIcon from '~/components/icons/ArrowLeftIcon';
import { useRouter } from 'expo-router';
import MoreVerticalIcon from '~/components/icons/MoreVerticalIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import Container from '~/components/Container';
import { Progress } from '~/components/ui/progress';
import BackHeader from '~/components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import DumbbellIcon from '~/components/icons/DumbbellIcon';

export default function GoalName() {
  const router = useRouter();
  // const { goalName } = useLocalSearchParams();

  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        RightComponent={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={'icon'} variant={'ghost'} onPress={() => null}>
                <MoreVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-48 native:w-52'>
              <DropdownMenuItem>
                <Text>Add Verse</Text>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Text>Remove Verse</Text>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Text>Stop Goal</Text>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
        items={[{ label: 'Verses', href: '/verses' }]}
      />

      <View className='p-[18px]'>
        <View>
          <ThemedText size={18} variant='medium'>
            Enter goal name
          </ThemedText>
          <ThemedText size={14}>Tomorrow</ThemedText>
          <ThemedText size={14}>Daily Review</ThemedText>
        </View>

        <View className='flex-row items-center'>
          <Progress value={20} className='w-[30%] bg-red-500' />
          <ThemedText className=''>100%</ThemedText>
        </View>

        <View className='bg-container p-4 rounded-lg gap-1]'>
          <View className='flex-row gap-1 items-center'>
            <DumbbellIcon fontSize={13} />
            <ThemedText size={14} variant='medium'>
              Faith Boost
            </ThemedText>
          </View>
          <ThemedText size={12}>
            A little progress each day adds up to big results! Keep going!
          </ThemedText>
        </View>
      </View>
    </SafeAreaView>
  );
}
