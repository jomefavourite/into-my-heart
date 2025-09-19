import { View, Animated, Easing, Text } from 'react-native';
import React, { useEffect, useRef } from 'react';
import LoaderIcon from './icons/LoaderIcon';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function Loader() {
  const bounceAnimation = useRef(new Animated.Value(1)).current;
  const textOpacityAnimation = useRef(new Animated.Value(1)).current;
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    const startAnimations = () => {
      // Icon scaling animation
      const iconAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnimation, {
            toValue: 1.15,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnimation, {
            toValue: 0.85,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnimation, {
            toValue: 1.0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

      // Text pulsing animation (synchronized with icon)
      const textAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(textOpacityAnimation, {
            toValue: 0.3,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(textOpacityAnimation, {
            toValue: 1.0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(textOpacityAnimation, {
            toValue: 0.7,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

      // Start both animations simultaneously
      iconAnimation.start();
      textAnimation.start();
    };

    startAnimations();
  }, [bounceAnimation, textOpacityAnimation]);

  return (
    <View className='items-center justify-center'>
      <View className='items-center justify-center'>
        <Animated.View
          style={{
            transform: [{ scale: bounceAnimation }],
            transformOrigin: 'center',
          }}
        >
          <View style={{ transform: [{ scale: 0.8 }] }}>
            <LoaderIcon />
          </View>
        </Animated.View>
      </View>

      <Animated.Text
        style={{
          opacity: textOpacityAnimation,
          marginTop: 8,
          color: colorScheme === 'dark' ? '#ffffff' : '#000000',
        }}
      >
        Loading...
      </Animated.Text>
    </View>
  );
}
