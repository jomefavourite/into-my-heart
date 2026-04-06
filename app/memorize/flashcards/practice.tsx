import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/components/BackHeader';
import ThemedText from '@/components/ThemedText';
import OpenBookIcon from '@/components/icons/OpenBook';
import CustomButton from '@/components/CustomButton';
import { useRouter } from 'expo-router';
import { type PracticeVerse, usePracticeStore } from '@/store/practiceStore';
import { formatVerseDisplay } from '@/lib/utils';
import { getPracticeVerseKey } from '@/lib/practiceFlow';

export default function FlashcardPractice() {
  const { currentSession, clearPracticeSession, setVerseOutcome } =
    usePracticeStore();
  const router = useRouter();
  const activeSessionId = currentSession?.sessionId;
  const activeSessionVerses = useMemo(
    () => currentSession?.verses ?? [],
    [currentSession?.verses]
  );
  const hasActiveSession = Boolean(currentSession && activeSessionId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionVerses, setSessionVerses] = useState<PracticeVerse[]>(
    currentSession?.verses ?? []
  );
  const [reviewLaterKeys, setReviewLaterKeys] = useState<string[]>([]);

  const isCollectionsPractice = currentSession?.practiceType === 'collections';

  useEffect(() => {
    if (!hasActiveSession) {
      router.replace('/memorize/flashcards');
      return;
    }

    setSessionVerses(activeSessionVerses);
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewLaterKeys([]);
  }, [activeSessionId, activeSessionVerses, hasActiveSession, router]);

  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  const currentVerse = sessionVerses[currentIndex];
  const totalVerses = sessionVerses.length;

  const progressLabel = useMemo(() => {
    if (!currentVerse) {
      return '';
    }

    return `${currentVerse.bookName} ${currentVerse.chapter}:${formatVerseDisplay(currentVerse.verses)}`;
  }, [currentVerse]);

  const advanceToNextVerse = (needsReview: boolean) => {
    if (!currentVerse) {
      return;
    }

    const verseKey = getPracticeVerseKey(currentVerse);
    setVerseOutcome(verseKey, needsReview ? 'needsReview' : 'pass');
    const shouldAppendForReview =
      needsReview && !reviewLaterKeys.includes(verseKey);

    if (needsReview) {
      if (shouldAppendForReview) {
        setSessionVerses(previous => [...previous, currentVerse]);
        setReviewLaterKeys(previous => [...previous, verseKey]);
      }
    }

    if (currentIndex < totalVerses - 1 || shouldAppendForReview) {
      setCurrentIndex(previous => previous + 1);
      return;
    }

    router.replace('/memorize/flashcards/practice-complete');
  };

  const handleExitPractice = () => {
    clearPracticeSession();
    router.replace('/memorize/flashcards');
  };

  if (!currentSession || !currentVerse) {
    return (
      <SafeAreaView className='flex-1'>
        <BackHeader
          title='Flashcards'
          items={[
            { label: 'Memorize', href: '/memorize' },
            { label: 'Flashcards', href: '/memorize/flashcards' },
          ]}
        />
        <View className='flex-1 items-center justify-center p-6'>
          <ThemedText className='text-center text-base'>
            No flashcard session found.
          </ThemedText>
          <CustomButton
            onPress={() => router.replace('/memorize/flashcards')}
            className='mt-4 px-6'
          >
            Start Flashcards
          </CustomButton>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        title='Flashcards'
        items={[
          { label: 'Memorize', href: '/memorize' },
          { label: 'Flashcards', href: '/memorize/flashcards' },
          {
            label: isCollectionsPractice
              ? 'Collections Practice'
              : 'Memorize Session',
            href: '/memorize/flashcards/practice',
          },
        ]}
      />

      <View className='flex-1 p-[18px]'>
        <View className='rounded-2xl bg-container p-4'>
          <View className='flex-row items-center justify-between gap-4'>
            <ThemedText className='text-lg font-semibold'>
              Flashcard {currentIndex + 1} of {totalVerses}
            </ThemedText>
            <ThemedText className='text-right text-sm text-muted-foreground'>
              {progressLabel}
            </ThemedText>
          </View>
          <ThemedText className='mt-2 text-sm text-muted-foreground'>
            Say the verse aloud before flipping the card. If you needed help,
            send it to the end for one more review.
          </ThemedText>
        </View>

        <View className='flex-1 justify-center py-4'>
          <FlashCard
            key={`${getPracticeVerseKey(currentVerse)}-${currentIndex}`}
            front={`${currentVerse.bookName} ${currentVerse.chapter}:${formatVerseDisplay(currentVerse.verses)}`}
            back={`${currentVerse.bookName} ${currentVerse.chapter}:${currentVerse.verses.join(', ')}\n\n${currentVerse.verseTexts
              .map(verseText => `${verseText.verse}. ${verseText.text}`)
              .join('\n\n')}`}
            isFlipped={isFlipped}
            setIsFlipped={setIsFlipped}
          />
        </View>

        <View className='gap-3'>
          <View className='items-center'>
            <ThemedText className='text-center text-sm text-muted-foreground'>
              {isFlipped
                ? 'Rate your recall honestly before moving on.'
                : 'Tap the card only after you have tried to say it from memory.'}
            </ThemedText>
          </View>

          <View className='flex-row items-center justify-between gap-3'>
            <CustomButton
              variant='outline'
              onPress={() => setCurrentIndex(previous => previous - 1)}
              disabled={currentIndex === 0}
              className='flex-1 bg-transparent'
            >
              Previous
            </CustomButton>

            <CustomButton
              variant='outline'
              onPress={handleExitPractice}
              className='flex-1 bg-transparent'
            >
              Exit
            </CustomButton>
          </View>

          <View className='flex-row items-center justify-between gap-3'>
            <CustomButton
              variant='outline'
              onPress={() => advanceToNextVerse(true)}
              disabled={!isFlipped}
              className='flex-1 bg-transparent'
            >
              Need another look
            </CustomButton>

            <CustomButton
              onPress={() => advanceToNextVerse(false)}
              disabled={!isFlipped}
              className='flex-1'
            >
              {currentIndex >= totalVerses - 1 ? 'Finish Practice' : 'I got it'}
            </CustomButton>
          </View>
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

  useEffect(() => {
    if (!isFlipped) {
      flipAnimation.setValue(0);
    }
  }, [flipAnimation, isFlipped]);

  const flipCard = () => {
    Animated.spring(flipAnimation, {
      toValue: isFlipped ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(!isFlipped);
    });
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <TouchableOpacity onPress={flipCard} activeOpacity={0.85}>
      <View className='h-[395px] w-full'>
        <Animated.View
          style={[styles.card, styles.cardFront, { transform: [{ rotateY: frontInterpolate }] }]}
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

        <ScrollView
          className='flex-1'
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 16,
            paddingVertical: 20,
            minHeight: '100%',
          }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[styles.card, styles.cardBack, { transform: [{ rotateY: backInterpolate }] }]}
            className='bg-[#FAFAFA]'
          >
            <ThemedText size={18} className='text-center leading-7 text-black'>
              {back}
            </ThemedText>
            <Text className='mt-4 text-center text-base italic text-black'>
              Tap to flip back
            </Text>

            <View className='absolute bottom-4 left-1/2 -translate-x-1/2'>
              <OpenBookIcon />
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: '100%',
    height: 395,
    borderRadius: 24,
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
