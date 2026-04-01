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
      <Stack>
        <Stack.Screen
          name='fill-in-blanks'
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='flashcards'
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='recitation'
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
};

export default MemorizeLayout;
