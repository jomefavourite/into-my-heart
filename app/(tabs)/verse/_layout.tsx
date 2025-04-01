import React from 'react';
import { Stack } from 'expo-router';

const VersesLayout = () => {
  return (
    <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }} />
    </Stack>
  )
};

export default VersesLayout;
