import '~/global.css';

import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import {
  Theme,
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {
  Redirect,
  Slot,
  Stack,
  useNavigationContainerRef,
  useRouter,
  useSegments,
} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/hooks/useColorScheme';
import { useFrameworkReady } from '~/hooks/useFrameworkReady';
import { ConvexReactClient } from 'convex/react';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '~/cache';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import AllBottomSheet from '~/components/AllBottomSheet';
import TabBarSidebar from '~/components/TabBarSidebar';
import { PortalHost } from '@rn-primitives/portal';
import { ConvexQueryCacheProvider } from 'convex-helpers/react/cache';

// import * as Sentry from '@sentry/react-native';
// import { isRunningInExpoGo } from 'expo';

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

// const navigationIntegration = Sentry.reactNavigationIntegration({
//   enableTimeToInitialDisplay: !isRunningInExpoGo(),
// });

// Sentry.init({
//   dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
//   attachStacktrace: true,
//   debug: process.env.NODE_ENV !== 'production',
//   sendDefaultPii: true,
//   integrations: [
//     // Pass integration
//     navigationIntegration,
//   ],
//   enableNativeFramesTracking: !isRunningInExpoGo(),
// });

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useFrameworkReady();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === '(onboarding)';

    if (isSignedIn && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!isSignedIn && !inAuthGroup) {
      router.replace('/(onboarding)/onboard');
    }
  }, [isSignedIn]);

  // const ref = useNavigationContainerRef();

  // useEffect(() => {
  //   if (ref?.current) {
  //     navigationIntegration.registerNavigationContainer(ref);
  //   }
  // }, [ref]);

  const { width } = useWindowDimensions();

  if (Platform.OS === 'web' && width > 768) {
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (!inOnboardingGroup) {
      return (
        <View className='flex-1 '>
          <TabBarSidebar />
        </View>
      );
    }
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />

      <AllBottomSheet />
    </>
  );
}

function RootLayout() {
  const hasMounted = React.useRef(false);
  const { isDarkMode } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
  }

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
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!isColorSchemeLoaded || !loaded) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      {/* <ClerkLoaded> */}
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ConvexQueryCacheProvider>
          <ThemeProvider value={isDarkMode ? DARK_THEME : LIGHT_THEME}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <InitialLayout />
              <PortalHost />
              <StatusBar style='auto' />
            </GestureHandlerRootView>
          </ThemeProvider>
        </ConvexQueryCacheProvider>
      </ConvexProviderWithClerk>
      {/* </ClerkLoaded> */}
    </ClerkProvider>
  );
}

// export default Sentry.wrap(RootLayout);
export default RootLayout;

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined'
    ? React.useEffect
    : React.useLayoutEffect;
