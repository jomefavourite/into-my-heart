import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import Container from '~/components/Container';
import ThemedText from '~/components/ThemedText';
import GoalCard from '~/components/GoalCard';
import { Button } from '~/components/ui/button';
import ArrowLeftIcon from '~/components/icons/ArrowLeftIcon';
import { useRouter } from 'expo-router';
import RemoveCircleIcon from '~/components/icons/RemoveCircleIcon';
import CancelIcon from '~/components/icons/CancelIcon';
import DeleteIcon from '~/components/icons/DeleteIcon';
import { useBottomSheetStore } from '~/lib/utils';

const RemoveGoalsScreen = () => {
  const router = useRouter();

  const setRemoveGoalIndex = useBottomSheetStore(
    (state) => state.setRemoveGoalIndex
  );

  return (
    <Container>
      <View className='items-center justify-between flex-row mb-7'>
        <Button size={'icon'} variant={'ghost'} onPress={() => router.back()}>
          <CancelIcon />
        </Button>

        <Button
          size={'icon'}
          variant={'ghost'}
          onPress={() => setRemoveGoalIndex(1)}
        >
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
