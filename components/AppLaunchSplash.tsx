import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import IntoMyHeartWordmark from '@/assets/images/Into_my_heart.svg';

const BRAND_COLOR = '#292929';
const LIGHT_BACKGROUND = '#FFFFFF';

type AppLaunchSplashProps = {
  onFinish: () => void;
};

function SplashHeartIcon() {
  return (
    <Svg width={100} height={100} viewBox='0 0 24 24' fill='none'>
      <Path
        fill={BRAND_COLOR}
        d='M12 21.35 10.55 20.03C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A5.955 5.955 0 0 1 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z'
      />
    </Svg>
  );
}

export default function AppLaunchSplash({
  onFinish,
}: AppLaunchSplashProps) {
  const overlayOpacity = React.useRef(new Animated.Value(1)).current;
  const darkScreenOpacity = React.useRef(new Animated.Value(1)).current;
  const heartScreenOpacity = React.useRef(new Animated.Value(0)).current;
  const titleOpacity = React.useRef(new Animated.Value(0)).current;
  const [statusBarStyle, setStatusBarStyle] = React.useState<'light' | 'dark'>(
    'light'
  );

  React.useEffect(() => {
    if (Platform.OS === 'web') {
      onFinish();
      return;
    }

    const statusBarTimer = setTimeout(() => {
      setStatusBarStyle('dark');
    }, 700);

    const animation = Animated.sequence([
      Animated.delay(650),
      Animated.parallel([
        Animated.timing(darkScreenOpacity, {
          toValue: 0,
          duration: 160,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(heartScreenOpacity, {
          toValue: 1,
          duration: 160,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(550),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 140,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.delay(700),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 120,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    animation.start(({ finished }) => {
      if (finished) {
        onFinish();
      }
    });

    return () => {
      clearTimeout(statusBarTimer);
      animation.stop();
    };
  }, [
    darkScreenOpacity,
    heartScreenOpacity,
    onFinish,
    overlayOpacity,
    titleOpacity,
  ]);

  return (
    <Animated.View style={[styles.root, { opacity: overlayOpacity }]}>
      <StatusBar style={statusBarStyle} />

      <Animated.View
        pointerEvents='none'
        style={[styles.darkScreen, { opacity: darkScreenOpacity }]}
      />

      <Animated.View
        pointerEvents='none'
        style={[styles.lightScreen, { opacity: heartScreenOpacity }]}
      >
        <View style={styles.brandLockup}>
          <SplashHeartIcon />
          <Animated.View style={[styles.wordmarkWrap, { opacity: titleOpacity }]}>
            <IntoMyHeartWordmark width={110} height={28} />
          </Animated.View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  darkScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BRAND_COLOR,
  },
  lightScreen: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LIGHT_BACKGROUND,
  },
  brandLockup: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmarkWrap: {
    marginTop: 10,
  },
});
