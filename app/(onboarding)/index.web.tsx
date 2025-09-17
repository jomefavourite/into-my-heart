import { View } from 'react-native';
import React, { ReactNode } from 'react';
import { cn } from '~/lib/utils';
import FooterSection from '~/components/Home/FooterSection';
import HowItWorksSection from '~/components/Home/HowItWorksSection';
import HeroSection from '~/components/Home/HeroSection';
import FeaturesSection from '~/components/Home/FeaturesSection';

const Container = (props: { className?: string; children: ReactNode }) => (
  <View className={cn('max-w-screen-2xl mx-auto', props.className)}>
    {props.children}
  </View>
);

const LandingPage = () => {
  return (
    <div className='flex-1 overflow-auto  '>
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
