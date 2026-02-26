import { View, Platform } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import ThemedText from '@/components/ThemedText';
import CustomButton from '@/components/CustomButton';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useSSO, useSignIn, useSignUp } from '@clerk/clerk-expo';
import Logo from '@/components/icons/logo/Logo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useAlert } from '@/hooks/useAlert';
import { Input } from '@/components/ui/input';

type ClerkErrorLike = {
  errors?: Array<{
    message?: string;
    longMessage?: string;
  }>;
};

const getClerkErrorMessage = (error: unknown) => {
  const clerkError = error as ClerkErrorLike;
  const firstError = clerkError?.errors?.[0];

  if (firstError?.longMessage) return firstError.longMessage;
  if (firstError?.message) return firstError.message;
  if (error instanceof Error && error.message) return error.message;
  return 'Please try again.';
};

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
  const { isLoaded: signInLoaded, signIn, setActive: setSignInActive } =
    useSignIn();
  const { isLoaded: signUpLoaded, signUp, setActive: setSignUpActive } =
    useSignUp();
  const isSafari = useIsSafari();
  const { alert } = useAlert();

  const isDevEmailAuthEnabled = __DEV__;

  // Guard against double-taps and let us show retry UI if popup was blocked.
  const inFlight = useRef(false);
  const [showSafariPopupHelp, setShowSafariPopupHelp] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'signIn' | 'signUp'>('signIn');
  const [devAuthStep, setDevAuthStep] = React.useState<
    'credentials' | 'verifyEmail'
  >('credentials');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [verificationCode, setVerificationCode] = React.useState('');
  const [isDevAuthLoading, setIsDevAuthLoading] = React.useState(false);
  const [devAuthMessage, setDevAuthMessage] = React.useState('');

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
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl,
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
    } finally {
      inFlight.current = false;
    }
  }, [alert, isSafari, redirectUrl, startSSOFlow]);

  const onDevSignInPress = useCallback(async () => {
    if (!isDevEmailAuthEnabled) return;

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password.trim()) {
      alert('Missing details', 'Enter both email and password.');
      return;
    }

    if (!signInLoaded || !setSignInActive) {
      alert('Auth loading', 'Please wait a moment and try again.');
      return;
    }

    setIsDevAuthLoading(true);
    setDevAuthMessage('');

    try {
      const attempt = await signIn.create({
        identifier: normalizedEmail,
        password,
      });

      if (attempt.status === 'complete' && attempt.createdSessionId) {
        await setSignInActive({ session: attempt.createdSessionId });
        return;
      }

      setDevAuthMessage('Additional sign-in steps are required in Clerk.');
    } catch (error) {
      alert('Email sign-in failed', getClerkErrorMessage(error));
    } finally {
      setIsDevAuthLoading(false);
    }
  }, [
    alert,
    email,
    isDevEmailAuthEnabled,
    password,
    setSignInActive,
    signIn,
    signInLoaded,
  ]);

  const onDevCreateAccountPress = useCallback(async () => {
    if (!isDevEmailAuthEnabled) return;

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password.trim() || !confirmPassword.trim()) {
      alert('Missing details', 'Fill in email, password, and confirm password.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Password mismatch', 'Password and confirm password must match.');
      return;
    }

    if (!signUpLoaded) {
      alert('Auth loading', 'Please wait a moment and try again.');
      return;
    }

    setIsDevAuthLoading(true);
    setDevAuthMessage('');

    try {
      await signUp.create({
        emailAddress: normalizedEmail,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      setDevAuthStep('verifyEmail');
      setVerificationCode('');
      setDevAuthMessage(`Verification code sent to ${normalizedEmail}.`);
    } catch (error) {
      alert('Create account failed', getClerkErrorMessage(error));
    } finally {
      setIsDevAuthLoading(false);
    }
  }, [
    alert,
    confirmPassword,
    email,
    isDevEmailAuthEnabled,
    password,
    signUp,
    signUpLoaded,
  ]);

  const onDevVerifyEmailPress = useCallback(async () => {
    if (!isDevEmailAuthEnabled) return;

    const normalizedCode = verificationCode.trim();
    if (!normalizedCode) {
      alert('Missing verification code', 'Enter the code sent to your email.');
      return;
    }

    if (!signUpLoaded || !setSignUpActive) {
      alert('Auth loading', 'Please wait a moment and try again.');
      return;
    }

    setIsDevAuthLoading(true);
    setDevAuthMessage('');

    try {
      const completedSignUp = await signUp.attemptEmailAddressVerification({
        code: normalizedCode,
      });

      if (completedSignUp.status === 'complete' && completedSignUp.createdSessionId) {
        await setSignUpActive({ session: completedSignUp.createdSessionId });
        return;
      }

      setDevAuthMessage('Verification is not complete yet. Try the latest code.');
    } catch (error) {
      alert('Email verification failed', getClerkErrorMessage(error));
    } finally {
      setIsDevAuthLoading(false);
    }
  }, [
    alert,
    isDevEmailAuthEnabled,
    setSignUpActive,
    signUp,
    signUpLoaded,
    verificationCode,
  ]);

  const onDevSwitchMode = useCallback(() => {
    setAuthMode(prev => (prev === 'signIn' ? 'signUp' : 'signIn'));
    setDevAuthStep('credentials');
    setDevAuthMessage('');
    setVerificationCode('');
    setPassword('');
    setConfirmPassword('');
  }, []);

  const onDevStartOver = useCallback(() => {
    setDevAuthStep('credentials');
    setVerificationCode('');
    setDevAuthMessage('');
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

              {showSafariPopupHelp && (
                <ThemedText size={12} className='text-center text-sm text-[#ff6464]'>
                  Pop-up was blocked. Allow pop-ups for this site and try again.
                </ThemedText>
              )}

              {isDevEmailAuthEnabled && (
                <View className='mt-3 rounded-2xl border border-border/60 bg-container p-4'>
                  <ThemedText variant='medium' className='text-center'>
                    Development only: Email + Password
                  </ThemedText>
                  <ThemedText size={12} className='mt-1 text-center text-[#909090]'>
                    This auth method is hidden in production builds.
                  </ThemedText>

                  {devAuthStep === 'credentials' ? (
                    <View className='mt-3 gap-2'>
                      <Input
                        autoCapitalize='none'
                        autoCorrect={false}
                        keyboardType='email-address'
                        placeholder='Email'
                        value={email}
                        onChangeText={setEmail}
                        textContentType='emailAddress'
                      />
                      <Input
                        autoCapitalize='none'
                        autoCorrect={false}
                        placeholder='Password'
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        textContentType='password'
                      />

                      {authMode === 'signUp' && (
                        <Input
                          autoCapitalize='none'
                          autoCorrect={false}
                          placeholder='Confirm Password'
                          secureTextEntry
                          value={confirmPassword}
                          onChangeText={setConfirmPassword}
                          textContentType='password'
                        />
                      )}

                      <CustomButton
                        isLoading={isDevAuthLoading}
                        onPress={
                          authMode === 'signIn'
                            ? onDevSignInPress
                            : onDevCreateAccountPress
                        }
                      >
                        {authMode === 'signIn'
                          ? 'Sign in with Email'
                          : 'Create account with Email'}
                      </CustomButton>

                      <CustomButton
                        variant='ghost'
                        className='rounded-lg'
                        onPress={onDevSwitchMode}
                      >
                        {authMode === 'signIn'
                          ? "Don't have an account? Create one"
                          : 'Already have an account? Sign in'}
                      </CustomButton>
                    </View>
                  ) : (
                    <View className='mt-3 gap-2'>
                      <Input
                        autoCapitalize='none'
                        autoCorrect={false}
                        keyboardType='number-pad'
                        placeholder='Email verification code'
                        value={verificationCode}
                        onChangeText={setVerificationCode}
                        textContentType='oneTimeCode'
                      />
                      <CustomButton
                        isLoading={isDevAuthLoading}
                        onPress={onDevVerifyEmailPress}
                      >
                        Verify email code
                      </CustomButton>
                      <CustomButton
                        variant='ghost'
                        className='rounded-lg'
                        onPress={onDevStartOver}
                      >
                        Start over
                      </CustomButton>
                    </View>
                  )}

                  {devAuthMessage ? (
                    <ThemedText size={12} className='mt-2 text-center text-[#909090]'>
                      {devAuthMessage}
                    </ThemedText>
                  ) : null}
                </View>
              )}
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
