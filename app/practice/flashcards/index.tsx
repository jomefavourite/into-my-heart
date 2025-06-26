import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '~/components/BackHeader';
import ThemedText from '~/components/ThemedText';
import OpenBookIcon from '~/components/icons/OpenBook';

export default function Flashcards() {
  const flashcards = [
    {
      id: 1,
      front: 'What is React Native?',
      back: 'A framework for building native mobile apps using React and JavaScript',
    },
    {
      id: 2,
      front: 'What does JSX stand for?',
      back: 'JavaScript XML - a syntax extension for JavaScript',
    },
    {
      id: 3,
      front: 'What is a component?',
      back: 'A reusable piece of code that returns JSX elements to be rendered',
    },
  ];
  return (
    <SafeAreaView>
      <BackHeader items={[{ label: 'Verses', href: '/verses' }]} />

      <View className='p-[18px]'>
        <ThemedText>Flashcards</ThemedText>

        <View className='flex-1 mt-[18px]'>
          <FlashCard front={flashcards[0].front} back={flashcards[0].back} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const FlashCard = ({ front, back }: { front: string; back: string }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    if (isFlipped) {
      Animated.spring(flipAnimation, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(flipAnimation, {
        toValue: 1,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <TouchableOpacity onPress={flipCard} activeOpacity={0.8}>
      <View className='h-[395px] w-full'>
        <Animated.View
          style={[styles.card, styles.cardFront, frontAnimatedStyle]}
          className='bg-[#3D3D3D]'
        >
          <ThemedText className=' text-center text-white'>{front}</ThemedText>
          <Text className='text-center text-white italic'>Tap to reveal</Text>
        </Animated.View>
        <Animated.View
          style={[styles.card, styles.cardBack, backAnimatedStyle]}
          className='bg-[#FAFAFA] dark:bg-[#3D3D3D]'
        >
          <ThemedText className='text-center text-black'>{back}</ThemedText>
          <Text className='text-center text-black italic'>
            Tap to flip back
          </Text>
        </Animated.View>

        <View className='absolute bottom-0 left-1/2 -translate-x-1/2'>
          <OpenBookIcon />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cardContainer: {
    marginBottom: 20,
    height: 395,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: 395,
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    backgroundColor: '#3D3D3D',
  },
  cardBack: {
    backgroundColor: '#FAFAFA',
  },
});
