import React from 'react';
import Container from '~/components/Container';
import Onboarding from '~/components/Onboarding';

export default function OnboardingStep1() {
  return (
    <Container>
      <Onboarding stepNumber={1} />
    </Container>
  );
}
