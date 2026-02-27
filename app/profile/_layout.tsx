import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

const ProfileLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href='/(onboarding)/onboard' />;
  }

  return (
    <>
      <Stack>
        <Stack.Screen
          name='edit-profile'
          options={{
            headerShown: false,
          }}
        />
        {/* <Stack.Screen
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
        /> */}
      </Stack>
    </>
  );
};

export default ProfileLayout;
