import { Pressable, View } from 'react-native';
import React from 'react';
import { Link, router } from 'expo-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@clerk/clerk-expo';
import ThemedText from '../ThemedText';
import NotificationIcon from '../icons/NotificationIcon';

export default function HomeHeader({
  isWelcome = false,
}: {
  isWelcome?: boolean;
}) {
  const { user } = useUser();

  if (!isWelcome) {
    return null;
  }

  return (
    <View className='flex-row items-center justify-between p-4 web:p-0'>
      <View className='flex-row items-center gap-2'>
        <Avatar alt={user?.firstName || ''}>
          <AvatarImage source={{ uri: user?.imageUrl }} />
          <AvatarFallback>
            <ThemedText>{user?.firstName?.charAt(0)}</ThemedText>
          </AvatarFallback>
        </Avatar>
        <View>
          <ThemedText className='text-xs text-[#707070]'>Welcome</ThemedText>
          <ThemedText className='font-medium'>{user?.firstName}</ThemedText>
        </View>
      </View>

      <Pressable
        className=''
        onPress={() => {
          router.push('/notifications');
        }}
      >
        <NotificationIcon />
      </Pressable>
    </View>
  );
}
