import { SignIn } from '@clerk/clerk-react';
import { View } from 'react-native';

export default function OnboardWebPage() {
  return (
    <View className='min-h-screen flex-1 items-center justify-center bg-background px-4 py-8'>
      <SignIn
        routing='path'
        path='/onboard'
        oauthFlow='redirect'
        fallbackRedirectUrl='/'
        signUpFallbackRedirectUrl='/'
        withSignUp
      />
    </View>
  );
}
