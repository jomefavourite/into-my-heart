import { View } from 'react-native';
import React, { PropsWithChildren, ReactNode } from 'react';
import ThemedText from '~/components/ThemedText';
import CustomButton from '~/components/CustomButton';
import { cn } from '~/lib/utils';
import { Link, useRouter } from 'expo-router';
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
  const router = useRouter();
  return (
    <div className='flex-1 overflow-auto'>
      <Container>
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <FooterSection />
      </Container>
    </div>
  );
};

export default LandingPage;
