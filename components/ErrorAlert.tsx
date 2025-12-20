import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { AlertCircle, X } from 'lucide-react-native';

interface ErrorAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorAlert({
  visible,
  title,
  message,
  onClose,
  onRetry,
  showRetry = false,
}: ErrorAlertProps) {
  if (!visible) return null;

  // Use native Alert on mobile
  if (Platform.OS !== 'web') {
    React.useEffect(() => {
      if (!visible) return;

      const buttons = [{ text: 'Close', onPress: onClose }];

      if (showRetry && onRetry) {
        buttons.unshift({ text: 'Try Again', onPress: onRetry });
      }

      Alert.alert(title, message, buttons);
    }, [visible, title, message, onClose, onRetry, showRetry]);

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
              <AlertCircle size={24} />
              <Text className='ml-2 text-xl font-bold'>{title}</Text>
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
          <Text className='mb-6 leading-5 text-gray-600'>{message}</Text>

          {/* Actions */}
          <View className='flex-row space-x-3'>
            <TouchableOpacity
              onPress={onClose}
              className='flex-1 rounded-md bg-gray-100 px-4 py-3'
            >
              <Text className='text-center font-medium text-gray-700'>
                Close
              </Text>
            </TouchableOpacity>

            {showRetry && onRetry && (
              <TouchableOpacity
                onPress={onRetry}
                className='flex-1 rounded-md bg-blue-600 px-4 py-3'
              >
                <Text className='text-center font-medium text-white'>
                  Try Again
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Hook for managing error state
export function useErrorAlert() {
  const [error, setError] = React.useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({
    visible: false,
    title: '',
    message: '',
  });

  const showError = (title: string, message: string) => {
    // On mobile, show native alert immediately
    if (Platform.OS !== 'web') {
      const buttons = [{ text: 'Close', style: 'default' as const }];
      Alert.alert(title, message, buttons);
      return;
    }

    // On web, use custom modal
    setError({
      visible: true,
      title,
      message,
    });
  };

  const hideError = () => {
    setError(prev => ({ ...prev, visible: false }));
  };

  const ErrorAlertComponent = ({
    onRetry,
    showRetry,
  }: {
    onRetry?: () => void;
    showRetry?: boolean;
  }) => {
    // On mobile, return null since we use native Alert
    if (Platform.OS !== 'web') {
      return null;
    }

    // On web, return custom modal
    return (
      <ErrorAlert
        visible={error.visible}
        title={error.title}
        message={error.message}
        onClose={hideError}
        onRetry={onRetry}
        showRetry={showRetry}
      />
    );
  };

  return {
    showError,
    hideError,
    ErrorAlertComponent,
  };
}
