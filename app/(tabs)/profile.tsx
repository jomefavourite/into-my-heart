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
import { useAuth, useUser } from '@clerk/clerk-react';

export default function ProfileScreen() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();
  const { signOut } = useAuth();
  const { user } = useUser();

  return (
    <Container>
      <ThemedText>ProfileScreen</ThemedText>
      <ThemedText>{user?.primaryEmailAddress?.emailAddress}</ThemedText>

      <CustomButton variant='outline' onPress={() => signOut()}>
        Sign out
      </CustomButton>

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
