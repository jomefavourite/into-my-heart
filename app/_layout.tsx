import '~/global.css';

import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import {
  Theme,
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
  NavigationContainer,
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
import * as SystemUI from 'expo-system-ui';
import { ConvexQueryClient } from '@convex-dev/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

// const convexQueryClient = new ConvexQueryClient(convex);
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       queryKeyHashFn: convexQueryClient.hashFn(),
//       queryFn: convexQueryClient.queryFn(),
//     },
//   },
// });
// convexQueryClient.connect(queryClient);

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

function InitialLayout({ isDarkMode }: { isDarkMode: boolean }) {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationAttempted = React.useRef(false);
  const currentRoute = React.useRef<string>('');
  const authCheckAttempted = React.useRef(false);

  // This prevent flash of white on navigation
  SystemUI.setBackgroundColorAsync(
    isDarkMode ? NAV_THEME.dark.background : NAV_THEME.light.background
  );

  useFrameworkReady();

  useEffect(() => {
    if (!isLoaded || navigationAttempted.current) return;

    const currentPath = segments.join('/');

    // Prevent navigation loops
    if (currentRoute.current === currentPath) {
      return;
    }

    currentRoute.current = currentPath;

    const inAuthGroup = segments[0] === '(onboarding)';
    const inTabsGroup = segments[0] === '(tabs)';

    // Add delay to ensure authentication state is stable
    const authCheck = async () => {
      if (authCheckAttempted.current) return;
      authCheckAttempted.current = true;

      // Wait a bit for authentication state to stabilize
      await new Promise(resolve => setTimeout(resolve, 100));

      // Only redirect if necessary and safe to do so
      if (isSignedIn && inAuthGroup) {
        // Only redirect if we're actually in the onboarding group
        try {
          navigationAttempted.current = true;
          console.log('InitialLayout - Redirecting to tabs');
          router.replace('/(tabs)');
        } catch (error) {
          console.warn('Navigation error:', error);
          navigationAttempted.current = false;
        }
      } else if (!isSignedIn && !inAuthGroup) {
        // Only redirect if we're not already in the onboarding group
        try {
          navigationAttempted.current = true;
          console.log('InitialLayout - Redirecting to onboarding');
          router.replace('/(onboarding)/onboard');
        } catch (error) {
          console.warn('Navigation error:', error);
          navigationAttempted.current = false;
        }
      }
    };

    authCheck();
  }, [isLoaded, isSignedIn, segments, router]);

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

      {/* <AllBottomSheet /> */}
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
          <QueryClientProvider client={queryClient}>
            <ThemeProvider value={isDarkMode ? DARK_THEME : LIGHT_THEME}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <InitialLayout isDarkMode={isDarkMode} />
                <PortalHost />
                <StatusBar style='auto' />
              </GestureHandlerRootView>
            </ThemeProvider>
          </QueryClientProvider>
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
