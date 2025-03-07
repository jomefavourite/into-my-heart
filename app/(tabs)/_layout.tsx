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
        // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        // tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
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
