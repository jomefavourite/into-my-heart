import { Slot, Tabs } from 'expo-router';
import React from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import GoalsIcon from '~/assets/icons/tabs/GoalsIcon';
import HomeIcon from '~/assets/icons/tabs/HomeIcon';
import PracticeIcon from '~/assets/icons/tabs/PracticeIcon';
import ProfileIcon from '~/assets/icons/tabs/ProfileIcon';
import VersesIcon from '~/assets/icons/tabs/VersesIcon';

export default function TabLayout() {
  const { width } = useWindowDimensions();

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
            fontFamily: 'Inter',
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
          name='practice'
          options={{
            title: 'Practice',
            tabBarIcon: ({ focused }) => <PracticeIcon focused={focused} />,
          }}
        />
        <Tabs.Screen
          name='goals'
          options={{
            title: 'Goals',
            tabBarIcon: ({ focused }) => <GoalsIcon focused={focused} />,
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
