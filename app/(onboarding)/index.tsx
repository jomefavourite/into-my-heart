import React from 'react';
import { View } from 'react-native';
import Container from '@/components/Container';
import Onboarding from '@/components/Onboarding';

export default function OnboardingStep1() {
  return (
    <Container>
      <View className='flex-1 justify-between'>
        <Onboarding stepNumber={1} />
      </View>
    </Container>
  );
}
