import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { View } from 'react-native';
import ThemedText from '@/components/ThemedText';
import { ScrollView } from 'react-native-gesture-handler';
import CustomButton from '@/components/CustomButton';
import { usePracticeStore } from '@/store/practiceStore';
import { useRouter } from 'expo-router';
import BackHeader from '@/components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatVerseDisplay } from '@/lib/utils';
import { getPracticeVerseKey } from '@/lib/practiceFlow';

interface BlankData {
  id: string;
  correctAnswer: string;
  selectedAnswer: string | null;
  selectedOptionId: string | null;
}

interface OptionData {
  id: string;
  text: string;
}

interface VerseData {
  verseNumber: string;
  words: string[];
  blankIdByWordIndex: Record<number, string>;
}

interface WordCandidate {
  index: number;
  cleanedWord: string;
}

const cleanWord = (word: string) =>
  word.replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, '');

const shuffleArray = <T,>(array: T[]) => {
  const copy = [...array];
  for (let index = copy.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
};

export default function FillInTheBlanks() {
  const { currentSession, clearPracticeSession, setVerseOutcome } =
    usePracticeStore();
  const router = useRouter();
  const activeSessionId = currentSession?.sessionId;

  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [verseData, setVerseData] = useState<VerseData[]>([]);
  const [blanks, setBlanks] = useState<BlankData[]>([]);
  const [options, setOptions] = useState<OptionData[]>([]);
  const [selectedBlankId, setSelectedBlankId] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const verses = currentSession?.verses || [];
  const currentVerse = verses[currentVerseIndex];
  const isCollectionsPractice = currentSession?.practiceType === 'collections';

  const blankMap = useMemo(
    () => new Map(blanks.map(blank => [blank.id, blank])),
    [blanks]
  );

  const selectedBlank = useMemo(
    () => blanks.find(blank => blank.id === selectedBlankId) ?? null,
    [blanks, selectedBlankId]
  );

  const usedOptionIds = useMemo(() => {
    return new Set(
      blanks
        .map(blank => blank.selectedOptionId)
        .filter((optionId): optionId is string => optionId !== null)
    );
  }, [blanks]);

  const generateFillInBlanks = (
    verseTexts: { verse: string; text: string }[]
  ) => {
    const generatedVerseData: VerseData[] = [];
    const generatedBlanks: BlankData[] = [];
    const optionWordPool: string[] = [];

    verseTexts.forEach((verseText, verseIndex) => {
      const words = verseText.text.split(/\s+/).filter(Boolean);
      const candidates: WordCandidate[] = words
        .map((word, index) => ({
          index,
          cleanedWord: cleanWord(word),
        }))
        .filter(candidate => candidate.cleanedWord.length > 2);

      if (candidates.length === 0) {
        generatedVerseData.push({
          verseNumber: verseText.verse,
          words,
          blankIdByWordIndex: {},
        });
        return;
      }

      const blanksForVerse = Math.min(
        3,
        Math.max(1, Math.floor(candidates.length * 0.2))
      );

      const selectedCandidates = shuffleArray(candidates).slice(
        0,
        blanksForVerse
      );
      const blankIdByWordIndex: Record<number, string> = {};

      selectedCandidates.forEach((candidate, candidateIndex) => {
        const blankId = `${verseIndex}-${candidate.index}-${candidateIndex}`;
        blankIdByWordIndex[candidate.index] = blankId;
        generatedBlanks.push({
          id: blankId,
          correctAnswer: candidate.cleanedWord,
          selectedAnswer: null,
          selectedOptionId: null,
        });
      });

      optionWordPool.push(...candidates.map(candidate => candidate.cleanedWord));

      generatedVerseData.push({
        verseNumber: verseText.verse,
        words,
        blankIdByWordIndex,
      });
    });

    const correctOptions: OptionData[] = generatedBlanks.map(blank => ({
      id: `correct-${blank.id}`,
      text: blank.correctAnswer,
    }));

    const uniquePoolWords = Array.from(new Set(optionWordPool));
    const correctWordSet = new Set(
      correctOptions.map(option => option.text.toLowerCase())
    );

    const distractorWords = shuffleArray(
      uniquePoolWords.filter(word => !correctWordSet.has(word.toLowerCase()))
    ).slice(0, generatedBlanks.length);

    const distractorOptions: OptionData[] = distractorWords.map(
      (word, index) => ({
        id: `distractor-${index}-${word.toLowerCase()}`,
        text: word,
      })
    );

    return {
      verseData: generatedVerseData,
      blanks: generatedBlanks,
      options: shuffleArray([...correctOptions, ...distractorOptions]),
    };
  };

  useEffect(() => {
    if (!currentVerse) {
      setVerseData([]);
      setBlanks([]);
      setOptions([]);
      setSelectedBlankId(null);
      setShowResults(false);
      return;
    }

    const generated = generateFillInBlanks(currentVerse.verseTexts);
    setVerseData(generated.verseData);
    setBlanks(generated.blanks);
    setOptions(generated.options);
    setSelectedBlankId(null);
    setShowResults(false);
  }, [currentVerse]);

  useEffect(() => {
    if (!currentSession) {
      router.replace('/memorize/fill-in-blanks');
    }
  }, [currentSession, router]);

  useEffect(() => {
    setCurrentVerseIndex(0);
    setSelectedBlankId(null);
    setShowResults(false);
  }, [activeSessionId]);

  const handleBlankClick = (blankId: string) => {
    if (showResults) return;
    setSelectedBlankId(blankId);
  };

  const handleOptionClick = (option: OptionData) => {
    if (selectedBlankId === null || showResults) return;

    const isUsedByAnotherBlank =
      usedOptionIds.has(option.id) && selectedBlank?.selectedOptionId !== option.id;

    if (isUsedByAnotherBlank) {
      return;
    }

    setBlanks(previous =>
      previous.map(blank =>
        blank.id === selectedBlankId
          ? {
              ...blank,
              selectedAnswer: option.text,
              selectedOptionId: option.id,
            }
          : blank
      )
    );

    setSelectedBlankId(null);
  };

  const handleReset = () => {
    setBlanks(previous =>
      previous.map(blank => ({
        ...blank,
        selectedAnswer: null,
        selectedOptionId: null,
      }))
    );
    setSelectedBlankId(null);
    setShowResults(false);
  };

  const handleCheckAnswers = () => {
    if (!allBlanksCompleted) return;
    setShowResults(true);
    setSelectedBlankId(null);
  };

  const handleNextVerse = () => {
    if (currentVerse) {
      const outcome =
        totalBlanks === 0 || correctAnswers / totalBlanks >= 0.8
          ? 'pass'
          : 'needsReview';
      setVerseOutcome(getPracticeVerseKey(currentVerse), outcome);
    }

    if (currentVerseIndex < verses.length - 1) {
      setCurrentVerseIndex(previous => previous + 1);
    } else {
      router.replace('./practice-complete');
    }
  };

  const handlePreviousVerse = () => {
    if (currentVerseIndex > 0) {
      setCurrentVerseIndex(previous => previous - 1);
    }
  };

  const handleExitPractice = () => {
    clearPracticeSession();
    router.replace('/memorize/fill-in-blanks');
  };

  const renderVerseWithBlanks = (verse: VerseData, verseIndex: number) => {
    return verse.words.map((word, index) => {
      const blankId = verse.blankIdByWordIndex[index];
      if (!blankId) {
        return (
          <ThemedText key={`word-${verseIndex}-${index}`} className='text-base'>
            {word}{' '}
          </ThemedText>
        );
      }

      const blank = blankMap.get(blankId);
      if (!blank) {
        return (
          <ThemedText key={`word-fallback-${verseIndex}-${index}`} className='text-base'>
            {word}{' '}
          </ThemedText>
        );
      }

      const isSelected = selectedBlankId === blank.id;
      const isCorrect = showResults && blank.selectedAnswer === blank.correctAnswer;
      const isIncorrect =
        showResults &&
        blank.selectedAnswer !== blank.correctAnswer &&
        blank.selectedAnswer !== null;

      return (
        <Button
          key={`blank-${verseIndex}-${index}-${blank.id}`}
          size={'sm'}
          onPress={() => handleBlankClick(blank.id)}
          className={`mb-1 mx-1 inline-flex h-6 w-fit min-w-[80px] items-center justify-center rounded-md border text-sm font-medium transition-all duration-200 sm:h-6 ${isSelected ? 'border-blue-500 bg-gray-500' : 'border-gray-300'} ${isCorrect ? 'border-green-500 bg-green-50' : ''} ${isIncorrect ? 'border-red-500 bg-red-50 text-red-700' : ''}`}
          disabled={showResults}
        >
          <ThemedText className='text-sm'>{blank.selectedAnswer || '____'}</ThemedText>
        </Button>
      );
    });
  };

  const renderVersesWithBlanks = () => {
    return verseData.map((verse, index) => (
      <View key={`verse-${index}`} className='mb-4'>
        <View className='flex-row items-start'>
          <ThemedText className='mr-2 text-base font-semibold'>
            {verse.verseNumber}.
          </ThemedText>
          <View className='flex-1 flex-row flex-wrap'>
            {renderVerseWithBlanks(verse, index)}
          </View>
        </View>
      </View>
    ));
  };

  const totalBlanks = blanks.length;
  const allBlanksCompleted =
    totalBlanks === 0 || blanks.every(blank => blank.selectedAnswer !== null);
  const correctAnswers = blanks.filter(
    blank => blank.selectedAnswer === blank.correctAnswer
  ).length;

  if (!currentSession || !currentVerse) {
    return (
      <SafeAreaView className='flex-1'>
        <BackHeader items={[{ label: 'Memorize', href: '/memorize' }]} />
        <View className='flex-1 items-center justify-center p-4'>
          <ThemedText className='text-base'>No memorize session found</ThemedText>
          <CustomButton
            onPress={() => router.replace('/memorize/fill-in-blanks')}
            className='mt-4'
          >
            Start Memorize
          </CustomButton>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        items={[
          { label: 'Memorize', href: '/memorize' },
          { label: 'Fill in the blanks', href: '/memorize/fill-in-blanks' },
          {
            label: isCollectionsPractice
              ? 'Collections Practice'
              : 'Memorize Session',
            href: '/memorize/fill-in-blanks/practice',
          },
        ]}
      />

      <ScrollView className='flex-1'>
        <View className='flex-1 flex-col justify-between p-[18]'>
          <View>
            <View className='mb-4 flex-row items-center justify-between'>
              <ThemedText className='text-lg font-semibold'>
                Fill in the Blanks {currentVerseIndex + 1} of {verses.length}
              </ThemedText>
              <ThemedText className='text-sm text-muted-foreground'>
                {currentVerse.bookName} {currentVerse.chapter}:
                {formatVerseDisplay(currentVerse.verses)}
              </ThemedText>
            </View>

            <Card className='border-0 border-gray-200 bg-container p-2'>
              <ThemedText className='text-sm text-muted-foreground'>
                Click a blank, then select the correct word from the options.
              </ThemedText>
            </Card>

            <View className='mt-4 space-y-6'>
              <View className='w-full rounded-lg bg-container p-6 leading-relaxed'>
                {renderVersesWithBlanks()}
              </View>

              {selectedBlankId && !showResults && (
                <View className='items-center'>
                  <Badge variant='outline' className='border-blue-200 bg-blue-50'>
                    <ThemedText className='text-sm text-blue-700'>
                      Select the word for the highlighted blank.
                    </ThemedText>
                  </Badge>
                </View>
              )}
            </View>
          </View>

          <View>
            <View className='space-y-3'>
              <ThemedText className='text-base font-semibold'>
                Choose the correct words:
              </ThemedText>

              {options.length > 0 ? (
                <View className='flex-row flex-wrap justify-center gap-3'>
                  {options.map(option => {
                    const isOptionUsedByAnotherBlank =
                      usedOptionIds.has(option.id) &&
                      selectedBlank?.selectedOptionId !== option.id;
                    const isDisabled =
                      showResults ||
                      selectedBlankId === null ||
                      isOptionUsedByAnotherBlank;

                    return (
                      <Button
                        key={option.id}
                        variant={isOptionUsedByAnotherBlank ? 'secondary' : 'outline'}
                        onPress={() => handleOptionClick(option)}
                        disabled={isDisabled}
                        className={`h-10 rounded-full !px-4 !py-2 text-sm transition-all duration-200 ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <ThemedText className='text-sm'>{option.text}</ThemedText>
                      </Button>
                    );
                  })}
                </View>
              ) : (
                <ThemedText className='text-sm text-muted-foreground'>
                  No eligible words were found for this verse.
                </ThemedText>
              )}
            </View>

            {showResults && (
              <Card className='border-blue-200 bg-blue-50 my-4'>
                <CardContent className='pt-6'>
                  <View className='space-y-2 text-center'>
                    <View className='flex items-center justify-center gap-2'>
                      <ThemedText className='text-lg font-semibold'>
                        Results: {correctAnswers}/{totalBlanks} correct
                      </ThemedText>
                    </View>
                    <ThemedText className='text-muted-foreground'>
                      {totalBlanks === 0
                        ? 'No eligible blanks were generated for this verse, so you can continue.'
                        : correctAnswers === totalBlanks
                        ? 'Perfect! You got all answers correct!'
                        : 'Good try! Review the incorrect answers and try again.'}
                    </ThemedText>
                  </View>
                </CardContent>
              </Card>
            )}

            <View className='space-y-3'>
              {!showResults && (
                <View className='flex justify-center mt-4'>
                  <CustomButton
                    onPress={handleCheckAnswers}
                    disabled={!allBlanksCompleted}
                    className='px-8'
                  >
                    Check Answers
                  </CustomButton>
                </View>
              )}

              {showResults && (
                <View className='flex-row justify-center gap-3'>
                  {currentVerseIndex > 0 && (
                    <CustomButton
                      variant='outline'
                      onPress={handlePreviousVerse}
                      className='bg-transparent px-6'
                    >
                      Previous
                    </CustomButton>
                  )}

                  <CustomButton onPress={handleNextVerse} className='px-6'>
                    {currentVerseIndex < verses.length - 1
                      ? 'Next Verse'
                      : 'Finish Practice'}
                  </CustomButton>
                </View>
              )}

              <View className='flex-row justify-center gap-3'>
                <CustomButton
                  variant='outline'
                  onPress={handleReset}
                  className='bg-transparent px-6'
                  disabled={totalBlanks === 0}
                >
                  Reset
                </CustomButton>

                <CustomButton
                  variant='outline'
                  onPress={handleExitPractice}
                  className='bg-transparent px-6'
                >
                  Exit Memorize
                </CustomButton>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
