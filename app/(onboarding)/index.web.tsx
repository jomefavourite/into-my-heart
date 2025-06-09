import { View } from 'react-native';
import React, { PropsWithChildren, ReactNode } from 'react';
import ThemedText from '~/components/ThemedText';
import CustomButton from '~/components/CustomButton';
import { cn } from '~/lib/utils';
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
        <div>
          <h1 className=''>
            The Engaging Way To Keep God's Word In Your Heart
          </h1>
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
        </div>

        <div>
          <div>
            <span>How It Works</span>
            <h2>Simple, fun, and interactive</h2>
            <p>
              Our simple 4-step process makes Scripture memorization accessible
              and effective for everyone.
            </p>
          </div>

          <div>
            <div></div>
            <div>
              <div>
                <h4>Select Verses</h4>
                <p>
                  Choose from curated collections or search for specific
                  passages that resonate with you.
                </p>
              </div>
              <div>
                <h4>Listen, reflect, and take notes</h4>
                <p>
                  Our simple 4-step process makes Scripture memorization
                  accessible and effective for everyone.
                </p>
              </div>
              <div>
                <h4>Practice to memorize and track your progress</h4>
                <p>
                  Our simple 4-step process makes Scripture memorization
                  accessible and effective for everyone.
                </p>
              </div>
              <div>
                <h4>Practice to memorize and track your progress</h4>
                <p>
                  Our simple 4-step process makes Scripture memorization
                  accessible and effective for everyone.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div></div>
      </Container>
    </View>
  );
};

export default LandingPage;
