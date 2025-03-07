import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingStep1() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text>Welcome to the App!</Text>
      <Text>Step 3: Learn about our amazing features.</Text>
      <Button
        title='Next'
        onPress={() => router.navigate('/(onboarding)/create-account')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
