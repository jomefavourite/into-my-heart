import { Redirect, Stack } from 'expo-router';
import { useConvexAuth } from 'convex/react';

export default function OnboardingLayout() {
  const { isAuthenticated } = useConvexAuth();

  if (isAuthenticated) {
    return <Redirect href={'/'} />;
  }

  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='step2' options={{ headerShown: false }} />
      <Stack.Screen name='step3' options={{ headerShown: false }} />
      <Stack.Screen name='create-account' options={{ headerShown: false }} />
    </Stack>
  );
}
