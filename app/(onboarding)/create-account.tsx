import { View, Text } from 'react-native';
import React from 'react';
import { ThemedText } from '~/components/ThemedText';
import Container from '~/components/Container';
import CustomButton from '~/components/CustomButton';
import { Link, useRouter } from 'expo-router';

export default function CreateAccount() {
  const router = useRouter();
  return (
    <Container>
      <View className=''>
        <ThemedText type='title' className='text-center'>
          Create your free account
        </ThemedText>
        <ThemedText type='subtitle'>
          Keep your progress safe and sync across devices.
        </ThemedText>
      </View>

      <View className='gap-9'>
        <View className='gap-2'>
          <CustomButton onPress={() => router.push('/(tabs)')}>
            Continue with Google
          </CustomButton>
          <CustomButton variant='outline'>Continue with Email</CustomButton>
        </View>
        <ThemedText className='text-center '>
          Do you have an account?{' '}
          <Link href={'/'} className='font-medium'>
            Sign In
          </Link>
        </ThemedText>
      </View>

      <ThemedText className='text-center text-sm'>
        By signing up, you agree to our Terms and have read our Privacy Policy
      </ThemedText>
    </Container>
  );
}
