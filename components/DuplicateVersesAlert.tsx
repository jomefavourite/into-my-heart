import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { AlertTriangle, X } from 'lucide-react-native';
import CustomBottomSheet from './CustomBottomSheet';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import ThemedText from './ThemedText';
import { Button } from './ui/button';
import CustomButton from './CustomButton';

interface DuplicateVersesAlertProps {
  visible: boolean;
  duplicateVerses: number[];
  bookName: string;
  chapter: number;
  onClose: () => void;
  onContinue: () => void;
}

export function DuplicateVersesAlert({
  visible,
  duplicateVerses,
  bookName,
  chapter,
  onClose,
  onContinue,
}: DuplicateVersesAlertProps) {
  if (!visible) return null;

  const message = `The following verses from ${bookName} ${chapter} already exist in your collection:\n\n${duplicateVerses.join(', ')}\n\nThese verses will be skipped. Do you want to continue adding the remaining verses?`;

  // Use native Alert on mobile
  if (Platform.OS !== 'web') {
    React.useEffect(() => {
      if (!visible) return;

      Alert.alert('Duplicate Verses Found', message, [
        { text: 'Cancel', onPress: onClose, style: 'cancel' },
        { text: 'Continue', onPress: onContinue, style: 'default' },
      ]);
    }, [visible, message, onClose, onContinue]);

    return null;
  }

  // Use custom Modal on web
  return (
    <Modal
      transparent
      visible={visible}
      animationType='fade'
      onRequestClose={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      <View
        className='flex-1 items-center justify-center bg-black/50 p-4'
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10000,
        }}
      >
        <View className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800'>
          {/* Header */}
          <View className='mb-4 flex-row items-center justify-between'>
            <View className='flex-row items-center'>
              <AlertTriangle size={24} color='#F59E0B' />
              <ThemedText className='ml-2 text-xl font-bold'>
                Duplicate Verses Found
              </ThemedText>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className='p-1'
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={20} color='#6B7280' />
            </TouchableOpacity>
          </View>

          {/* Message */}
          <ThemedText className='mb-6 leading-5 text-gray-600'>
            The following verses from {bookName} {chapter} already exist in your
            collection:
          </ThemedText>

          <View className='mb-6 rounded-lg'>
            <ThemedText className='text-center font-medium'>
              {duplicateVerses.join(', ')}
            </ThemedText>
          </View>

          <ThemedText className='mb-6 leading-5 text-gray-600'>
            These verses will be skipped. Do you want to continue adding the
            remaining verses?
          </ThemedText>

          {/* Actions */}
          <View className='flex-row space-x-3'>
            <CustomButton
              onPress={onClose}
              variant='outline'
              className='flex-1 rounded-md px-4 py-3'
            >
              Cancel
            </CustomButton>

            <CustomButton
              onPress={onContinue}
              className='flex-1 rounded-md px-4 py-3'
            >
              Continue
            </CustomButton>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Hook for managing duplicate verses state
export function useDuplicateVersesAlert() {
  const [alert, setAlert] = React.useState<{
    visible: boolean;
    duplicateVerses: number[];
    bookName: string;
    chapter: number;
  }>({
    visible: false,
    duplicateVerses: [],
    bookName: '',
    chapter: 0,
  });

  const showDuplicateAlert = (
    duplicateVerses: number[],
    bookName: string,
    chapter: number
  ) => {
    setAlert({
      visible: true,
      duplicateVerses,
      bookName,
      chapter,
    });
  };

  const hideDuplicateAlert = () => {
    setAlert(prev => ({ ...prev, visible: false }));
  };

  const DuplicateVersesAlertComponent = ({
    onContinue,
  }: {
    onContinue: () => void;
  }) => {
    // On mobile, return null since we use native Alert
    if (Platform.OS !== 'web') {
      return null;
    }

    // On web, return custom modal
    return (
      <DuplicateVersesAlert
        visible={alert.visible}
        duplicateVerses={alert.duplicateVerses}
        bookName={alert.bookName}
        chapter={alert.chapter}
        onClose={hideDuplicateAlert}
        onContinue={onContinue}
      />
    );
  };

  return {
    showDuplicateAlert,
    hideDuplicateAlert,
    DuplicateVersesAlertComponent,
  };
}
