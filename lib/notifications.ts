import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const DAILY_REMINDER_STORAGE_KEY = 'daily-scripture-reminder';
const DAILY_REMINDER_NOTIFICATION_ID_KEY = 'daily-scripture-reminder-id';
const DAILY_REMINDER_CHANNEL_ID = 'daily-reminders';

type ReminderPermissionStatus =
  | 'granted'
  | 'denied'
  | 'undetermined'
  | 'unsupported';

export type DailyReminderSettings = {
  enabled: boolean;
  hour: number;
  minute: number;
};

type ReminderMutationResult = {
  granted: boolean;
  settings: DailyReminderSettings;
};

export const DEFAULT_DAILY_REMINDER_SETTINGS: DailyReminderSettings = {
  enabled: false,
  hour: 20,
  minute: 0,
};

export const DAILY_REMINDER_TIME_OPTIONS = [
  { hour: 7, minute: 0 },
  { hour: 12, minute: 0 },
  { hour: 20, minute: 0 },
];

let notificationsConfigured = false;

export async function configureNotificationsAsync() {
  if (Platform.OS === 'web' || notificationsConfigured) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(DAILY_REMINDER_CHANNEL_ID, {
      name: 'Daily reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });
  }

  notificationsConfigured = true;
}

export async function getDailyReminderSettingsAsync() {
  const storedValue = await AsyncStorage.getItem(DAILY_REMINDER_STORAGE_KEY);
  if (!storedValue) {
    return DEFAULT_DAILY_REMINDER_SETTINGS;
  }

  try {
    const parsedValue = JSON.parse(
      storedValue
    ) as Partial<DailyReminderSettings>;
    return {
      enabled: parsedValue.enabled ?? DEFAULT_DAILY_REMINDER_SETTINGS.enabled,
      hour: parsedValue.hour ?? DEFAULT_DAILY_REMINDER_SETTINGS.hour,
      minute: parsedValue.minute ?? DEFAULT_DAILY_REMINDER_SETTINGS.minute,
    };
  } catch (error) {
    console.warn('Failed to parse daily reminder settings', error);
    return DEFAULT_DAILY_REMINDER_SETTINGS;
  }
}

export async function getReminderPermissionStatusAsync(): Promise<ReminderPermissionStatus> {
  if (Platform.OS === 'web') {
    return 'unsupported';
  }

  const permissions = await Notifications.getPermissionsAsync();

  if (permissions.granted) {
    return 'granted';
  }

  return permissions.canAskAgain ? 'undetermined' : 'denied';
}

export function formatReminderTime(hour: number, minute: number) {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(2024, 0, 1, hour, minute));
}

export async function enableDailyReminderAsync(
  partialSettings?: Partial<Pick<DailyReminderSettings, 'hour' | 'minute'>>
): Promise<ReminderMutationResult> {
  const currentSettings = await getDailyReminderSettingsAsync();
  const nextSettings: DailyReminderSettings = {
    enabled: true,
    hour: partialSettings?.hour ?? currentSettings.hour,
    minute: partialSettings?.minute ?? currentSettings.minute,
  };

  const hasPermission = await ensureReminderPermissionAsync();
  if (!hasPermission) {
    return { granted: false, settings: currentSettings };
  }

  await replaceScheduledReminderAsync(nextSettings);
  await saveDailyReminderSettingsAsync(nextSettings);

  return { granted: true, settings: nextSettings };
}

export async function disableDailyReminderAsync() {
  const currentSettings = await getDailyReminderSettingsAsync();
  const nextSettings = {
    ...currentSettings,
    enabled: false,
  };

  await cancelStoredReminderAsync();
  await saveDailyReminderSettingsAsync(nextSettings);

  return nextSettings;
}

export async function updateDailyReminderTimeAsync(
  hour: number,
  minute: number
): Promise<ReminderMutationResult> {
  const currentSettings = await getDailyReminderSettingsAsync();
  const nextSettings = {
    ...currentSettings,
    hour,
    minute,
  };

  if (!currentSettings.enabled) {
    await saveDailyReminderSettingsAsync(nextSettings);
    return { granted: true, settings: nextSettings };
  }

  const hasPermission = await ensureReminderPermissionAsync();
  if (!hasPermission) {
    return { granted: false, settings: currentSettings };
  }

  await replaceScheduledReminderAsync({ ...nextSettings, enabled: true });
  await saveDailyReminderSettingsAsync(nextSettings);

  return { granted: true, settings: nextSettings };
}

export async function rehydrateDailyReminderAsync() {
  if (Platform.OS === 'web') {
    return DEFAULT_DAILY_REMINDER_SETTINGS;
  }

  await configureNotificationsAsync();

  const currentSettings = await getDailyReminderSettingsAsync();
  if (!currentSettings.enabled) {
    await cancelStoredReminderAsync();
    return currentSettings;
  }

  const permissions = await Notifications.getPermissionsAsync();
  if (!permissions.granted) {
    return currentSettings;
  }

  await replaceScheduledReminderAsync(currentSettings);
  return currentSettings;
}

async function ensureReminderPermissionAsync() {
  if (Platform.OS === 'web') {
    return false;
  }

  await configureNotificationsAsync();

  let permissions = await Notifications.getPermissionsAsync();
  if (!permissions.granted) {
    permissions = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowSound: true,
        allowBadge: false,
      },
    });
  }

  return permissions.granted;
}

async function replaceScheduledReminderAsync(settings: DailyReminderSettings) {
  await cancelStoredReminderAsync();

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to memorize Scripture',
      body: 'Open Into My Heart and spend a few minutes reviewing today.',
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: settings.hour,
      minute: settings.minute,
      channelId: DAILY_REMINDER_CHANNEL_ID,
    },
  });

  await AsyncStorage.setItem(
    DAILY_REMINDER_NOTIFICATION_ID_KEY,
    notificationId
  );
}

async function cancelStoredReminderAsync() {
  if (Platform.OS === 'web') {
    return;
  }

  const notificationId = await AsyncStorage.getItem(
    DAILY_REMINDER_NOTIFICATION_ID_KEY
  );

  if (notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.warn('Failed to cancel scheduled reminder', error);
    }
  }

  await AsyncStorage.removeItem(DAILY_REMINDER_NOTIFICATION_ID_KEY);
}

async function saveDailyReminderSettingsAsync(settings: DailyReminderSettings) {
  await AsyncStorage.setItem(
    DAILY_REMINDER_STORAGE_KEY,
    JSON.stringify(settings)
  );
}
