import React from 'react';
import { Stack } from 'expo-router';

const HomeLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='notifications'
        options={{
          title: 'Notifications',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='verse-of-the-day'
        options={{
          title: 'Verse of the day',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='memorization-tips'
        options={{
          title: '',
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default HomeLayout;
