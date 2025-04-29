import { View, Text, Platform, useWindowDimensions } from 'react-native';
import React from 'react';
import TabBarSidebar from '~/components/TabBarSidebar';
import { Slot } from 'expo-router';

export default function Layout() {
  const { width } = useWindowDimensions();

  if (Platform.OS === 'web' && width > 720) {
    return (
      <View className='flex-1 max-w-7xl mx-auto'>
        <TabBarSidebar />
      </View>
    );
  }
  return <Slot />;
}
