import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '~/components/CustomButton';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function OnboardingStep1() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text className='text-black dark:text-white'>Welcome to the App!</Text>
      <Text>Step 1: Learn about our amazing features.</Text>
      <Button onPress={() => router.push('/step2')}>
        <Text>ksljsd</Text>
      </Button>
      <CustomButton />
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
