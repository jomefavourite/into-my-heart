import '@/global.css';

import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import {
  Theme,
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ConvexReactClient, useConvexAuth, useMutation } from 'convex/react';
import {
  ClerkLoaded,
  ClerkProvider,
  useAuth,
  useUser,
} from '@clerk/clerk-expo';
// import { tokenCache } from '@/cache';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import AllBottomSheet from '@/components/AllBottomSheet';
import TabBarSidebar from '@/components/TabBarSidebar';
import { PortalHost } from '@rn-primitives/portal';
import { ConvexQueryCacheProvider } from 'convex-helpers/react/cache';
import * as SystemUI from 'expo-system-ui';
import { ConvexQueryClient } from '@convex-dev/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/global.css';
import { NAV_THEME } from '@/lib/theme';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';
import { AlertProvider } from '@/hooks/useAlert';
import { api } from '@/convex/_generated/api';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light.colors,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark.colors,
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
  const { user } = useUser();
  const { isAuthenticated: isConvexAuthenticated } = useConvexAuth();
  const ensureCurrentUser = useMutation(api.users.ensureCurrentUser);
  const syncedClerkId = React.useRef<string | null>(null);
  const segments = useSegments();
  const router = useRouter();
  const navigationAttempted = React.useRef(false);
  const currentRoute = React.useRef<string>('');
  const authCheckAttempted = React.useRef(false);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(false);

  // This prevent flash of white on navigation
  // Use useEffect to prevent infinite loops
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(
      isDarkMode
        ? NAV_THEME.dark.colors.background
        : NAV_THEME.light.colors.background
    );
  }, [isDarkMode]);

  useFrameworkReady();

  useEffect(() => {
    if (!isSignedIn) {
      syncedClerkId.current = null;
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !isConvexAuthenticated || !user) return;
    if (syncedClerkId.current === user.id) return;

    const primaryEmail =
      user.primaryEmailAddress?.emailAddress ??
      user.emailAddresses[0]?.emailAddress;
    if (!primaryEmail) return;

    let cancelled = false;

    const syncCurrentUser = async () => {
      try {
        await ensureCurrentUser({
          email: primaryEmail,
          first_name: user.firstName ?? undefined,
          last_name: user.lastName ?? undefined,
          imageUrl: user.imageUrl ?? undefined,
        });
        if (!cancelled) {
          syncedClerkId.current = user.id;
        }
      } catch (error) {
        console.warn('InitialLayout - Failed to ensure current user', error);
      }
    };

    syncCurrentUser();

    return () => {
      cancelled = true;
    };
  }, [ensureCurrentUser, isConvexAuthenticated, isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (!isLoaded || isCheckingAuth) return;

    const currentPath = segments.join('/');
    const inAuthGroup = segments[0] === '(onboarding)';

    // Add development mode guard to prevent redirects during hot reloads
    if (__DEV__) {
      // In development, only redirect from root path or when explicitly needed
      if (currentPath === '' || currentPath === '/') {
        if (isSignedIn) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(onboarding)/onboard');
        }
      }
      return;
    }

    // Only run auth check on initial load or auth state changes
    const shouldRedirect =
      (isSignedIn && inAuthGroup && !navigationAttempted.current) ||
      (!isSignedIn && !inAuthGroup && !navigationAttempted.current);

    if (!shouldRedirect) return;

    // Prevent navigation loops
    if (currentRoute.current === currentPath && navigationAttempted.current) {
      return;
    }

    currentRoute.current = currentPath;

    // Add debounce to prevent rapid auth checks during development
    setIsCheckingAuth(true);
    const timeoutId = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 300);

    // Add delay to ensure authentication state is stable
    const authCheck = async () => {
      if (authCheckAttempted.current) return;
      authCheckAttempted.current = true;

      // Wait a bit for authentication state to stabilize
      await new Promise(resolve => setTimeout(resolve, 100));

      // Only redirect if necessary and safe to do so
      if (isSignedIn && inAuthGroup) {
        try {
          navigationAttempted.current = true;
          console.log('InitialLayout - Redirecting to tabs');
          router.replace('/(tabs)');
        } catch (error) {
          console.warn('Navigation error:', error);
          navigationAttempted.current = false;
        }
      } else if (!isSignedIn && !inAuthGroup) {
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

    return () => clearTimeout(timeoutId);
  }, [isLoaded, isSignedIn]);

  const { width } = useWindowDimensions();

  if (Platform.OS === 'web' && width > 768) {
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (!inOnboardingGroup) {
      return <TabBarSidebar />;
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
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <ConvexQueryCacheProvider>
            <QueryClientProvider client={queryClient}>
              <ThemeProviderWrapper />
            </QueryClientProvider>
          </ConvexQueryCacheProvider>
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

function ThemeProviderWrapper() {
  const { isDarkMode } = useColorScheme();

  // Memoize the theme to prevent unnecessary re-renders
  const theme = React.useMemo(
    () => (isDarkMode ? DARK_THEME : LIGHT_THEME),
    [isDarkMode]
  );

  return (
    <ThemeProvider value={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <AlertProvider>
            <ToastProvider>
              <InitialLayout isDarkMode={isDarkMode} />
            </ToastProvider>
          </AlertProvider>
          <PortalHost />
          <StatusBar style='auto' />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

// export default Sentry.wrap(RootLayout);
export default RootLayout;

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined'
    ? React.useEffect
    : React.useLayoutEffect;
