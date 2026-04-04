import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import BackHeader from '@/components/BackHeader';
import CustomButton from '@/components/CustomButton';
import ThemedText from '@/components/ThemedText';
import { Card, CardContent } from '@/components/ui/card';
import { type PracticeVerse, usePracticeStore } from '@/store/practiceStore';
import { formatVerseDisplay } from '@/lib/utils';
import { getPracticeVerseKey } from '@/lib/practiceFlow';

type PromptStage = 'full' | 'letters' | 'hidden';

const cleanWord = (word: string) =>
  word.replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, '');

const getLetterPrompt = (word: string) => {
  const trimmedWord = cleanWord(word);

  if (!trimmedWord) {
    return word;
  }

  const prefixMatch = word.match(/^[^A-Za-z0-9']*/)?.[0] ?? '';
  const suffixMatch = word.match(/[^A-Za-z0-9']*$/)?.[0] ?? '';

  return `${prefixMatch}${trimmedWord.charAt(0)}${suffixMatch}`;
};

const maskVerseText = (text: string) =>
  text
    .split(/\s+/)
    .filter(Boolean)
    .map(word => {
      const trimmedWord = cleanWord(word);

      if (!trimmedWord) {
        return word;
      }

      return '•'.repeat(Math.max(trimmedWord.length, 3));
    })
    .join(' ');

const buildPromptText = (verse: PracticeVerse, stage: PromptStage) =>
  verse.verseTexts
    .map(verseText => {
      if (stage === 'full') {
        return `${verseText.verse}. ${verseText.text}`;
      }

      if (stage === 'letters') {
        return `${verseText.verse}. ${verseText.text
          .split(/\s+/)
          .filter(Boolean)
          .map(getLetterPrompt)
          .join(' ')}`;
      }

      return `${verseText.verse}. ${maskVerseText(verseText.text)}`;
    })
    .join('\n\n');

export default function RecitationPractice() {
  const router = useRouter();
  const { currentSession, clearPracticeSession, setVerseOutcome } =
    usePracticeStore();
  const activeSessionId = currentSession?.sessionId;
  const activeSessionVerses = useMemo(
    () => currentSession?.verses ?? [],
    [currentSession?.verses]
  );
  const hasActiveSession = Boolean(currentSession && activeSessionId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [promptStage, setPromptStage] = useState<PromptStage>('full');
  const [sessionVerses, setSessionVerses] = useState<PracticeVerse[]>(
    currentSession?.verses ?? []
  );
  const [reviewLaterKeys, setReviewLaterKeys] = useState<string[]>([]);
  const [hasAttemptedRecall, setHasAttemptedRecall] = useState(false);

  const currentVerse = sessionVerses[currentIndex];
  const isCollectionsPractice = currentSession?.practiceType === 'collections';

  useEffect(() => {
    if (!hasActiveSession) {
      router.replace('/memorize/recitation');
      return;
    }

    setSessionVerses(activeSessionVerses);
    setCurrentIndex(0);
    setPromptStage('full');
    setReviewLaterKeys([]);
    setHasAttemptedRecall(false);
  }, [activeSessionId, activeSessionVerses, hasActiveSession, router]);

  useEffect(() => {
    setPromptStage('full');
    setHasAttemptedRecall(false);
  }, [currentIndex]);

  const promptText = useMemo(() => {
    if (!currentVerse) {
      return '';
    }

    return buildPromptText(currentVerse, promptStage);
  }, [currentVerse, promptStage]);

  const setStage = (nextStage: PromptStage) => {
    setPromptStage(nextStage);

    if (nextStage !== 'full') {
      setHasAttemptedRecall(true);
    }
  };

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

    if (currentIndex < sessionVerses.length - 1 || shouldAppendForReview) {
      setCurrentIndex(previous => previous + 1);
      return;
    }

    router.replace('/memorize/recitation/practice-complete');
  };

  const handleExitPractice = () => {
    clearPracticeSession();
    router.replace('/memorize/recitation');
  };

  if (!currentSession || !currentVerse) {
    return (
      <SafeAreaView className='flex-1'>
        <BackHeader
          title='Recitation'
          items={[
            { label: 'Memorize', href: '/memorize' },
            { label: 'Recitation', href: '/memorize/recitation' },
          ]}
        />
        <View className='flex-1 items-center justify-center p-6'>
          <ThemedText className='text-center text-base'>
            No recitation session found.
          </ThemedText>
          <CustomButton
            onPress={() => router.replace('/memorize/recitation')}
            className='mt-4 px-6'
          >
            Start Recitation
          </CustomButton>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        title='Recitation'
        items={[
          { label: 'Memorize', href: '/memorize' },
          { label: 'Recitation', href: '/memorize/recitation' },
          {
            label: isCollectionsPractice
              ? 'Collections Practice'
              : 'Memorize Session',
            href: '/memorize/recitation/practice',
          },
        ]}
      />

      <ScrollView className='flex-1'>
        <View className='gap-4 p-[18px]'>
          <View className='rounded-2xl bg-container p-4'>
            <View className='flex-row items-center justify-between gap-4'>
              <ThemedText className='text-lg font-semibold'>
                Recitation {currentIndex + 1} of {sessionVerses.length}
              </ThemedText>
              <ThemedText className='text-right text-sm text-muted-foreground'>
                {currentVerse.bookName} {currentVerse.chapter}:
                {formatVerseDisplay(currentVerse.verses)}
              </ThemedText>
            </View>
            <ThemedText className='mt-2 text-sm text-muted-foreground'>
              Read once, switch to prompts, then hide the text and say the verse
              aloud before checking yourself.
            </ThemedText>
          </View>

          <View className='flex-row flex-wrap gap-3'>
            <CustomButton
              variant={promptStage === 'full' ? 'default' : 'outline'}
              onPress={() => setStage('full')}
              className={promptStage === 'full' ? '' : 'bg-transparent'}
            >
              Full verse
            </CustomButton>
            <CustomButton
              variant={promptStage === 'letters' ? 'default' : 'outline'}
              onPress={() => setStage('letters')}
              className={promptStage === 'letters' ? '' : 'bg-transparent'}
            >
              First letters
            </CustomButton>
            <CustomButton
              variant={promptStage === 'hidden' ? 'default' : 'outline'}
              onPress={() => setStage('hidden')}
              className={promptStage === 'hidden' ? '' : 'bg-transparent'}
            >
              Hide text
            </CustomButton>
          </View>

          <Card className='border-0 bg-container'>
            <CardContent className='p-6'>
              <ThemedText className='text-base leading-8'>
                {promptText}
              </ThemedText>
            </CardContent>
          </Card>

          <View className='rounded-2xl border border-dashed border-border p-4'>
            <ThemedText className='font-medium'>
              Honest self-check works best
            </ThemedText>
            <ThemedText className='mt-2 text-sm text-muted-foreground'>
              Move off the full verse before you rate yourself. If a verse felt
              shaky, send it to the end and recite it once more.
            </ThemedText>
          </View>

          <View className='gap-3'>
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
                disabled={!hasAttemptedRecall}
                className='flex-1 bg-transparent'
              >
                Needs review
              </CustomButton>

              <CustomButton
                onPress={() => advanceToNextVerse(false)}
                disabled={!hasAttemptedRecall}
                className='flex-1'
              >
                {currentIndex >= sessionVerses.length - 1
                  ? 'Finish Practice'
                  : 'I recited it'}
              </CustomButton>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
