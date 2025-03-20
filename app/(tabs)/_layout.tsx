import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import GoalsIcon from '~/assets/icons/tabs/GoalsIcon';
import HomeIcon from '~/assets/icons/tabs/HomeIcon';
import PracticeIcon from '~/assets/icons/tabs/PracticeIcon';
import VersesIcon from '~/assets/icons/tabs/VersesIcon';

// import { HapticTab } from '~/components/HapticTab';
// import { IconSymbol } from '~/components/ui/IconSymbol';
// import TabBarBackground from '~/components/ui/TabBarBackground';
// import { Colors } from '~/constants/Colors';
import { useColorScheme } from '~/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: '#313131',
        headerShown: false,
        // tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
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
        name='home'
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
          // tabBarStyle: {
          //   backgroundColor: '#ff0000',
          // },
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
    </Tabs>
  );
}
