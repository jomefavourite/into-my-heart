import React from 'react';
import { Stack } from 'expo-router';

export default function __layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
