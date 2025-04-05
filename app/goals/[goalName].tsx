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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import Animated, { FadeIn } from 'react-native-reanimated';
import Container from '~/components/Container';
import { Progress } from '~/components/ui/progress';

export default function GoalName() {
  const router = useRouter();

  return (
    <Container>
      {/* Header */}
      <View className='items-center justify-between flex-row mb-7'>
        <Button size={'icon'} variant={'ghost'} onPress={() => router.back()}>
          <ArrowLeftIcon />
        </Button>

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
      </View>

      <View>
        <View>
          <ThemedText size={18} variant='medium'>
            Enter goal name
          </ThemedText>
          <ThemedText size={14}>Tomorrow</ThemedText>
          <ThemedText size={14}>Daily Review</ThemedText>
        </View>
        <Progress value={87} className='web:w-[60%]' />{' '}
        <ThemedText>100%</ThemedText>
      </View>
    </Container>
  );
}
