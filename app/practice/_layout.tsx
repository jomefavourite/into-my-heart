import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';
import { useAuth } from '@clerk/clerk-expo';

const PracticeLayout = () => {
  // const { isSignedIn } = useAuth();

  // if (!isSignedIn) {
  //   return <Redirect href='/(onboarding)/create-account' />;
  // }

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

export default PracticeLayout;
