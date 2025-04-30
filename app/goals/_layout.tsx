import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';
import { useAuth } from '@clerk/clerk-expo';

const GoalsLayout = () => {
  const { isSignedIn } = useAuth();

  // if (!isSignedIn) {
  //   return <Redirect href='/(onboarding)/create-account' />;
  // }

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
        <Stack.Screen
          name='[goalName]'
          options={{
            title: '',
            headerShown: false,
          }}
        />
      </Stack>

      <PortalHost />
    </>
  );
};

export default GoalsLayout;
