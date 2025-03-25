import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Tabs } from 'expo-router';
import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
import { Button, Platform, StyleSheet, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import GoalsIcon from '~/assets/icons/tabs/GoalsIcon';
import HomeIcon from '~/assets/icons/tabs/HomeIcon';
import PracticeIcon from '~/assets/icons/tabs/PracticeIcon';
import VersesIcon from '~/assets/icons/tabs/VersesIcon';
import ThemedText from '~/components/ThemedText';

// import { HapticTab } from '~/components/HapticTab';
// import { IconSymbol } from '~/components/ui/IconSymbol';
// import TabBarBackground from '~/components/ui/TabBarBackground';
// import { Colors } from '~/constants/Colors';
import { useColorScheme } from '~/hooks/useColorScheme';
import { useBottomSheetStore } from '~/lib/utils';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetIndex = useBottomSheetStore(
    (state) => state.bottomSheetIndex
  );
  const setBottomSheetIndex = useBottomSheetStore(
    (state) => state.setBottomSheetIndex
  );

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

      <BottomSheet
        ref={bottomSheetRef}
        index={bottomSheetIndex}
        snapPoints={['50%']}
        enablePanDownToClose={true}
        onChange={(index) => setBottomSheetIndex(index)}
        backgroundStyle={{
          backgroundColor: isDarkMode ? '#313131' : '#fff',
        }}
        style={{
          boxShadow: isDarkMode
            ? '0px -4px 26px rgba(0,0,0, 0.5)'
            : '0px -4px 26px rgba(0,0,0, 0.1)',
          borderRadius: 30,
        }}
      >
        <BottomSheetView
          // style={styles.shadow}
          className='flex-1 p-4 '
        >
          <View className='mx-auto mt-6 mb-6'>
            <Svg width={100} height={100} fill='none'>
              <Path
                fill={isDarkMode ? '#fff' : '#313131'}
                d='M50.5 89.587c18.41 0 33.333-14.924 33.333-33.334 0-12.337-6.703-28.724-16.667-38.191l-8.333 11.101-14.583-18.75C29.666 20.83 17.166 39.98 17.166 56.253c0 18.41 14.924 33.334 33.334 33.334Z'
              />
              <Path
                fill={isDarkMode ? '#313131' : '#fff'}
                stroke={isDarkMode ? '#313131' : '#fff'}
                strokeLinejoin='round'
                strokeWidth={5}
                d='M50.5 77.08c9.205 0 16.667-8.395 16.667-18.75 0-3.296-.756-6.393-2.083-9.085l-8.334 7.001-12.5-16.67C40.084 43.741 33.834 50.46 33.834 58.33c0 10.355 7.462 18.75 16.666 18.75Z'
              />
            </Svg>
          </View>
          <ThemedText className='text-black text-center font-medium dark:text-white mb-6'>
            Every day you practice, you're strengthening your memory and hiding
            God's Word in your heart.
          </ThemedText>
        </BottomSheetView>
      </BottomSheet>
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
