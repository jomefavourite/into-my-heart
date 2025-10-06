import { View, Platform } from 'react-native';
import React from 'react';
import ThemedText from './ThemedText';
import HomeHeader from './Home/Header';
import { SafeAreaView } from 'react-native-safe-area-context';

const PageHeader = ({
  title,
  isWelcome,
}: {
  title: string;
  isWelcome?: boolean;
}) => {
  if (isWelcome === true) {
    return (
      <View className='top-0 z-50 bg-background web:sticky web:p-[18px]'>
        <HomeHeader isWelcome={isWelcome} />
      </View>
    );
  }

  return (
    <View className='sticky top-0 z-50 flex shrink-0 flex-row items-center justify-between bg-background p-[18px]'>
      <ThemedText className='text-[22px] font-semibold'>{title}</ThemedText>

      {Platform.OS === 'web' && <HomeHeader />}
    </View>
  );
};

export default PageHeader;
