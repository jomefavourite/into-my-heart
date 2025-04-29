import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import Container from '~/components/Container';
import ThemedText from '~/components/ThemedText';
import GoalCard from '~/components/GoalCard';
import { Button } from '~/components/ui/button';
import ArrowLeftIcon from '~/assets/icons/ArrowLeftIcon';
import { useRouter } from 'expo-router';
import RemoveCircleIcon from '~/assets/icons/RemoveCircleIcon';
import BackHeader from '~/components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const AllGoalsScreen = () => {
  const router = useRouter();
  return (
    <SafeAreaView>
      <BackHeader
        title='My Goals'
        RightComponent={
          <Button
            size={'icon'}
            variant={'ghost'}
            onPress={() => router.push('/goals/remove-goals')}
          >
            <RemoveCircleIcon />
          </Button>
        }
        items={[
          { label: 'Goals', href: '/goals' },
          { label: 'My Goals', href: '/goals/all-goals' },
        ]}
      />

      <ScrollView className='px-[18px]'>
        <GoalCard />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllGoalsScreen;
