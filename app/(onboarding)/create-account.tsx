import { View, Platform } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import ThemedText from '~/components/ThemedText';
import Container from '~/components/Container';
import CustomButton from '~/components/CustomButton';
import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useSSO } from '@clerk/clerk-expo';
import Logo from '~/components/icons/logo/Logo';

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
      <Logo />
      <View className='flex-1 h-full md:max-w-sm md:mx-auto'>
        <View className=''>
          <View className=''>
            <ThemedText className='text-center text-lg md:text-2xl font-semibold'>
              Create an account or Sign In
            </ThemedText>
            <ThemedText className='text-secondary-text text-center mt-2'>
              Keep your progress safe and sync <br /> across devices.
            </ThemedText>
          </View>

          <View className=''>
            <View className='gap-2 my-12'>
              <CustomButton onPress={onGooglePress}>
                Continue with Google
              </CustomButton>
              <CustomButton variant='outline' onPress={onApplePress}>
                Continue with Apple
              </CustomButton>
            </View>
            <ThemedText className='text-center text-secondary-text'>
              Do you have an account?{' '}
              <Link
                href={'/create-account'}
                className='font-semibold text-black '
              >
                Sign In
              </Link>
            </ThemedText>
          </View>
        </View>
      </View>
      <ThemedText className='text-center text-secondary-text text-sm'>
        By signing up, you agree to our Terms and have read our Privacy Policy
      </ThemedText>
    </Container>
  );
}
