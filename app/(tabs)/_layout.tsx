import { Slot, Tabs } from 'expo-router';
import React from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import HomeIcon from '@/components/icons/tabs/HomeIcon';
import PracticeIcon from '@/components/icons/tabs/PracticeIcon';
import ProfileIcon from '@/components/icons/tabs/ProfileIcon';
import VersesIcon from '@/components/icons/tabs/VersesIcon';
import { useAuth } from '@clerk/clerk-expo';

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return null;
  }

  if (Platform.OS === 'web' && width > 720) {
    return <Slot />;
  }

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            paddingTop: 15,
            paddingBottom: 15,
            height: 82,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 500,
          },
          tabBarItemStyle:
            Platform.OS === 'web'
              ? {
                  flexDirection: 'column',
                  alignItems: 'center',
                }
              : undefined,
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
          }}
        />
        <Tabs.Screen
          name='verses'
          options={{
            title: 'Verses',
            tabBarIcon: ({ focused }) => <VersesIcon focused={focused} />,
          }}
        />
        <Tabs.Screen
          name='memorize'
          options={{
            title: 'Memorize',
            tabBarIcon: ({ focused }) => <PracticeIcon focused={focused} />,
          }}
        />
        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => <ProfileIcon focused={focused} />,
          }}
        />
      </Tabs>
    </>
  );
}
