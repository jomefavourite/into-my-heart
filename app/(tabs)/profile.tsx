import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cn, useBottomSheetStore } from '@/lib/utils';
import { useColorScheme } from '@/hooks/useColorScheme';
import ThemedText from '@/components/ThemedText';
import CustomButton from '@/components/CustomButton';
import { useAuth, useClerk, useUser } from '@clerk/clerk-react';
import { ScrollView } from 'react-native-gesture-handler';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Href, Link } from 'expo-router';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import Svg, { Path } from 'react-native-svg';
import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import PageHeader from '@/components/PageHeader';

interface ProfileLinkItem {
  title: string;
  link?: Href;
  isCheckbox?: boolean;
}

interface ProfileLinks {
  [key: string]: ProfileLinkItem[]; // Each key (section name) maps to an array of ProfileLinkItem
}

const ProfileLinks: ProfileLinks = {
  account: [
    {
      title: 'Profile',
      link: '/profile/edit-profile',
    },
    {
      title: 'Notifications',
      link: '/',
    },
  ],
  activity: [
    {
      title: 'Bible version',
      link: '/',
    },
    {
      title: 'Badges',
      link: '/',
    },
    {
      title: 'Reminders',
      isCheckbox: true,
    },
  ],
  visuals: [
    {
      title: 'Font',
      link: '/',
    },
    {
      title: 'Dark mode',
      isCheckbox: true,
    },
  ],
  support: [
    {
      title: 'Help center',
      link: '/',
    },
    {
      title: 'Feedback',
      link: '/',
    },
  ],
};

const LinkItem = ({ title, link }: { title: string; link: Href }) => (
  <Link href={link}>
    <View className='flex w-full flex-row items-center justify-between px-2 py-3'>
      <ThemedText>{title}</ThemedText>
      <ArrowRightIcon />
    </View>
  </Link>
);

const CheckboxItem = ({ title }: { title: string }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const { isDarkMode, setColorScheme } = useColorScheme();

  const toggleSwitch = () => {
    if (title === 'Dark mode') {
      const newTheme = isDarkMode ? 'light' : 'dark';
      setColorScheme(newTheme);
      // AsyncStorage.setItem('theme', newTheme);
    }
    setIsEnabled(previousState => !previousState);
  };

  return (
    <View className='flex w-full flex-row items-center justify-between px-2 py-3'>
      <ThemedText>{title}</ThemedText>
      <Switch onCheckedChange={toggleSwitch} checked={isEnabled} />
    </View>
  );
};

export const metadata = {
  title: 'Profile - Into My Heart',
  description:
    'Manage your profile settings, preferences, and account information for your Bible memorization journey.',
  openGraph: {
    title: 'Profile - Into My Heart',
    description:
      'Manage your profile settings, preferences, and account information for your Bible memorization journey.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Profile - Into My Heart',
    description:
      'Manage your profile settings, preferences, and account information for your Bible memorization journey.',
  },
};

export default function ProfileScreen() {
  const { isDarkMode, setColorScheme } = useColorScheme();
  const { signOut } = useClerk();
  const { user } = useUser();

  // const data = useQuery(api.users.getUsers);
  // console.log(data);

  const setStreakBottomSheetIndex = useBottomSheetStore(
    state => state.setStreakBottomSheetIndex
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className='flex-1'>
      <PageHeader title='Profile' />

      <ScrollView className=''>
        <View className='p-[18px]'>
          <View className='web:lg:flex-row web:lg:items-center web:lg:justify-between'>
            <View className='lg:items-center web:lg:flex-row'>
              <View className='mx-auto my-6 lg:mx-0'>
                <Avatar alt={user?.firstName || ''} className='h-24 w-24'>
                  <AvatarImage source={{ uri: user?.imageUrl }} />
                  <AvatarFallback>
                    <ThemedText>{user?.firstName?.charAt(0)}</ThemedText>
                  </AvatarFallback>
                </Avatar>

                <View>
                  <CustomButton
                    className={cn(
                      'absolute -bottom-5 -right-5 w-fit gap-1 self-end !px-4 !py-2'
                    )}
                    onPress={() => {
                      setStreakBottomSheetIndex(1);
                    }}
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
                </View>
              </View>

              <ThemedText className='text-center text-lg font-medium'>
                {user?.firstName} {user?.lastName}
              </ThemedText>
            </View>

            <View className='my-6 flex-row items-center justify-between'>
              <View className='flex-row items-center gap-2'>
                <ThemedText className='text-[27px] font-semibold text-[#707070]'>
                  0
                </ThemedText>
                <ThemedText className='max-w-[65px] text-xs'>
                  verses memorized
                </ThemedText>
              </View>
              <View className='flex-row items-center gap-2'>
                <ThemedText className='text-[27px] font-semibold text-[#707070]'>
                  0
                </ThemedText>
                <ThemedText className='max-w-[65px] text-xs'>
                  collections memorized
                </ThemedText>
              </View>
              <View className='flex-row items-center gap-2'>
                <ThemedText className='text-[27px] font-semibold text-[#707070]'>
                  0
                </ThemedText>
                <ThemedText className='max-w-[65px] text-xs'>
                  goals completed
                </ThemedText>
              </View>
            </View>
          </View>

          <View className='gap-6'>
            {Object.entries(ProfileLinks).map(([sectionTitle, items]) => (
              <View key={sectionTitle}>
                <ThemedText
                  size={12}
                  className='uppercase text-[#707070] dark:text-[#909090]'
                >
                  {sectionTitle}
                </ThemedText>

                {items.map((item, index) =>
                  item.isCheckbox ? (
                    <CheckboxItem key={index} title={item.title} />
                  ) : (
                    <LinkItem key={index} title={item.title} link={item.link} />
                  )
                )}
              </View>
            ))}
          </View>

          <CustomButton
            onPress={() => {
              const newTheme = isDarkMode ? 'light' : 'dark';
              setColorScheme(newTheme);
              // setAndroidNavigationBar(newTheme);
              AsyncStorage.setItem('theme', newTheme);
            }}
          >
            {isDarkMode ? 'Light mode' : 'Dark mode'}
          </CustomButton>

          <CustomButton variant='outline' onPress={() => signOut()}>
            Sign out
          </CustomButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
