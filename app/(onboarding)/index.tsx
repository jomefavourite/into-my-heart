import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '~/components/CustomButton';
import { Text } from '~/components/ui/text';
import ArrowLeft from '~/assets/icons/light=arrow-right-01.svg';
import Container from '~/components/Container';
import { ThemedText } from '~/components/ThemedText';

export default function OnboardingStep1() {
  const router = useRouter();

  return (
    <Container>
      <View>
        <View></View>
      </View>

      <View className='mb-20'>
        <ThemedText
          type='subtitle'
          className='text-lg font-medium text-black dark:text-white'
        >
          God's Word Hidden in Your Heart.
        </ThemedText>

        <ThemedText>
          Build a habit of hiding God's Word in your heart with interactive
          tools designed to help you remember and apply scripture.
        </ThemedText>
      </View>

      <CustomButton rightIcon Icon={ArrowLeft}>
        Next
      </CustomButton>
    </Container>
  );
}
