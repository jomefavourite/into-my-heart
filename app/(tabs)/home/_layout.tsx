import React from 'react';
import { Stack } from 'expo-router';

const HomeLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: 'Home',
          headerTitle: '',
          // headerShadowVisible: false,
          headerShown: false,
          // headerStyle: {
          //   backgroundColor: '#f5f5f5',
          // },
          // headerLeft: () => <HeaderLeft />,
          // headerRight: () => <HeaderRight />,
        }}
      />
      <Stack.Screen
        name='notifications'
        options={{
          title: 'Notifications',
          // presentation: 'card',
        }}
      />
    </Stack>
  );
};

export default HomeLayout;
