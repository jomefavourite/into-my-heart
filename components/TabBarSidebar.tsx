import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Platform,
} from 'react-native';
import { Link, usePathname, Slot, Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeIcon from '~/components/icons/tabs/HomeIcon';
import PracticeIcon from '~/components/icons/tabs/PracticeIcon';
import ProfileIcon from '~/components/icons/tabs/ProfileIcon';
import VersesIcon from '~/components/icons/tabs/VersesIcon';
import GoalsIcon from '~/components/icons/tabs/GoalsIcon';
import ThemedText from './ThemedText';
import HomeHeader from './Home/Header';
import Logo from './icons/logo/Logo';
import { Stack } from 'expo-router';

type Tab = {
  name: string;
  href: Href;
  icon: React.ComponentType<{ focused: boolean; inverse: boolean }>;
}[];

const tabs: Tab = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Verses', href: '/verses', icon: VersesIcon },
  { name: 'Practice', href: '/practice', icon: PracticeIcon },
  { name: 'Goals', href: '/goals', icon: GoalsIcon },
  { name: 'Profile', href: '/profile', icon: ProfileIcon },
];

export default function TabBarSidebar() {
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === 'dark';

  return (
    <View className='flex-1 flex-row max-w-7xl justify-center'>
      {/* Sidebar */}
      <View
        className='w-[240px] h-full flex-col border-r border-[#E8E8E8]'
        style={[{ paddingTop: insets.top || 24 }]}
      >
        <Logo />

        {/* Navigation links */}
        <ScrollView className='flex-1 px-4'>
          {tabs.map((tab, index) => {
            const isActive =
              pathname === tab.href ||
              (pathname.startsWith(`${tab.href}`) && tab.href !== '/');
            const Icon = tab.icon;

            return (
              <Link href={tab.href} asChild key={tab.name}>
                <TouchableOpacity>
                  <View
                    style={[styles.navItem, isActive && styles.activeNavItem]}
                  >
                    <Icon focused={isActive} inverse />
                    <ThemedText
                      style={[styles.navText, isActive && { color: '#fff' }]}
                    >
                      {tab.name}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              </Link>
            );
          })}
        </ScrollView>
      </View>

      {/* Content area */}
      <View className='flex-1' style={{ width: 'auto' }}>
        {Platform.OS === 'web' && <HomeHeader />}
        {/* <Slot /> */}
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  activeNavItem: {
    borderRadius: 8,
    backgroundColor: '#313131',
    color: '#fff',
  },
  navText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 16,
  },

  versionContainer: {
    padding: 16,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
  },
});
