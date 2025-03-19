import { View, Platform } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import ThemedText from '~/components/ThemedText';
import Container from '~/components/Container';
import CustomButton from '~/components/CustomButton';
import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useSSO } from '@clerk/clerk-expo';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      // Preloads the browser for Android devices to reduce authentication load time
      // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
      void WebBrowser.warmUpAsync();
      return () => {
        // Cleanup: closes browser when component unmounts
        void WebBrowser.coolDownAsync();
      };
    }
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function CreateAccount() {
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();

  const onGooglePress = useCallback(async () => {
    try {
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: 'oauth_google',

          redirectUrl: AuthSession.makeRedirectUri(),
        });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  const onApplePress = useCallback(async () => {
    try {
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: 'oauth_apple',

          redirectUrl: AuthSession.makeRedirectUri(),
        });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  return (
    <Container>
      <View className=''>
        <ThemedText type='title' className='text-center'>
          Create an account or Sign In
        </ThemedText>
        <ThemedText type='subtitle'>
          Keep your progress safe and sync across devices.
        </ThemedText>
      </View>

      <View className='gap-9'>
        <View className='gap-2'>
          <CustomButton onPress={onGooglePress}>
            Continue with Google
          </CustomButton>
          <CustomButton variant='outline' onPress={onApplePress}>
            Continue with Apple
          </CustomButton>
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
