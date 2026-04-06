import { SignUp } from '@clerk/clerk-react';
import { Link } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import { View } from 'react-native';

export default function SignUpWebPage() {
  return (
    <View className='min-h-screen flex-1 items-center justify-center bg-background px-4 py-8'>
      <View className='items-center gap-4'>
        <SignUp
          routing='path'
          path='/sign-up'
          forceRedirectUrl='/'
          fallbackRedirectUrl='/'
          signInUrl='/onboard'
          signInForceRedirectUrl='/'
        />
        <Link href='/onboard'>
          <ThemedText className='text-sm text-[#5d5d5d] underline'>
            Already have an account? Sign in
          </ThemedText>
        </Link>
      </View>
    </View>
  );
}
