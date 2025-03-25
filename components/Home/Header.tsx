import { View, Text, Pressable, Platform } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { useRouter } from 'expo-router';
import NotificationIcon from '~/assets/icons/NotificationIcon';
import FireIcon from '~/assets/icons/FireIcon';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { useUser } from '@clerk/clerk-expo';
import ThemedText from '../ThemedText';
import CustomButton from '../CustomButton';
import { useColorScheme } from '~/hooks/useColorScheme';
import { useCallback, useRef } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { cn, useBottomSheetStore } from '~/lib/utils';

export default function HomeHeader() {
  const { user } = useUser();
  const router = useRouter();

  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const setBottomSheetIndex = useBottomSheetStore(
    (state) => state.setBottomSheetIndex
  );

  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = ['50%'];

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleOpenPress = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0); // Opens to the first snap point
  }, []);

  return (
    <>
      {/* Header */}
      <SafeAreaView
        style={{
          ...Platform.select({
            ios: {
              height: 125,
            },
          }),
        }}
      >
        <View className='p-4 flex-row justify-between items-center'>
          <View className='flex-row gap-2'>
            <Avatar alt="Zach Nugent's Avatar">
              <AvatarImage source={{ uri: user?.imageUrl }} />
              <AvatarFallback>
                <ThemedText>{user?.firstName?.charAt(0)}</ThemedText>
              </AvatarFallback>
            </Avatar>
            <View>
              <ThemedText size={12} className='text-[#707070]'>
                Welcome
              </ThemedText>
              <ThemedText variant='medium'>{user?.firstName}</ThemedText>
            </View>
          </View>

          <View className='flex-row items-center justify-end gap-4 '>
            <CustomButton
              className={cn('w-fit !px-4 gap-1 self-end')}
              onPress={() => setBottomSheetIndex(1)}
              leftIcon
              Icon={() => (
                <Svg width={24} height={24} fill='none'>
                  <Path
                    stroke={isDarkMode ? '#303030' : '#fff'}
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M12 21.5a8 8 0 0 0 8-8c0-2.96-1.609-6.893-4-9.165l-2 2.664-3.5-4.5C7 5 4 9.595 4 13.501a8 8 0 0 0 8 8Z'
                  />
                  <Path
                    stroke={isDarkMode ? '#303030' : '#fff'}
                    strokeLinejoin='round'
                    fill={isDarkMode ? '#303030' : '#fff'}
                    strokeWidth={1.5}
                    d='M12 18.5c2.21 0 4-2.016 4-4.5 0-.792-.181-1.535-.5-2.181l-2 1.68-3-4c-1 1-2.5 2.612-2.5 4.5 0 2.485 1.79 4.5 4 4.5Z'
                  />
                </Svg>
              )}
            >
              1
            </CustomButton>
            <Pressable
              className=''
              onPress={() => {
                router.push('/(tabs)/home/notifications');
              }}
            >
              <NotificationIcon />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
