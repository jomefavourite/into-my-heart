import '~/global.css';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useCallback } from 'react';
import {
  Theme,
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loaded] = useFonts({
    Inter: require('../assets/fonts/Inter.ttf'),
  });

  const checkOnboardingStatus = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem('onboarded');

      setIsOnboarded(
        value === 'true' || value === null ? value === 'true' : false
      );
    } catch (e) {
      console.error('Error reading onboarding status:', e);
      setIsOnboarded(false); // Assume not onboarded on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     const theme = await AsyncStorage.getItem('theme');
  //     if (Platform.OS === 'web') {
  //       // Adds the background color to the html element to prevent white background on overscroll.
  //       document.documentElement.classList.add('bg-background');
  //     }
  //     if (!theme) {
  //       AsyncStorage.setItem('theme', colorScheme);
  //       setIsColorSchemeLoaded(true);
  //       return;
  //     }
  //     const colorTheme = theme === 'dark' ? 'dark' : 'light';
  //     if (colorTheme !== colorScheme) {
  //       setColorScheme(colorTheme);

  //       setIsColorSchemeLoaded(true);
  //       return;
  //     }
  //     setIsColorSchemeLoaded(true);
  //   })().finally(() => {
  //     SplashScreen.hideAsync();
  //   });
  // }, []);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === 'web') {
      document.documentElement.classList.add('bg-background');
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  useEffect(() => {
    checkOnboardingStatus();
  }, [checkOnboardingStatus]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!isColorSchemeLoaded || !loaded) {
    return null;
  }

  // Create a stable reference to the Stack.Screen components
  const OnboardingScreen = (
    <Stack.Screen
      name='(onboarding)'
      options={{ headerShown: false }}
      key='onboarding'
    />
  );
  const TabsScreen = (
    <Stack.Screen
      name='(tabs)'
      options={{ headerShown: false, headerBackVisible: false }}
      key='tabs'
    />
  );

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <ConvexProvider client={convex}>
        <Stack>
          {isLoading
            ? null // Render nothing while loading
            : isOnboarded === false
              ? OnboardingScreen
              : TabsScreen}

          <Stack.Screen name='+not-found' />
        </Stack>
      </ConvexProvider>
      <StatusBar style='auto' />
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined'
    ? React.useEffect
    : React.useLayoutEffect;
