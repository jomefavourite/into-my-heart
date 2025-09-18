import React from 'react';
import { Stack } from 'expo-router';

const PracticeLayout = () => {
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
        {/* <Stack.Screen
          name='recitation'
          options={{
            headerShown: false,
          }}
        /> */}
      </Stack>
    </>
  );
};

export default PracticeLayout;
