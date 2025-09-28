import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/components/BackHeader';
import ThemedText from '@/components/ThemedText';
import OpenBookIcon from '@/components/icons/OpenBook';
import { usePaginatedQuery } from 'convex-helpers/react/cache';
import { api } from '@/convex/_generated/api';
import CustomButton from '@/components/CustomButton';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { usePracticeStore } from '@/store/practiceStore';
import Loader from '@/components/Loader';

export default function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();
  const { currentSession, clearPracticeSession } = usePracticeStore();

  const router = useRouter();

  // Check if this is collections practice
  const isCollectionsPractice = currentSession?.practiceType === 'collections';

  // Fetch all verses for flashcards (only if no practice session is active)
  const shouldFetchVerses = isSignedIn && isLoaded && !currentSession;
  const { results: allVerses, isLoading } = usePaginatedQuery(
    api.verses.getAllVerses,
    shouldFetchVerses ? {} : 'skip',
    { initialNumItems: 100 }
  );

  // Determine if we're actually loading
  const isActuallyLoading = shouldFetchVerses && isLoading;

  // Use practice session verses if available, otherwise use all verses
  const verses = currentSession?.verses || allVerses;

  // Reset flip state when moving to next verse
  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  // Clear practice session when component unmounts
  useEffect(() => {
    return () => {
      // Only clear if we're at the end of the practice session
      if (verses && currentIndex >= verses.length - 1) {
        clearPracticeSession();
      }
    };
  }, [verses, currentIndex, clearPracticeSession]);

  const handleNext = () => {
    if (verses && currentIndex < verses.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (verses && currentIndex >= verses.length - 1) {
      // Practice session completed
      clearPracticeSession();
      router.back();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Check if user can proceed to next question
  const canProceedToNext =
    isFlipped && currentIndex < (verses?.length || 0) - 1;
  const canProceedToPrevious = currentIndex > 0;

  console.log({
    verses,
    isLoading,
    currentSession,
    isActuallyLoading,
    shouldFetchVerses,
  });

  if (isActuallyLoading || (shouldFetchVerses && !verses)) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center'>
        <Loader />
      </SafeAreaView>
    );
  }

  if (!verses || verses.length === 0) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center'>
        <ThemedText>
          {isCollectionsPractice
            ? 'No verses available in your collections'
            : 'No verses available for practice'}
        </ThemedText>
        <CustomButton
          onPress={() => {
            clearPracticeSession();
            router.back();
          }}
        >
          Go Back
        </CustomButton>
      </SafeAreaView>
    );
  }

  const currentVerse = verses[currentIndex];

  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        items={[
          { label: 'Practice', href: '/practice' },
          { label: 'Flashcards', href: '/practice/flashcards' },
          {
            label: isCollectionsPractice
              ? 'Collections Practice'
              : 'Practice Session',
            href: '/practice/flashcards/practice',
          },
        ]}
      />

      <View className='flex-1 p-[18px]'>
        <View className='mb-4 flex-row items-center justify-between'>
          <ThemedText className='text-lg font-semibold'>
            Flashcard {currentIndex + 1} of {verses.length}
          </ThemedText>
          <ThemedText className='text-sm text-muted-foreground'>
            {currentVerse.bookName} {currentVerse.chapter}:{currentVerse.verses}
          </ThemedText>
        </View>

        <View className='flex-1 justify-center'>
          <FlashCard
            key={currentIndex} // Force re-render when question changes
            front={`${currentVerse.bookName} ${currentVerse.chapter}:${currentVerse.verses.join(', ')}`}
            back={`${currentVerse.bookName} ${currentVerse.chapter}:${currentVerse.verses.join(', ')}\n\n${currentVerse.verseTexts
              .map(
                (vt: { verse: string; text: string }) =>
                  `${vt.verse}. ${vt.text}`
              )
              .join('\n\n')}`}
            isFlipped={isFlipped}
            setIsFlipped={setIsFlipped}
          />
        </View>

        <View className='mt-4 items-center'>
          <ThemedText className='text-center text-sm text-muted-foreground'>
            Tap the flashcard to reveal the answer before proceeding
          </ThemedText>
        </View>

        <View className='mt-6 flex-row items-center justify-between'>
          <CustomButton
            onPress={handlePrevious}
            disabled={!canProceedToPrevious}
            className={!canProceedToPrevious ? 'opacity-50' : ''}
          >
            Previous
          </CustomButton>

          <View className='flex-row items-center gap-2'>
            <ThemedText className='text-sm text-muted-foreground'>
              {currentIndex + 1} / {verses.length}
            </ThemedText>
          </View>

          <CustomButton
            onPress={handleNext}
            disabled={!canProceedToNext}
            className={!canProceedToNext ? 'opacity-50' : ''}
          >
            {currentIndex >= (verses?.length || 0) - 1
              ? 'Finish Practice'
              : 'I got it - Next'}
          </CustomButton>
        </View>
      </View>
    </SafeAreaView>
  );
}
const FlashCard = ({
  front,
  back,
  isFlipped,
  setIsFlipped,
}: {
  front: string;
  back: string;
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
}) => {
  const flipAnimation = useRef(new Animated.Value(0)).current;

  // Reset animation value when navigating to a new question
  useEffect(() => {
    if (!isFlipped) {
      flipAnimation.setValue(0);
    }
  }, [isFlipped, flipAnimation]);

  const flipCard = () => {
    if (isFlipped) {
      // Flip back to front with smooth animation
      Animated.spring(flipAnimation, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start(() => {
        // Only update state after animation completes
        setIsFlipped(false);
      });
    } else {
      // Flip to back with smooth animation
      Animated.spring(flipAnimation, {
        toValue: 1,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start(() => {
        // Only update state after animation completes
        setIsFlipped(true);
      });
    }
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
          <View className='flex-1 items-center justify-center px-4'>
            <ThemedText
              size={22}
              variant='semibold'
              className='mb-4 text-center text-white'
            >
              {front}
            </ThemedText>
            <Text className='text-center text-base italic text-white'>
              Tap to reveal verse
            </Text>
          </View>
          <View className='absolute bottom-4 left-1/2 -translate-x-1/2'>
            <OpenBookIcon />
          </View>
        </Animated.View>

        <Animated.View
          style={[styles.card, styles.cardBack, backAnimatedStyle]}
          className='bg-[#3D3D3D]'
        >
          <ScrollView
            className='flex-1'
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              paddingHorizontal: 16,
              paddingVertical: 20,
            }}
            showsVerticalScrollIndicator={false}
          >
            <ThemedText
              size={18}
              className='text-center leading-6 text-black dark:text-white'
            >
              {back}
            </ThemedText>
            <Text className='mt-4 text-center text-base italic text-black dark:text-white'>
              Tap to flip back
            </Text>
          </ScrollView>
          <View className='absolute bottom-4 left-1/2 -translate-x-1/2'>
            <OpenBookIcon />
          </View>
        </Animated.View>
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
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
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
