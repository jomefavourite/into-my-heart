import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { View } from 'react-native';
import ThemedText from '~/components/ThemedText';
import { ScrollView } from 'react-native-gesture-handler';

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
  // Sample sentence with blanks
  const sentence =
    'The quick ___ fox jumps over the lazy ___. Programming is ___ when you understand the ___.';

  // Initialize blanks data
  const [blanks, setBlanks] = useState<BlankData[]>([
    { id: 1, correctAnswer: 'brown', selectedAnswer: null },
    { id: 2, correctAnswer: 'dog', selectedAnswer: null },
    { id: 3, correctAnswer: 'fun', selectedAnswer: null },
    { id: 4, correctAnswer: 'concepts', selectedAnswer: null },
  ]);

  // Available options
  const [options, setOptions] = useState<OptionData[]>([
    { id: 'opt1', text: 'brown', used: false },
    { id: 'opt2', text: 'dog', used: false },
    { id: 'opt3', text: 'fun', used: false },
    { id: 'opt4', text: 'concepts', used: false },
    { id: 'opt5', text: 'difficult', used: false },
    { id: 'opt6', text: 'cat', used: false },
  ]);

  const [selectedBlankId, setSelectedBlankId] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleBlankClick = (blankId: number) => {
    if (showResults) return;
    setSelectedBlankId(blankId);
  };

  const handleOptionClick = (option: OptionData) => {
    if (selectedBlankId === null || option.used || showResults) return;

    // Update blanks
    setBlanks((prev) =>
      prev.map((blank) =>
        blank.id === selectedBlankId
          ? { ...blank, selectedAnswer: option.text }
          : blank
      )
    );

    // Mark option as used
    setOptions((prev) =>
      prev.map((opt) => (opt.id === option.id ? { ...opt, used: true } : opt))
    );

    // If there was a previous answer for this blank, mark that option as unused
    const currentBlank = blanks.find((b) => b.id === selectedBlankId);
    if (currentBlank?.selectedAnswer) {
      setOptions((prev) =>
        prev.map((opt) =>
          opt.text === currentBlank.selectedAnswer
            ? { ...opt, used: false }
            : opt
        )
      );
    }

    setSelectedBlankId(null);
  };

  const handleReset = () => {
    setBlanks((prev) =>
      prev.map((blank) => ({ ...blank, selectedAnswer: null }))
    );
    setOptions((prev) => prev.map((opt) => ({ ...opt, used: false })));
    setSelectedBlankId(null);
    setShowResults(false);
  };

  const handleCheckAnswers = () => {
    setShowResults(true);
    setSelectedBlankId(null);
  };

  const renderSentenceWithBlanks = () => {
    const parts = sentence.split('___');
    const result = [];

    for (let i = 0; i < parts.length; i++) {
      result.push(
        <ThemedText key={`text-${i}`} className='text-lg'>
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
            className={`
              inline-flex items-center justify-center min-w-[100px] h-8 mx-1 px-3 rounded-md border-2 border-dashed
              transition-all duration-200 text-sm font-medium
              ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
              ${isCorrect ? 'border-green-500 bg-green-50 text-green-700' : ''}
              ${isIncorrect ? 'border-red-500 bg-red-50 text-red-700' : ''}
              ${!showResults ? 'hover:border-blue-400 hover:bg-blue-25' : ''}
            `}
            disabled={showResults}
          >
            <ThemedText>{blank.selectedAnswer || '___'}</ThemedText>
          </Button>
        );
      }
    }

    return result;
  };

  const allBlanksCompleted = blanks.every(
    (blank) => blank.selectedAnswer !== null
  );
  const correctAnswers = blanks.filter(
    (blank) => blank.selectedAnswer === blank.correctAnswer
  ).length;
  const totalBlanks = blanks.length;

  return (
    <ScrollView className='flex-1'>
      <View className='max-w-4xl mx-auto p-6 space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl font-bold text-center'>
              Fill in the Blanks
            </CardTitle>
            <ThemedText className='text-center text-muted-foreground'>
              Click on a blank space, then select the correct word from the
              options below
            </ThemedText>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Sentence with blanks */}
            <View className='p-6 bg-gray-50 rounded-lg flex-row flex-wrap w-full leading-relaxed'>
              {renderSentenceWithBlanks()}
            </View>

            {/* Selected blank indicator */}
            {selectedBlankId && !showResults && (
              <View className='text-center'>
                <Badge variant='outline' className='bg-blue-50 text-blue-700'>
                  <ThemedText>Filling blank #{selectedBlankId}</ThemedText>
                </Badge>
              </View>
            )}

            {/* Options */}
            <View className='space-y-3'>
              <ThemedText className='text-lg font-semibold'>
                Choose the correct words:
              </ThemedText>
              <View className='flex-row flex-wrap gap-3'>
                {options.map((option) => (
                  <Button
                    key={option.id}
                    variant={option.used ? 'secondary' : 'outline'}
                    onPress={() => handleOptionClick(option)}
                    disabled={option.used || showResults}
                    className={`
                    h-12  transition-all duration-200
                    ${option.used ? 'opacity-50 cursor-not-allowed' : ''}
                    ${!option.used && !showResults ? 'hover:bg-blue-50 hover:border-blue-300' : ''}
                  `}
                  >
                    <ThemedText>{option.text}</ThemedText>
                  </Button>
                ))}
              </View>
            </View>

            {/* Results */}
            {showResults && (
              <Card className='bg-blue-50 border-blue-200'>
                <CardContent className='pt-6'>
                  <View className='text-center space-y-2'>
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
            <View className='flex justify-center gap-4'>
              {!showResults && (
                <Button
                  onPress={handleCheckAnswers}
                  disabled={!allBlanksCompleted}
                  className='px-8'
                >
                  {/* <Check className="h-4 w-4 mr-2" /> */}
                  <ThemedText>Check Answers</ThemedText>
                </Button>
              )}

              <Button
                variant='outline'
                onPress={handleReset}
                className='px-8 bg-transparent'
              >
                {/* <RotateCcw className="h-4 w-4 mr-2" /> */}
                <ThemedText>Reset</ThemedText>
              </Button>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
