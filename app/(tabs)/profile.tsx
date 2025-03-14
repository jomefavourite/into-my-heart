import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Container from '~/components/Container';

import AsyncStorage from '@react-native-async-storage/async-storage';
// import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
// import { MoonStar } from '~/lib/icons/MoonStar';
// import { Sun } from '~/lib/icons/Sun';

import { cn } from '~/lib/utils';
import { useColorScheme } from '~/hooks/useColorScheme';
import ThemedText from '~/components/ThemedText';
import CustomButton from '~/components/CustomButton';

export default function ProfileScreen() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  return (
    <Container>
      <ThemedText>ProfileScreen</ThemedText>

      <CustomButton
        onPress={() => {
          const newTheme = isDarkColorScheme ? 'light' : 'dark';
          setColorScheme(newTheme);
          // setAndroidNavigationBar(newTheme);
          AsyncStorage.setItem('theme', newTheme);
        }}
      >
        {isDarkColorScheme ? 'Light mode' : 'Dark mode'}
      </CustomButton>
    </Container>
  );
}
