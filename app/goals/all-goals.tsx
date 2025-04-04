import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import Container from '~/components/Container';
import ThemedText from '~/components/ThemedText';
import GoalCard from '~/components/GoalCard';
import { Button } from '~/components/ui/button';
import ArrowLeftIcon from '~/assets/icons/ArrowLeftIcon';
import { useRouter } from 'expo-router';
import RemoveCircleIcon from '~/assets/icons/RemoveCircleIcon';

const AllGoalsScreen = () => {
  const router = useRouter();
  return (
    <Container>
      <View className='items-center justify-between flex-row mb-7'>
        <Button size={'icon'} variant={'ghost'} onPress={() => router.back()}>
          <ArrowLeftIcon />
        </Button>

        <ThemedText size={16} variant='medium'>
          My Goals
        </ThemedText>

        <Button
          size={'icon'}
          variant={'ghost'}
          onPress={() => router.push('/goals/remove-goals')}
        >
          <RemoveCircleIcon />
        </Button>
      </View>

      <ScrollView>
        <GoalCard />
      </ScrollView>
    </Container>
  );
};

export default AllGoalsScreen;
