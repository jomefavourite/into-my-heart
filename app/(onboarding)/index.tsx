import React from 'react';
import { View } from 'react-native';
import Container from '@/components/Container';
import Onboarding from '@/components/Onboarding';

export const metadata = {
  title: 'Welcome to Into My Heart',
  description:
    'Start your Bible memorization journey with proven techniques and personalized practice methods.',
  openGraph: {
    title: 'Welcome to Into My Heart',
    description:
      'Start your Bible memorization journey with proven techniques and personalized practice methods.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Welcome to Into My Heart',
    description:
      'Start your Bible memorization journey with proven techniques and personalized practice methods.',
  },
};

export default function OnboardingStep1() {
  return (
    <Container>
      <View className='flex-1 justify-between'>
        <Onboarding stepNumber={1} />
      </View>
    </Container>
  );
}
