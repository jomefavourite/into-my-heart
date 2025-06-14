import { Redirect, Stack } from 'expo-router';
import { useConvexAuth } from 'convex/react';
import { useAuth } from '@clerk/clerk-expo';

export default function OnboardingLayout() {
  const { isAuthenticated } = useConvexAuth();
  const { isSignedIn, isLoaded } = useAuth();

  if (isAuthenticated) {
    return <Redirect href={'/'} />;
  }

  if (isSignedIn) {
    return <Redirect href={'/'} />;
  }

  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='step2' options={{ headerShown: false }} />
      <Stack.Screen name='step3' options={{ headerShown: false }} />
      <Stack.Screen name='onboard' options={{ headerShown: false }} />
    </Stack>
  );
}
