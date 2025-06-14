import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import Container from '~/components/Container';
import ThemedText from '~/components/ThemedText';
import GoalCard from '~/components/GoalCard';
import { Button } from '~/components/ui/button';
import ArrowLeftIcon from '~/components/icons/ArrowLeftIcon';
import { useRouter } from 'expo-router';
import RemoveCircleIcon from '~/components/icons/RemoveCircleIcon';
import BackHeader from '~/components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const AllVersesScreen = () => {
  const router = useRouter();
  return (
    <SafeAreaView>
      <BackHeader
        title='My Verses'
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
          { label: 'Verses', href: '/verses' },
          { label: 'My Verses', href: '/goals/all-verses' },
        ]}
      />

      <ScrollView className='px-[18px]'>
        <GoalCard />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllVersesScreen;
