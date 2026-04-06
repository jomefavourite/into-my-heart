import React from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

const MemorizeLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name='fill-in-blanks'
        />
        <Stack.Screen
          name='flashcards'
        />
        <Stack.Screen
          name='recitation'
        />
        <Stack.Screen name='settings' />
      </Stack>
    </>
  );
};

export default MemorizeLayout;
