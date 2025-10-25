import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import Container from '@/components/Container';
import Onboarding from '@/components/Onboarding';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <Container>
      {Platform.OS === 'web' && (
        <>
          <title>Welcome to Into My Heart</title>
          <meta
            name='description'
            content='Start your Bible memorization journey with proven techniques and personalized practice methods.'
          />
          <meta
            name='keywords'
            content='Bible, memorization, verses, flashcards, practice, Christian, faith, scripture'
          />
          <meta name='author' content='Into My Heart' />
          <meta name='robots' content='index, follow' />
          <meta property='og:type' content='website' />
          <meta property='og:site_name' content='Into My Heart' />
          <meta property='og:locale' content='en_US' />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='theme-color' content='#313131' />
          <meta name='msapplication-TileColor' content='#313131' />
        </>
      )}

      <View className='flex-1 justify-between'>
        <Onboarding
          stepNumber={currentStep}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onStepChange={handleStepChange}
          showNavigation={true}
        />
      </View>
    </Container>
  );
}
