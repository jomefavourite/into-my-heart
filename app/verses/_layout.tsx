import { Redirect, Stack } from 'expo-router';
import { useConvexAuth } from 'convex/react';

export default function VersesLayout() {
  const { isAuthenticated } = useConvexAuth();

  // if (isAuthenticated) {
  //   return <Redirect href={'/'} />;
  // }

  return (
    <Stack>
      <Stack.Screen name='select-book' options={{ headerShown: false }} />
      <Stack.Screen name='select-verses' options={{ headerShown: false }} />
      <Stack.Screen name='verse-summary' options={{ headerShown: false }} />
      <Stack.Screen name='verse-suggestions' options={{ headerShown: false }} />
      <Stack.Screen name='create-collection' options={{ headerShown: false }} />
      <Stack.Screen name='all-verses' options={{ headerShown: false }} />
      <Stack.Screen name='all-collections' options={{ headerShown: false }} />
      <Stack.Screen name='[verseId]' options={{ headerShown: false }} />
      <Stack.Screen name='[collectionId]' options={{ headerShown: false }} />
    </Stack>
  );
}
