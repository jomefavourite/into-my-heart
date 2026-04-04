import { ConfigContext, ExpoConfig } from 'expo/config';
import { version } from './package.json';

// Replace these with your EAS project ID and project slug.
// You can find them at https://expo.dev/accounts/[account]/projects/[project].
const EAS_PROJECT_ID = '679de2a0-3e97-498c-b7ae-322f00b43f36';
const PROJECT_SLUG = 'into-my-heart';
const OWNER = 'into-my-heart';

// App production config
const APP_NAME = 'Into My Heart';
const APP_DESCRIPTION =
  'Memorize Bible verses with offline-friendly practice, notes, affirmations, and guided Scripture review.';
const BUNDLE_IDENTIFIER = 'com.favouritejome.intomyheart';
const PACKAGE_NAME = 'com.favouritejome.intomyheart';
const ICON = './assets/images/icon.png';
const ADAPTIVE_ICON = './assets/images/adaptive-icon.png';
const SCHEME = 'intomyheart';
const PHOTO_LIBRARY_PERMISSION =
  'Into My Heart uses your photo library so you can choose a profile picture.';
const PUBLIC_SITE_URL = (
  process.env.EXPO_PUBLIC_SITE_URL ?? process.env.EXPO_PUBLIC_CONVEX_SITE_URL
)?.replace(/\/+$/, '');
const LEGAL_PATHS = {
  privacy: '/privacy',
  terms: '/terms',
  accountDeletion: '/account-deletion',
};

const buildPublicUrl = (path: string) =>
  PUBLIC_SITE_URL ? `${PUBLIC_SITE_URL}${path}` : path;

export default ({ config }: ConfigContext): ExpoConfig => {
  const { name, bundleIdentifier, icon, adaptiveIcon, packageName, scheme } =
    getDynamicAppConfig(
      (process.env.APP_ENV as 'development' | 'preview' | 'production') ||
        'development'
    );

  return {
    ...config,
    name: name,
    version, // Automatically bump your project version with `npm version patch`, `npm version minor` or `npm version major`.
    description: APP_DESCRIPTION,
    slug: PROJECT_SLUG, // Must be consistent across all environments.
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    icon: icon,
    scheme: scheme,
    ios: {
      supportsTablet: false,
      bundleIdentifier: bundleIdentifier,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSPhotoLibraryUsageDescription: PHOTO_LIBRARY_PERMISSION,
      },
    },
    android: {
      blockedPermissions: ['android.permission.RECORD_AUDIO'],
      adaptiveIcon: {
        foregroundImage: adaptiveIcon,
        backgroundColor: '#ffffff',
      },
      package: packageName,
    },
    updates: {
      url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    extra: {
      router: {
        origin: false,
      },
      publicSiteUrl: PUBLIC_SITE_URL,
      legalPaths: LEGAL_PATHS,
      legalUrls: {
        privacy: buildPublicUrl(LEGAL_PATHS.privacy),
        terms: buildPublicUrl(LEGAL_PATHS.terms),
        accountDeletion: buildPublicUrl(LEGAL_PATHS.accountDeletion),
      },
      eas: {
        projectId: EAS_PROJECT_ID,
      },
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      '@sentry/react-native',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 1,
          resizeMode: 'contain',
          backgroundColor: '#292929',
        },
      ],
      [
        'expo-font',
        {
          fonts: ['node_modules/@expo-google-fonts/inter/Inter_900Black.ttf'],
        },
      ],
      [
        'expo-notifications',
        {
          defaultChannel: 'daily-reminders',
        },
      ],
      'expo-image',
      [
        'expo-image-picker',
        {
          photosPermission: PHOTO_LIBRARY_PERMISSION,
        },
      ],
      [
        'expo-sharing',
        {
          ios: {
            enabled: true,
            activationRule: {
              supportsText: true,
              supportsWebUrlWithMaxCount: 1,
              supportsWebPageWithMaxCount: 1,
            },
          },
          android: {
            enabled: true,
            singleShareMimeTypes: ['text/*'],
          },
        },
      ],
      'expo-secure-store',
      'expo-web-browser',
    ],
    experiments: {
      typedRoutes: true,
    },
    owner: OWNER,
  };
};

// Dynamically configure the app based on the environment.
// Update these placeholders with your actual values.
export const getDynamicAppConfig = (
  environment: 'development' | 'preview' | 'production'
) => {
  if (environment === 'production') {
    return {
      name: APP_NAME,
      bundleIdentifier: BUNDLE_IDENTIFIER,
      packageName: PACKAGE_NAME,
      icon: ICON,
      adaptiveIcon: ADAPTIVE_ICON,
      scheme: SCHEME,
    };
  }

  if (environment === 'preview') {
    return {
      name: `${APP_NAME} Preview`,
      bundleIdentifier: `${BUNDLE_IDENTIFIER}.preview`,
      packageName: `${PACKAGE_NAME}.preview`,
      icon: './assets/images/icons/iOS-Prev.png',
      adaptiveIcon: './assets/images/icons/Android-Prev.png',
      scheme: `${SCHEME}-prev`,
    };
  }

  return {
    name: `${APP_NAME} Development`,
    bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
    packageName: `${PACKAGE_NAME}.dev`,
    icon: './assets/images/icon.png',
    adaptiveIcon: './assets/images/icons/Android-Dev.png',
    scheme: `${SCHEME}-dev`,
  };
};
