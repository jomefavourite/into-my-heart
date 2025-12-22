import React, {
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { View, Text, Platform, Modal, TouchableOpacity } from 'react-native';
import CustomBottomSheet from './CustomBottomSheet';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import CustomButton from './CustomButton';
import ThemedText from './ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface AlertDialogRef {
  alert: (title: string, message?: string, buttons?: AlertButton[]) => void;
}

interface AlertDialogProps {
  // This component is controlled via ref, so no props needed
}

const AlertDialog = forwardRef<AlertDialogRef, AlertDialogProps>(
  (props, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [buttons, setButtons] = useState<AlertButton[]>([]);
    const bottomSheetRef = useRef<BottomSheetMethods>(null);
    const { isDarkMode } = useColorScheme();

    useImperativeHandle(ref, () => ({
      alert: (
        alertTitle: string,
        alertMessage?: string,
        alertButtons?: AlertButton[]
      ) => {
        setTitle(alertTitle);
        setMessage(alertMessage || '');

        // Default buttons if none provided
        const defaultButtons: AlertButton[] = alertButtons || [
          { text: 'OK', style: 'default' },
        ];
        setButtons(defaultButtons);

        if (Platform.OS === 'web') {
          setIsVisible(true);
        } else {
          bottomSheetRef.current?.expand();
        }
      },
    }));

    const handleClose = () => {
      if (Platform.OS === 'web') {
        setIsVisible(false);
      } else {
        bottomSheetRef.current?.close();
      }
      // Reset state after a short delay to allow animation to complete
      setTimeout(() => {
        setTitle('');
        setMessage('');
        setButtons([]);
      }, 300);
    };

    const handleButtonPress = (button: AlertButton) => {
      handleClose();
      // Small delay to allow close animation before calling onPress
      setTimeout(() => {
        button.onPress?.();
      }, 100);
    };

    const content = (
      <View className='p-6'>
        <View className='mb-6'>
          {Platform.OS === 'web' && (
            <View className='mb-2 flex-row items-start justify-between'>
              <ThemedText className='flex-1 text-xl font-bold text-gray-900 dark:text-white'>
                {title}
              </ThemedText>
              <TouchableOpacity onPress={handleClose} className='ml-4 p-1'>
                <Text className='text-2xl text-gray-400'>×</Text>
              </TouchableOpacity>
            </View>
          )}
          {Platform.OS !== 'web' && (
            <ThemedText className='mb-2 text-xl font-bold text-gray-900 dark:text-white'>
              {title}
            </ThemedText>
          )}
          {message ? (
            <ThemedText className='text-base leading-6 text-gray-600 dark:text-gray-300'>
              {message}
            </ThemedText>
          ) : null}
        </View>

        <View className='gap-3'>
          {buttons.map((button, index) => {
            const isCancel = button.style === 'cancel';
            const isDestructive = button.style === 'destructive';

            return (
              <CustomButton
                key={index}
                onPress={() => handleButtonPress(button)}
                variant={
                  isDestructive
                    ? 'destructive'
                    : isCancel
                      ? 'outline'
                      : 'default'
                }
                className='w-full'
              >
                {button.text}
              </CustomButton>
            );
          })}
        </View>
      </View>
    );

    if (Platform.OS === 'web') {
      return (
        <Modal
          visible={isVisible}
          transparent
          animationType='fade'
          onRequestClose={handleClose}
        >
          <View className='flex-1 items-center justify-center bg-black/50 p-4'>
            <View className='w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-gray-800'>
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
        snapPoints={buttons.length > 2 ? ['50%'] : ['35%']}
        enablePanDownToClose
        onClose={handleClose}
      >
        <BottomSheetView className='flex-1 py-4'>{content}</BottomSheetView>
      </CustomBottomSheet>
    );
  }
);

AlertDialog.displayName = 'AlertDialog';

export default AlertDialog;
