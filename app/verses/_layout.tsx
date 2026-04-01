import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@clerk/clerk-expo';

export default function VersesLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isDarkMode } = useColorScheme();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: isDarkMode ? 'hsl(240 10% 3.9%)' : 'hsl(0 0% 100%)',
        },
        headerStyle: {
          backgroundColor: isDarkMode ? 'hsl(240 10% 3.9%)' : 'hsl(0 0% 100%)',
        },
      }}
    >
      <Stack.Screen name='select-book' options={{ headerShown: false }} />
      <Stack.Screen name='select-verses' options={{ headerShown: false }} />
      <Stack.Screen name='verse-summary' options={{ headerShown: false }} />
      <Stack.Screen
        name='all-verses-suggestions'
        options={{ headerShown: false }}
      />
      <Stack.Screen name='create-collection' options={{ headerShown: false }} />
      <Stack.Screen
        name='create-affirmation'
        options={{ headerShown: false }}
      />
      <Stack.Screen name='all-verses' options={{ headerShown: false }} />
      <Stack.Screen name='all-collections' options={{ headerShown: false }} />
      <Stack.Screen name='all-affirmations' options={{ headerShown: false }} />
      <Stack.Screen name='[verseId]' options={{ headerShown: false }} />
      <Stack.Screen
        name='collection/[collectionId]'
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
