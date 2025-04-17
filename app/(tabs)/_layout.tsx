import { Tabs } from 'expo-router';
import React from 'react';
import GoalsIcon from '~/assets/icons/tabs/GoalsIcon';
import HomeIcon from '~/assets/icons/tabs/HomeIcon';
import PracticeIcon from '~/assets/icons/tabs/PracticeIcon';
import ProfileIcon from '~/assets/icons/tabs/ProfileIcon';
import VersesIcon from '~/assets/icons/tabs/VersesIcon';

export default function TabLayout() {
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
            tabBarIcon: ({ color }) => <VersesIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name='practice'
          options={{
            title: 'Practice',
            tabBarIcon: ({ color }) => <PracticeIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name='goals'
          options={{
            title: 'Goals',
            tabBarIcon: ({ color }) => <GoalsIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
