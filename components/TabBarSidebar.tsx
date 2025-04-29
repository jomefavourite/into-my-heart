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
import { Link, usePathname, Slot } from 'expo-router';
import {
  Chrome as Home,
  BookOpen,
  BookText,
  Target,
  User,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeIcon from '~/components/icons/tabs/HomeIcon';
import PracticeIcon from '~/components/icons/tabs/PracticeIcon';
import ProfileIcon from '~/components/icons/tabs/ProfileIcon';
import VersesIcon from '~/components/icons/tabs/VersesIcon';
import GoalsIcon from '~/components/icons/tabs/GoalsIcon';
import ThemedText from './ThemedText';
import HomeHeader from './Home/Header';

const tabs = [
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
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={[styles.sidebar, { paddingTop: insets.top || 24 }]}>
        {/* App logo/title */}
        <View style={styles.logoContainer}>
          <ThemedText style={styles.logoText}>Into My Heart</ThemedText>
        </View>

        {/* Navigation links */}
        <ScrollView style={styles.navContainer}>
          {tabs.map((tab, index) => {
            const isActive =
              pathname === tab.href ||
              (pathname.startsWith(tab.href) && tab.href !== '/');
            const Icon = tab.icon;

            return (
              <Link href={tab.href} asChild key={tab.name}>
                <TouchableOpacity>
                  <View
                    style={[styles.navItem, isActive && styles.activeNavItem]}
                  >
                    <Icon focused={isActive} />
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
      <View className='w-[1040px] flex-1'>
        {Platform.OS === 'web' && <HomeHeader />}
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 240,
    height: '100%',
    flexDirection: 'column',
    borderRightWidth: 1,
    borderColor: '#E8E8E8',
  },
  logoContainer: {
    padding: 24,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoSubText: {
    fontSize: 14,
    marginTop: 4,
  },
  navContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
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
