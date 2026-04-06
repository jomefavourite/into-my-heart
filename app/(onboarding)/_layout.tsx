import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='onboard' options={{ headerShown: false }} />
      <Stack.Screen name='sign-up' options={{ headerShown: false }} />
      <Stack.Screen name='privacy' options={{ headerShown: false }} />
      <Stack.Screen name='terms' options={{ headerShown: false }} />
      <Stack.Screen
        name='account-deletion'
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
