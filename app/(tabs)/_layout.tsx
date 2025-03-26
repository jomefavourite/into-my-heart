import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import GoalsIcon from '~/assets/icons/tabs/GoalsIcon';
import HomeIcon from '~/assets/icons/tabs/HomeIcon';
import PracticeIcon from '~/assets/icons/tabs/PracticeIcon';
import VersesIcon from '~/assets/icons/tabs/VersesIcon';
import AllBottomSheet from '~/components/AllBottomSheet';

export default function TabLayout() {
  return (
    <>
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

      <AllBottomSheet />
    </>
  );
}

const styles = StyleSheet.create({
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -2, // Adjust for desired shadow direction
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        // elevation: 5, // Adjust elevation for desired shadow intensity
        shadowColor: '#000', // Android shadow color (optional, but good practice)
        backgroundColor: 'white', // Android needs a background color
      },
    }),
  },
  sheetContainerShadow: {
    // borderTopColor: 'red',
    // borderWidth: 3,

    boxShadow: '0px -4px 26px rgba(0,0,0, 0.1)',
    borderRadius: 30,

    // ...Platform.select({
    //   ios: {
    //     shadowOffset: {
    //       width: 0,
    //       height: 12,
    //     },
    //     shadowOpacity: 0.75,
    //     shadowRadius: 16.0,
    //     shadowColor: '#000',
    //   },
    //   android: {
    //     elevation: 5,
    //     shadowColor: 'red',
    //     shadowOffset: {
    //       width: 20,
    //       height: 10,
    //     },
    //     shadowOpacity: 0.22,
    //     shadowRadius: 2.22,
    //     // border: '1px solid red',
    //   },
    //   web: {
    //     boxShadow: '0px -4px 26px rgba(0,0,0, 0.1)',
    //   },
    // }),
  },
});
