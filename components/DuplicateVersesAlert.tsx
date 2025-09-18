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
        className='flex-1 bg-black/50 items-center justify-center p-4'
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10000,
        }}
      >
        <View className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl max-w-md w-full'>
          {/* Header */}
          <View className='flex-row items-center justify-between mb-4'>
            <View className='flex-row items-center'>
              <AlertTriangle size={24} color='#F59E0B' />
              <Text className='text-xl font-bold text-amber-600 ml-2'>
                Duplicate Verses Found
              </Text>
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
          <Text className='text-gray-600 mb-6 leading-5'>
            The following verses from {bookName} {chapter} already exist in your
            collection:
          </Text>

          <View className='bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg mb-6'>
            <Text className='text-amber-800 dark:text-amber-200 font-medium text-center'>
              {duplicateVerses.join(', ')}
            </Text>
          </View>

          <Text className='text-gray-600 mb-6 leading-5'>
            These verses will be skipped. Do you want to continue adding the
            remaining verses?
          </Text>

          {/* Actions */}
          <View className='flex-row space-x-3'>
            <TouchableOpacity
              onPress={onClose}
              className='flex-1 bg-gray-100 dark:bg-gray-700 py-3 px-4 rounded-md'
            >
              <Text className='text-gray-700 dark:text-gray-300 font-medium text-center'>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onContinue}
              className='flex-1 bg-blue-600 py-3 px-4 rounded-md'
            >
              <Text className='text-white font-medium text-center'>
                Continue
              </Text>
            </TouchableOpacity>
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
