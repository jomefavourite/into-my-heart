import { View, Platform } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import ThemedText from '@/components/ThemedText';
import CustomButton from '@/components/CustomButton';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useSSO } from '@clerk/clerk-expo';
import Logo from '@/components/icons/logo/Logo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useAlert } from '@/hooks/useAlert';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

/**
 * Minimal & robust Safari detection:
 * - On web only, true Safari is UA contains "safari" but not "chrome"/"crios"/"fxios"/"edg".
 */
const useIsSafari = () => {
  return useMemo(() => {
    if (Platform.OS !== 'web') return false;
    const ua = (navigator.userAgent || navigator.vendor || '').toLowerCase();
    const isSafariEngine =
      ua.includes('safari') &&
      !ua.includes('chrome') &&
      !ua.includes('crios') &&
      !ua.includes('fxios') &&
      !ua.includes('edg');
    return isSafariEngine;
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function CreateAccount() {
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();
  const isSafari = useIsSafari();
  const { alert } = useAlert();

  // Guard against double-taps and let us show retry UI if popup was blocked.
  const inFlight = useRef(false);
  const [showSafariPopupHelp, setShowSafariPopupHelp] = React.useState(false);

  // Use a stable redirect URL. Prefer no proxy on web; proxy is fine on native.
  // const redirectUrl = useMemo(
  //   () =>
  //     AuthSession.makeRedirectUri({
  //       preferLocalhost: true,
  //       useProxy: Platform.OS !== 'web',

  //     }),
  //   []
  // );

  const redirectUrl = AuthSession.makeRedirectUri({
    scheme: 'into-my-heart',
    path: 'auth',
    preferLocalhost: Platform.OS === 'web',
  });

  const runGoogleSSO = useCallback(async () => {
    const { createdSessionId, setActive /* signIn, signUp */ } =
      await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl,
      });
    if (createdSessionId) {
      await setActive!({ session: createdSessionId });
    }
  }, [redirectUrl, startSSOFlow]);

  const onGooglePress = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setShowSafariPopupHelp(false);

    // Optional, friendly heads-up for Safari users.
    if (isSafari) {
      // Non-blocking: we *don't* await this; we still kick SSO immediately.
      alert(
        'Allow pop-ups for Google sign-in',
        'Safari may block the sign-in window. If nothing opens, enable pop-ups for this site and tap Retry.'
      );
    }

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

      // Typical signals we treat as "popup blocked / dismissed"
      const msg = String((err as any)?.message || err);
      const name = String((err as any)?.name || '');
      const looksBlocked =
        /blocked|not allowed|dismissed|cancel/i.test(msg) ||
        /AbortError|Canceled|ERR_WEBBROWSER/i.test(name + ' ' + msg);

      if (isSafari && looksBlocked) {
        // Show inline help + Retry button
        setShowSafariPopupHelp(true);
      } else {
        console.error('Google SSO error:', err);
        alert('Sign-in failed', 'Please try again.');
      }
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
    <SafeAreaView className='flex-1'>
      <View className='flex flex-1 flex-col justify-between p-[18px]'>
        <Link href='/' className='flex items-center'>
          <Logo />
        </Link>

        <View className='md:mx-auto md:max-w-sm'>
          <View className=''>
            <View className=''>
              <ThemedText
                size={18}
                variant='medium'
                className='text-center text-lg font-semibold md:text-2xl'
              >
                Sign in or Create an account
              </ThemedText>

              <ThemedText
                size={14}
                className='mx-auto mt-2 max-w-[260px] text-center'
              >
                Keep your progress safe and sync across devices.
              </ThemedText>
            </View>

            <View className='my-12 gap-3'>
              <CustomButton onPress={onGooglePress}>
                Continue with Google
              </CustomButton>
              {/* <CustomButton variant='outline' onPress={onApplePress}>
                Continue with Apple
              </CustomButton> */}
            </View>
          </View>
        </View>

        <ThemedText size={12} className='text-center text-sm'>
          By signing up, you agree to our Terms and have read our Privacy Policy
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}
