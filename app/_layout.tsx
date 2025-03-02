import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    async function checkOnboardingStatus() {
      try {
        const value = await AsyncStorage.getItem('onboarded');
        if (value !== null) {
          setIsOnboarded(value === 'true');
        } else {
          setIsOnboarded(false); // Default to onboarding if not set
        }
      } catch (e) {
        console.error('Error reading onboarding status:', e);
        setIsOnboarded(false); // Assume not onboarded on error
      } finally {
        setIsLoading(false);
      }
    }

    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // if (isLoading) {
  //   return <SplashScreen />; // Or a loading indicator
  // }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {isOnboarded === false ? (
          <Stack.Screen name='(onboarding)' options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        )}
        {/* <Stack.Screen name='(onboarding)' options={{ headerShown: false }} /> */}

        {/* <Stack.Screen name='(tabs)' options={{ headerShown: false }} /> */}
        {/* <Stack.Screen name='+not-found' /> */}
      </Stack>
      <StatusBar style='auto' />
    </ThemeProvider>
  );
}
