import { View, Platform } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import ThemedText from '@/components/ThemedText';
import CustomButton from '@/components/CustomButton';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useSSO, useSignIn, useSignUp } from '@clerk/clerk-expo';
import Logo from '@/components/icons/logo/Logo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Href, Link } from 'expo-router';
import { useAlert } from '@/hooks/useAlert';
import { Input } from '@/components/ui/input';

type ClerkErrorLike = {
  errors?: {
    message?: string;
    longMessage?: string;
  }[];
};

type SignUpAttemptLike = {
  status?: string;
  createdSessionId?: string | null;
  missingFields?: string[];
};

const getClerkErrorMessage = (error: unknown) => {
  const clerkError = error as ClerkErrorLike;
  const firstError = clerkError?.errors?.[0];

  if (firstError?.longMessage) return firstError.longMessage;
  if (firstError?.message) return firstError.message;
  if (error instanceof Error && error.message) return error.message;
  return 'Please try again.';
};

const isIdentifierInvalidError = (error: unknown) => {
  return /identifier is invalid/i.test(getClerkErrorMessage(error));
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

const TERMS_HREF = '/terms' as Href;
const PRIVACY_HREF = '/privacy' as Href;

export default function CreateAccount() {
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();
  const {
    isLoaded: signInLoaded,
    signIn,
    setActive: setSignInActive,
  } = useSignIn();
  const {
    isLoaded: signUpLoaded,
    signUp,
    setActive: setSignUpActive,
  } = useSignUp();
  const isSafari = useIsSafari();
  const { alert } = useAlert();

  const isDevEmailAuthEnabled = __DEV__;

  // Guard against double-taps and let us show retry UI if popup was blocked.
  const inFlight = useRef(false);
  const [showSafariPopupHelp, setShowSafariPopupHelp] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
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
      if (isDevEmailAuthEnabled && isIdentifierInvalidError(error)) {
        setDevAuthMessage(
          'Clerk is still rejecting this identifier. In Clerk Dashboard, disable email verification for email/password sign-up to make immediate login work consistently.'
        );
        return;
      }
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
      alert(
        'Missing details',
        'Fill in email, password, and confirm password.'
      );
      return;
    }

    if (password !== confirmPassword) {
      alert('Password mismatch', 'Password and confirm password must match.');
      return;
    }

    if (!signUpLoaded || !signInLoaded) {
      alert('Auth loading', 'Please wait a moment and try again.');
      return;
    }

    setIsDevAuthLoading(true);
    setDevAuthMessage('');

    try {
      let createdSignUp = (await signUp.create({
        emailAddress: normalizedEmail,
        password,
      })) as unknown as SignUpAttemptLike;

      // Keep the dev flow simple by auto-filling common Clerk requirements.
      if (
        createdSignUp.status === 'missing_requirements' &&
        createdSignUp.missingFields?.length
      ) {
        const localPart = normalizedEmail.split('@')[0] ?? 'devuser';
        const sanitizedUsername =
          localPart.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 16) || 'devuser';
        const updatePayload: {
          firstName?: string;
          lastName?: string;
          username?: string;
          password?: string;
          emailAddress?: string;
        } = {};

        for (const field of createdSignUp.missingFields) {
          if (field === 'first_name')
            updatePayload.firstName = sanitizedUsername;
          if (field === 'last_name') updatePayload.lastName = 'user';
          if (field === 'username') updatePayload.username = sanitizedUsername;
          if (field === 'password') updatePayload.password = password;
          if (field === 'email_address') {
            updatePayload.emailAddress = normalizedEmail;
          }
        }

        if (Object.keys(updatePayload).length > 0) {
          createdSignUp = (await signUp.update(
            updatePayload
          )) as unknown as SignUpAttemptLike;
        }
      }

      if (
        createdSignUp.status === 'complete' &&
        createdSignUp.createdSessionId &&
        setSignUpActive
      ) {
        await setSignUpActive({ session: createdSignUp.createdSessionId });
        return;
      }

      // Fallback: immediately try sign-in with the same credentials.
      const signInAttempt = await signIn.create({
        identifier: normalizedEmail,
        password,
      });
      if (
        signInAttempt.status === 'complete' &&
        signInAttempt.createdSessionId
      ) {
        await setSignInActive?.({ session: signInAttempt.createdSessionId });
        return;
      }

      setAuthMode('signIn');
      setConfirmPassword('');
      setDevAuthMessage(
        'Account created. Sign in with your email and password.'
      );
    } catch (error) {
      if (isDevEmailAuthEnabled && isIdentifierInvalidError(error)) {
        setAuthMode('signIn');
        setConfirmPassword('');
        setDevAuthMessage(
          'Account created, but Clerk still flags the identifier as invalid for sign-in. Disable email verification in Clerk Dashboard for immediate email/password logins.'
        );
        return;
      }
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
    setSignInActive,
    setSignUpActive,
    signIn,
    signInLoaded,
    signUp,
    signUpLoaded,
  ]);

  const onDevSwitchMode = useCallback(() => {
    setAuthMode(prev => (prev === 'signIn' ? 'signUp' : 'signIn'));
    setDevAuthMessage('');
    setPassword('');
    setConfirmPassword('');
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
                <ThemedText
                  size={12}
                  className='text-center text-sm text-[#ff6464]'
                >
                  Pop-up was blocked. Allow pop-ups for this site and try again.
                </ThemedText>
              )}

              {isDevEmailAuthEnabled && (
                <View className='mt-3 rounded-2xl border border-border/60 bg-container p-4'>
                  <ThemedText variant='medium' className='text-center'>
                    Development only: Email + Password
                  </ThemedText>
                  <ThemedText
                    size={12}
                    className='mt-1 text-center text-[#909090]'
                  >
                    This auth method is hidden in production builds.
                  </ThemedText>
                  <ThemedText
                    size={12}
                    className='mt-1 text-center text-[#909090]'
                  >
                    Email verification code is disabled in this dev flow.
                  </ThemedText>

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

                  {devAuthMessage ? (
                    <ThemedText
                      size={12}
                      className='mt-2 text-center text-[#909090]'
                    >
                      {devAuthMessage}
                    </ThemedText>
                  ) : null}
                </View>
              )}
            </View>
          </View>
        </View>

        <View className='flex-row flex-wrap items-center justify-center gap-1'>
          <ThemedText size={12} className='text-center text-sm'>
            By signing up, you agree to our
          </ThemedText>
          <Link href={TERMS_HREF}>
            <ThemedText size={12} className='text-center text-sm underline'>
              Terms
            </ThemedText>
          </Link>
          <ThemedText size={12} className='text-center text-sm'>
            and have read our
          </ThemedText>
          <Link href={PRIVACY_HREF}>
            <ThemedText size={12} className='text-center text-sm underline'>
              Privacy Policy
            </ThemedText>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
