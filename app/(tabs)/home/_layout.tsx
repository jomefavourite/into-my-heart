import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import ThemedText from '~/components/ThemedText';
import NotificationIcon from '~/assets/icons/light=notification-03.svg';

function HeaderLeft() {
  const { user } = useUser();

  return (
    <View className='flex-row gap-2 items-center'>
      <Avatar alt="Zach Nugent's Avatar">
        <AvatarImage source={{ uri: user?.imageUrl }} />
        <AvatarFallback>
          <ThemedText>ZN</ThemedText>
        </AvatarFallback>
      </Avatar>
      <View>
        <ThemedText>Welcome</ThemedText>
        <ThemedText>
          {user?.firstName} {user?.lastName}
        </ThemedText>
      </View>
    </View>
  );
}

function HeaderRight() {
  const router = useRouter();

  return (
    <>
      {/* <TouchableOpacity
      > */}
      <Pressable
        style={{ backgroundColor: 'red' }}
        onPress={() => router.push('/(tabs)/index/notifications')}
      >
        <NotificationIcon />
      </Pressable>
      {/* </TouchableOpacity> */}
    </>
  );
}

const HomeLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: 'Home',
          headerTitle: '',
          // headerShadowVisible: false,
          headerShown: false,
          // headerStyle: {
          //   backgroundColor: '#f5f5f5',
          // },
          // headerLeft: () => <HeaderLeft />,
          // headerRight: () => <HeaderRight />,
        }}
      />
      <Stack.Screen
        name='notifications'
        options={{
          title: 'Notifications',
          // presentation: 'card',
        }}
      />
    </Stack>
  );
};

export default HomeLayout;
