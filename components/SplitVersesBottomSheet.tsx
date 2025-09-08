import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
} from 'react';
import { View, Text, Platform, TouchableOpacity } from 'react-native';
import { Modal } from 'react-native';
import CustomBottomSheet from './CustomBottomSheet';
import CustomButton from './CustomButton';
import { BottomSheetView } from '@gorhom/bottom-sheet';

interface SplitVersesBottomSheetProps {
  onSplitIntoIndividual: () => void;
  onKeepAsGroup: () => void;
  verseCount: number;
  bookName: string;
  chapter: number;
  verses: number[];
}

export interface SplitVersesBottomSheetRef {
  open: () => void;
  close: () => void;
}

const SplitVersesBottomSheet = forwardRef<
  SplitVersesBottomSheetRef,
  SplitVersesBottomSheetProps
>(
  (
    {
      onSplitIntoIndividual,
      onKeepAsGroup,
      verseCount,
      bookName,
      chapter,
      verses,
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const bottomSheetRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      open: () => {
        if (Platform.OS !== 'web') {
          bottomSheetRef.current?.expand();
        } else {
          setIsVisible(true);
        }
      },
      close: () => {
        if (Platform.OS !== 'web') {
          bottomSheetRef.current?.close();
        } else {
          setIsVisible(false);
        }
      },
    }));

    const handleSplitIntoIndividual = () => {
      onSplitIntoIndividual();
      if (Platform.OS !== 'web') {
        bottomSheetRef.current?.close();
      } else {
        setIsVisible(false);
      }
    };

    const handleKeepAsGroup = () => {
      onKeepAsGroup();
      if (Platform.OS !== 'web') {
        bottomSheetRef.current?.close();
      } else {
        setIsVisible(false);
      }
    };

    const handleClose = () => {
      if (Platform.OS !== 'web') {
        bottomSheetRef.current?.close();
      } else {
        setIsVisible(false);
      }
    };

    const minVerse = Math.min(...verses);
    const maxVerse = Math.max(...verses);

    const content = (
      <View className='p-6'>
        <View className='mb-6'>
          <View className='flex-row justify-between items-start mb-2'>
            <Text className='text-xl font-bold text-gray-900 dark:text-white flex-1'>
              Split into Individual Verses?
            </Text>
            {Platform.OS === 'web' && (
              <TouchableOpacity onPress={handleClose} className='ml-4 p-1'>
                <Text className='text-2xl text-gray-400 hover:text-gray-600'>
                  ×
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text className='text-gray-600 dark:text-gray-300 text-base leading-6'>
            You've selected {verseCount} verses from {bookName} {chapter}:
            {verses.length > 5
              ? `${minVerse}...${maxVerse}`
              : verses.sort((a, b) => a - b).join(', ')}
            .
          </Text>
          <Text className='text-gray-600 dark:text-gray-300 text-base leading-6 mt-2'>
            Would you like to split these into individual verses for separate
            memorization, or keep them as a group?
          </Text>
        </View>

        <View className='gap-3'>
          <CustomButton onPress={handleSplitIntoIndividual} className='w-full'>
            {`Split into ${verseCount} Individual Verses`}
          </CustomButton>

          <CustomButton
            onPress={handleKeepAsGroup}
            variant='outline'
            className='w-full'
          >
            Keep as Group
          </CustomButton>
        </View>
      </View>
    );

    if (Platform.OS === 'web') {
      return (
        <Modal
          visible={isVisible}
          transparent
          animationType='fade'
          onRequestClose={() => setIsVisible(false)}
        >
          <View className='flex-1 bg-black/50 items-center justify-center p-4'>
            <View className='bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-xl'>
              {content}
            </View>
          </View>
        </Modal>
      );
    }

    return (
      <CustomBottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['40%']}
        enablePanDownToClose
      >
        <BottomSheetView className='flex-1 py-4'>{content}</BottomSheetView>
      </CustomBottomSheet>
    );
  }
);

SplitVersesBottomSheet.displayName = 'SplitVersesBottomSheet';

export default SplitVersesBottomSheet;
