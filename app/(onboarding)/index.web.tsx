import { View } from 'react-native';
import React, { PropsWithChildren, ReactNode } from 'react';
import ThemedText from '~/components/ThemedText';
import CustomButton from '~/components/CustomButton';
import { cn } from '~/lib/utils';
import { ClassArray, ClassDictionary } from 'clsx';
import { Link, useRouter } from 'expo-router';

const Container = (props: { className?: string; children: ReactNode }) => (
  <View className={cn('max-w-screen-2xl mx-auto', props.className)}>
    {props.children}
  </View>
);

const LandingPage = () => {
  const router = useRouter();
  return (
    <View>
      <Container>
        <View>
          <ThemedText size={44}>
            The Engaging Way To Keep God's Word In Your Heart
          </ThemedText>
          <ThemedText className='text-secondary-text'>
            Build a daily habit of engaging with God's Word. Our app helps you
            memorize Bible verses with proven techniques, track your progress,
            and grow spiritually.
          </ThemedText>

          <View className='flex-row gap-3 mt-4'>
            <CustomButton onPress={() => router.push('/onboard')}>
              Get started
            </CustomButton>
            <CustomButton variant='secondary'>Download the App</CustomButton>
          </View>
        </View>
      </Container>
    </View>
  );
};

export default LandingPage;
