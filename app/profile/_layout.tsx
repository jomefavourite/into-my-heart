import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';
import { useAuth } from '@clerk/clerk-expo';

const ProfileLayout = () => {
  // const { isSignedIn } = useAuth();

  // if (!isSignedIn) {
  //   return <Redirect href='/(onboarding)/onboard' />;
  // }

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
