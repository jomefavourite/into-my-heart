import { Redirect, Stack } from 'expo-router';
import { useConvexAuth } from 'convex/react';

export default function VersesLayout() {
  const { isAuthenticated } = useConvexAuth();

  // if (isAuthenticated) {
  //   return <Redirect href={'/'} />;
  // }

  return (
    <Stack>
      <Stack.Screen name='add-book' options={{ headerShown: false }} />
      <Stack.Screen name='select-verses' options={{ headerShown: false }} />
    </Stack>
  );
}
