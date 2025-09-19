import { View } from 'react-native';
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import FooterSection from '@/components/Home/FooterSection';
import HowItWorksSection from '@/components/Home/HowItWorksSection';
import HeroSection from '@/components/Home/HeroSection';
import FeaturesSection from '@/components/Home/FeaturesSection';

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

const Container = (props: { className?: string; children: ReactNode }) => (
  <View className={cn('mx-auto max-w-screen-2xl', props.className)}>
    {props.children}
  </View>
);

const LandingPage = () => {
  return (
    <div className='flex-1 overflow-auto'>
      <HeroSection />
      <Container>
        <HowItWorksSection />
        <FeaturesSection />
        <FooterSection />
      </Container>
    </div>
  );
};

export default LandingPage;
