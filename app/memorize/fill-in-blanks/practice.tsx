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
  const [sentence, setSentence] = useState('');
  const [blanks, setBlanks] = useState<BlankData[]>([]);
  const [options, setOptions] = useState<OptionData[]>([]);
  const [selectedBlankId, setSelectedBlankId] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Get current verse data
  const verses = currentSession?.verses || [];
  const currentVerse = verses[currentVerseIndex];
  const isCollectionsPractice = currentSession?.practiceType === 'collections';

  // Generate fill-in-blanks from verse text
  const generateFillInBlanks = (verseText: string) => {
    // Split verse text into words
    const words = verseText.split(/\s+/).filter(word => word.length > 2);

    // Select 3-5 random words to be blanks (but not too many)
    const numBlanks = Math.min(Math.max(3, Math.floor(words.length * 0.2)), 5);
    const blankIndices = new Set<number>();

    while (blankIndices.size < numBlanks) {
      const randomIndex = Math.floor(Math.random() * words.length);
      blankIndices.add(randomIndex);
    }

    // Create blanks data
    const blanksData: BlankData[] = [];
    const optionsData: OptionData[] = [];
    const sentenceParts: string[] = [];

    words.forEach((word, index) => {
      if (blankIndices.has(index)) {
        const cleanWord = word.replace(/[^\w]/g, ''); // Remove punctuation
        blanksData.push({
          id: blanksData.length + 1,
          correctAnswer: cleanWord,
          selectedAnswer: null,
        });
        sentenceParts.push('___');

        // Add correct answer to options
        optionsData.push({
          id: `opt-${cleanWord}-${index}`,
          text: cleanWord,
          used: false,
        });
      } else {
        sentenceParts.push(word);
      }
    });

    // Add some incorrect options
    const incorrectWords = words
      .filter((_, index) => !blankIndices.has(index))
      .map(word => word.replace(/[^\w]/g, ''))
      .filter(word => word.length > 2)
      .slice(0, Math.min(3, blanksData.length));

    incorrectWords.forEach((word, index) => {
      optionsData.push({
        id: `opt-incorrect-${word}-${index}`,
        text: word,
        used: false,
      });
    });

    // Shuffle options
    const shuffledOptions = optionsData.sort(() => Math.random() - 0.5);

    return {
      sentence: sentenceParts.join(' '),
      blanks: blanksData,
      options: shuffledOptions,
    };
  };

  // Initialize fill-in-blanks when verse changes
  useEffect(() => {
    if (currentVerse) {
      const verseText = currentVerse.verseTexts.map(vt => vt.text).join(' ');

      const {
        sentence: newSentence,
        blanks: newBlanks,
        options: newOptions,
      } = generateFillInBlanks(verseText);

      setSentence(newSentence);
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
      // Practice session complete
      clearPracticeSession();
      router.replace('/memorize/fill-in-blanks');
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

  const renderSentenceWithBlanks = () => {
    const parts = sentence.split('___');
    const result = [];

    for (let i = 0; i < parts.length; i++) {
      result.push(
        <ThemedText key={`text-${i}`} className='text-base'>
          {parts[i]}
        </ThemedText>
      );

      if (i < parts.length - 1) {
        const blank = blanks[i];
        const isSelected = selectedBlankId === blank.id;
        const isCorrect =
          showResults && blank.selectedAnswer === blank.correctAnswer;
        const isIncorrect =
          showResults &&
          blank.selectedAnswer !== blank.correctAnswer &&
          blank.selectedAnswer !== null;

        result.push(
          <Button
            key={`blank-${i}`}
            size={'sm'}
            onPress={() => handleBlankClick(blank.id)}
            className={`mx-1 inline-flex h-6 min-w-[100px] items-center justify-center rounded-md border-2 border-dashed px-3 text-sm font-medium transition-all duration-200 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} ${isCorrect ? 'border-green-500 bg-green-50 text-green-700' : ''} ${isIncorrect ? 'border-red-500 bg-red-50 text-red-700' : ''} ${!showResults ? 'hover:bg-blue-25 hover:border-blue-400' : ''} `}
            disabled={showResults}
          >
            <ThemedText className='text-sm'>
              {blank.selectedAnswer || '___'}
            </ThemedText>
          </Button>
        );
      }
    }

    return result;
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
                {currentVerse.verses.join(', ')}
              </ThemedText>
            </View>

            <Card className='border-0 border-gray-200 bg-gray-50 p-2'>
              <ThemedText className='text-sm text-muted-foreground'>
                Click on a blank space, then select the correct word from the
                options below
              </ThemedText>
            </Card>

            <View className='mt-4 space-y-6'>
              {/* Sentence with blanks */}
              <View className='w-full flex-row flex-wrap rounded-lg bg-gray-50 p-6 leading-relaxed'>
                {renderSentenceWithBlanks()}
              </View>

              {/* Selected blank indicator */}
              {selectedBlankId && !showResults && (
                <View className='text-center'>
                  <Badge variant='outline' className='bg-blue-50 text-blue-700'>
                    <ThemedText className='text-sm'>
                      Filling blank #{selectedBlankId}
                    </ThemedText>
                  </Badge>
                </View>
              )}
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
              {!showResults && (
                <View className='flex justify-center'>
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
                      : 'Finish Memorize'}
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
