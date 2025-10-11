import React from 'react';
import { View, Platform } from 'react-native';
import Container from '@/components/Container';
import Onboarding from '@/components/Onboarding';

export default function OnboardingStep1() {
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
        <Onboarding stepNumber={1} />
      </View>
    </Container>
  );
}
