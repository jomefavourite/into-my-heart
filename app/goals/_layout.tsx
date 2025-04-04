import React from 'react';
import { Stack } from 'expo-router';

const GoalsLayout = () => {
  return (
    <>
      <Stack>
        {/* <Stack.Screen
          name='index'
          options={{
            title: 'Goals',
            headerTitle: 'Goals',
            headerShown: false,
          }}
        /> */}
        <Stack.Screen
          name='create-goal'
          options={{
            title: 'Create Goal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='all-goals'
          options={{
            title: 'My Goals',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='remove-goals'
          options={{
            title: 'Remove Goals',
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
};

export default GoalsLayout;
