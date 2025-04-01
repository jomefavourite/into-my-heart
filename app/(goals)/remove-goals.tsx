import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import Container from '~/components/Container';
import ThemedText from '~/components/ThemedText';
import GoalCard from '~/components/GoalCard';
import { Button } from '~/components/ui/button';
import ArrowLeftIcon from '~/assets/icons/ArrowLeftIcon';
import { useRouter } from 'expo-router';
import RemoveCircleIcon from '~/assets/icons/RemoveCircleIcon';
import CancelIcon from '~/assets/icons/CancelIcon';
import DeleteIcon from '~/assets/icons/DeleteIcon';

const RemoveGoalsScreen = () => {
  const router = useRouter();
  return (
    <Container>
      <View className='items-center justify-between flex-row mb-7'>
        <Button size={'icon'} variant={'ghost'} onPress={() => router.back()}>
          <CancelIcon />
        </Button>

        <Button size={'icon'} variant={'ghost'}>
          <DeleteIcon />
        </Button>
      </View>

      <ScrollView>
        <GoalCard checkMark />
      </ScrollView>
    </Container>
  );
};

export default RemoveGoalsScreen;
