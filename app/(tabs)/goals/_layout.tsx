import React from 'react';
import { Stack } from 'expo-router';

const GoalsLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: 'Goals',
          headerTitle: 'Goals',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='create-goal'
        options={{
          title: 'Create Goal',
          // headerShown: false,
          headerShadowVisible: false,
          // headerStyle: {
          //   backgroundColor: '#f5f5f5',
          // },
        }}
      />
    </Stack>
  );
};

export default GoalsLayout;
