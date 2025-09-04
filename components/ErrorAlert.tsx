import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
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

  return (
    <Modal
      transparent
      visible={visible}
      animationType='fade'
      onRequestClose={onClose}
    >
      <View className='flex-1 bg-black/50 items-center justify-center p-4'>
        <View className='bg-white rounded-lg p-6 shadow-lg max-w-sm w-full'>
          {/* Header */}
          <View className='flex-row items-center justify-between mb-4'>
            <View className='flex-row items-center'>
              <AlertCircle size={24} color='#DC2626' />
              <Text className='text-xl font-bold text-red-600 ml-2'>
                {title}
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
          <Text className='text-gray-600 mb-6 leading-5'>{message}</Text>

          {/* Actions */}
          <View className='flex-row space-x-3'>
            <TouchableOpacity
              onPress={onClose}
              className='flex-1 bg-gray-100 py-3 px-4 rounded-md'
            >
              <Text className='text-gray-700 font-medium text-center'>
                Close
              </Text>
            </TouchableOpacity>

            {showRetry && onRetry && (
              <TouchableOpacity
                onPress={onRetry}
                className='flex-1 bg-blue-600 py-3 px-4 rounded-md'
              >
                <Text className='text-white font-medium text-center'>
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
  }) => (
    <ErrorAlert
      visible={error.visible}
      title={error.title}
      message={error.message}
      onClose={hideError}
      onRetry={onRetry}
      showRetry={showRetry}
    />
  );

  return {
    showError,
    hideError,
    ErrorAlertComponent,
  };
}
