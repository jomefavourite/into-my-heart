import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { View } from 'react-native';
import ThemedText from '@/components/ThemedText';
import { ScrollView } from 'react-native-gesture-handler';
import CustomButton from '@/components/CustomButton';
import { usePracticeStore, PracticeVerse } from '@/store/practiceStore';
import { useRouter } from 'expo-router';
import BackHeader from '@/components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatVerseDisplay } from '@/lib/utils';

interface BlankData {
  id: number;
  correctAnswer: string;
  selectedAnswer: string | null;
}

interface OptionData {
  id: string;
  text: string;
  used: boolean;
}

export default function FillInTheBlanks() {
  const { currentSession, clearPracticeSession } = usePracticeStore();
  const router = useRouter();

  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [verseData, setVerseData] = useState<
    { verseNumber: string; text: string; blanks: BlankData[] }[]
  >([]);
  const [blanks, setBlanks] = useState<BlankData[]>([]);
  const [options, setOptions] = useState<OptionData[]>([]);
  const [selectedBlankId, setSelectedBlankId] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Get current verse data
  const verses = currentSession?.verses || [];
  const currentVerse = verses[currentVerseIndex];
  const isCollectionsPractice = currentSession?.practiceType === 'collections';

  // Generate fill-in-blanks from verse texts (verse by verse)
  const generateFillInBlanks = (
    verseTexts: { verse: string; text: string }[]
  ) => {
    const allBlanksData: BlankData[] = [];
    const allOptionsData: OptionData[] = [];
    const verseData: {
      verseNumber: string;
      text: string;
      blanks: BlankData[];
    }[] = [];
    let globalBlankId = 1;

    verseTexts.forEach((verseText, verseIndex) => {
      // Split verse text into words
      const words = verseText.text.split(/\s+/).filter(word => word.length > 2);

      // Select 1-3 random words to be blanks per verse (but not too many)
      const numBlanks = Math.min(
        Math.max(1, Math.floor(words.length * 0.15)),
        3
      );
      const blankIndices = new Set<number>();

      while (blankIndices.size < numBlanks) {
        const randomIndex = Math.floor(Math.random() * words.length);
        blankIndices.add(randomIndex);
      }

      // Create blanks data for this verse
      const verseBlanksData: BlankData[] = [];
      const verseOptionsData: OptionData[] = [];

      words.forEach((word, index) => {
        if (blankIndices.has(index)) {
          const cleanWord = word.replace(/[^\w]/g, ''); // Remove punctuation

          verseBlanksData.push({
            id: globalBlankId++,
            correctAnswer: cleanWord,
            selectedAnswer: null,
          });

          // Add correct answer to options
          verseOptionsData.push({
            id: `opt-${cleanWord}-${verseIndex}-${index}`,
            text: cleanWord,
            used: false,
          });
        }
      });

      // Add some incorrect options from this verse
      const incorrectWords = words
        .filter((_, index) => !blankIndices.has(index))
        .map(word => word.replace(/[^\w]/g, ''))
        .filter(word => word.length > 2)
        .slice(0, Math.min(2, verseBlanksData.length));

      incorrectWords.forEach((word, index) => {
        verseOptionsData.push({
          id: `opt-incorrect-${word}-${verseIndex}-${index}`,
          text: word,
          used: false,
        });
      });

      // Store verse data
      verseData.push({
        verseNumber: verseText.verse,
        text: verseText.text,
        blanks: verseBlanksData,
      });

      // Add to global arrays
      allBlanksData.push(...verseBlanksData);
      allOptionsData.push(...verseOptionsData);
    });

    // Shuffle all options together
    const shuffledOptions = allOptionsData.sort(() => Math.random() - 0.5);

    return {
      verseData,
      blanks: allBlanksData,
      options: shuffledOptions,
    };
  };

  // Initialize fill-in-blanks when verse changes
  useEffect(() => {
    if (currentVerse) {
      const {
        verseData: newVerseData,
        blanks: newBlanks,
        options: newOptions,
      } = generateFillInBlanks(currentVerse.verseTexts);

      setVerseData(newVerseData);
      setBlanks(newBlanks);
      setOptions(newOptions);
      setSelectedBlankId(null);
      setShowResults(false);
    }
  }, [currentVerseIndex, currentVerse]);

  // Handle navigation back if no practice session
  useEffect(() => {
    if (!currentSession) {
      router.replace('/memorize/fill-in-blanks');
    }
  }, [currentSession, router]);

  const handleBlankClick = (blankId: number) => {
    if (showResults) return;
    setSelectedBlankId(blankId);
  };

  const handleOptionClick = (option: OptionData) => {
    if (selectedBlankId === null || option.used || showResults) return;

    // Update blanks
    setBlanks(prev =>
      prev.map(blank =>
        blank.id === selectedBlankId
          ? { ...blank, selectedAnswer: option.text }
          : blank
      )
    );

    // Update verseData to reflect the change
    setVerseData(prev =>
      prev.map(verse => ({
        ...verse,
        blanks: verse.blanks.map(blank =>
          blank.id === selectedBlankId
            ? { ...blank, selectedAnswer: option.text }
            : blank
        ),
      }))
    );

    // Mark option as used
    setOptions(prev =>
      prev.map(opt => (opt.id === option.id ? { ...opt, used: true } : opt))
    );

    // If there was a previous answer for this blank, mark that option as unused
    const currentBlank = blanks.find(b => b.id === selectedBlankId);
    if (currentBlank?.selectedAnswer) {
      setOptions(prev =>
        prev.map(opt =>
          opt.text === currentBlank.selectedAnswer
            ? { ...opt, used: false }
            : opt
        )
      );
    }

    setSelectedBlankId(null);
  };

  const handleReset = () => {
    setBlanks(prev => prev.map(blank => ({ ...blank, selectedAnswer: null })));
    setVerseData(prev =>
      prev.map(verse => ({
        ...verse,
        blanks: verse.blanks.map(blank => ({ ...blank, selectedAnswer: null })),
      }))
    );
    setOptions(prev => prev.map(opt => ({ ...opt, used: false })));
    setSelectedBlankId(null);
    setShowResults(false);
  };

  const handleCheckAnswers = () => {
    setShowResults(true);
    setSelectedBlankId(null);
  };

  const handleNextVerse = () => {
    if (currentVerseIndex < verses.length - 1) {
      setCurrentVerseIndex(prev => prev + 1);
    } else {
      // Practice session complete - navigate to practice complete screen
      router.replace('./practice-complete');
    }
  };

  const handlePreviousVerse = () => {
    if (currentVerseIndex > 0) {
      setCurrentVerseIndex(prev => prev - 1);
    }
  };

  const handleExitPractice = () => {
    clearPracticeSession();
    router.replace('/memorize/fill-in-blanks');
  };

  const renderVerseWithBlanks = (
    verse: {
      verseNumber: string;
      text: string;
      blanks: BlankData[];
    },
    verseIndex: number
  ) => {
    const words = verse.text.split(/\s+/);
    const result = [];

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const cleanWord = word.replace(/[^\w]/g, '');

      // Check if this word should be a blank
      const blank = verse.blanks.find(b => b.correctAnswer === cleanWord);

      if (blank) {
        const isSelected = selectedBlankId === blank.id;
        const isCorrect =
          showResults && blank.selectedAnswer === blank.correctAnswer;
        const isIncorrect =
          showResults &&
          blank.selectedAnswer !== blank.correctAnswer &&
          blank.selectedAnswer !== null;

        result.push(
          <Button
            key={`blank-${verseIndex}-${i}-${blank.id}`}
            size={'sm'}
            onPress={() => handleBlankClick(blank.id)}
            className={`mx-1 inline-flex h-6 w-fit min-w-[80px] items-center justify-center rounded-md text-sm font-medium transition-all duration-200 ${isSelected ? 'border-blue-500 bg-gray-500' : 'border-gray-300'} ${isCorrect ? 'border-green-500 bg-green-50' : ''} ${isIncorrect ? 'border-red-500 bg-red-50 text-red-700' : ''} ${!showResults ? 'hover:bg-blue-25 hover:border-blue-400' : ''} mb-1 sm:h-6`}
            disabled={showResults}
          >
            <ThemedText className='text-sm'>
              {blank.selectedAnswer || '____'}
            </ThemedText>
          </Button>
        );
      } else {
        result.push(
          <ThemedText key={`word-${verseIndex}-${i}`} className='text-base'>
            {word}{' '}
          </ThemedText>
        );
      }
    }

    return result;
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

  const allBlanksCompleted = blanks.every(
    blank => blank.selectedAnswer !== null
  );
  const correctAnswers = blanks.filter(
    blank => blank.selectedAnswer === blank.correctAnswer
  ).length;
  const totalBlanks = blanks.length;

  if (!currentSession || !currentVerse) {
    return (
      <SafeAreaView className='flex-1'>
        <BackHeader items={[{ label: 'Memorize', href: '/memorize' }]} />
        <View className='flex-1 items-center justify-center p-4'>
          <ThemedText className='text-base'>
            No memorize session found
          </ThemedText>
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
                Click on a blank space, then select the correct word from the
                options below
              </ThemedText>
            </Card>

            <View className='mt-4 space-y-6'>
              {/* Verses with blanks */}
              <View className='w-full rounded-lg bg-container p-6 leading-relaxed'>
                {renderVersesWithBlanks()}
              </View>

              {/* Selected blank indicator */}
              {/* {selectedBlankId && !showResults && (
                <View className='text-center'>
                  <Badge variant='outline' className='bg-blue-50 text-blue-700'>
                    <ThemedText className='text-sm'>
                      Filling blank #{selectedBlankId}
                    </ThemedText>
                  </Badge>
                </View>
              )} */}
            </View>
          </View>

          <View className=''>
            {/* Options */}
            <View className='space-y-3'>
              <ThemedText className='text-base font-semibold'>
                Choose the correct words:
              </ThemedText>
              <View className='flex-row flex-wrap justify-center gap-3'>
                {options.map(option => (
                  <Button
                    key={option.id}
                    variant={option.used ? 'secondary' : 'outline'}
                    onPress={() => handleOptionClick(option)}
                    disabled={option.used || showResults}
                    className={`h-10 rounded-full !px-4 !py-2 text-sm transition-all duration-200 ${option.used ? 'cursor-not-allowed opacity-50' : ''} ${!option.used && !showResults ? 'hover:border-blue-300 hover:bg-blue-50' : ''} `}
                  >
                    <ThemedText className='text-sm'>{option.text}</ThemedText>
                  </Button>
                ))}
              </View>
            </View>

            {/* Results */}
            {showResults && (
              <Card className='border-blue-200 bg-blue-50'>
                <CardContent className='pt-6'>
                  <View className='space-y-2 text-center'>
                    <View className='flex items-center justify-center gap-2'>
                      {/* <Check className='h-5 w-5 text-green-600' /> */}
                      <ThemedText className='text-lg font-semibold'>
                        Results: {correctAnswers}/{totalBlanks} correct
                      </ThemedText>
                    </View>
                    <ThemedText className='text-muted-foreground'>
                      {correctAnswers === totalBlanks
                        ? 'Perfect! You got all answers correct!'
                        : 'Good try! Review the incorrect answers and try again.'}
                    </ThemedText>
                  </View>
                </CardContent>
              </Card>
            )}

            {/* Action buttons */}
            <View className='space-y-3'>
              {/* {!showResults && (
                <View className='flex justify-center'>
                  <CustomButton
                    onPress={handleCheckAnswers}
                    disabled={!allBlanksCompleted}
                    className='px-8'
                  >
                    Check Answers
                  </CustomButton>
                </View>
              )} */}

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
                  disabled={showResults}
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
