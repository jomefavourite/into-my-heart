import { View, Text } from 'react-native';
import React from 'react';
import ThemedText from '~/components/ThemedText';
import { Button } from '~/components/ui/button';
import ArrowLeftIcon from '~/assets/icons/ArrowLeftIcon';
import { useRouter } from 'expo-router';
import MoreVerticalIcon from '~/assets/icons/MoreVerticalIcon';
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

export default function GoalName() {
  const router = useRouter();

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
            <DropdownMenuContent className='w-64 native:w-72'>
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
          <Progress value={20} className='w-full bg-red-500' />
          <ThemedText className=''>100%</ThemedText>
        </View>
      </View>
    </SafeAreaView>
  );
}
