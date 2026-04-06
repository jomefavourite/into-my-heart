import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { Href, Link } from 'expo-router';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { useToast } from 'react-native-toast-notifications';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import PageHeader from '@/components/PageHeader';
import ThemedText from '@/components/ThemedText';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import CustomButton from '@/components/CustomButton';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useOfflineDataStore } from '@/store/offlineDataStore';
import { useOfflineLaunchStats } from '@/hooks/useOfflineData';
import { useDeleteAccount } from '@/hooks/useDeleteAccount';
import { useAlert } from '@/hooks/useAlert';
import {
  DAILY_REMINDER_TIME_OPTIONS,
  DEFAULT_DAILY_REMINDER_SETTINGS,
  disableDailyReminderAsync,
  enableDailyReminderAsync,
  formatReminderTime,
  getDailyReminderSettingsAsync,
  getReminderPermissionStatusAsync,
  updateDailyReminderTimeAsync,
  type DailyReminderSettings,
} from '@/lib/notifications';
import { cn } from '@/lib/utils';

const PRIVACY_HREF = '/privacy' as Href;
const TERMS_HREF = '/terms' as Href;
const ACCOUNT_DELETION_HREF = '/account-deletion' as Href;

const LinkItem = ({ title, href }: { title: string; href: Href }) => (
  <Link href={href}>
    <View className='flex w-full flex-row items-center justify-between px-2 py-3'>
      <ThemedText>{title}</ThemedText>
      <ArrowRightIcon />
    </View>
  </Link>
);

const DarkModeItem = () => {
  const { isDarkMode, setColorScheme } = useColorScheme();
  const [isEnabled, setIsEnabled] = useState(isDarkMode);

  useEffect(() => {
    setIsEnabled(isDarkMode);
  }, [isDarkMode]);

  const toggleSwitch = () => {
    const nextTheme = isDarkMode ? 'light' : 'dark';
    setColorScheme(nextTheme);
    void AsyncStorage.setItem('theme', nextTheme);
    setIsEnabled(nextTheme === 'dark');
  };

  return (
    <View className='flex w-full flex-row items-center justify-between px-2 py-3'>
      <ThemedText>Dark mode</ThemedText>
      <Switch onCheckedChange={toggleSwitch} checked={isEnabled} />
    </View>
  );
};

const DailyReminderItem = () => {
  const toast = useToast();
  const { alert } = useAlert();
  const [settings, setSettings] = useState<DailyReminderSettings>(
    DEFAULT_DAILY_REMINDER_SETTINGS
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<
    'granted' | 'denied' | 'undetermined' | 'unsupported'
  >(Platform.OS === 'web' ? 'unsupported' : 'undetermined');

  useEffect(() => {
    let isCancelled = false;

    const loadReminderState = async () => {
      try {
        const [storedSettings, nextPermissionStatus] = await Promise.all([
          getDailyReminderSettingsAsync(),
          getReminderPermissionStatusAsync(),
        ]);

        if (isCancelled) {
          return;
        }

        setSettings(storedSettings);
        setPermissionStatus(nextPermissionStatus);
      } catch (error) {
        console.warn('Failed to load reminder settings', error);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadReminderState();

    return () => {
      isCancelled = true;
    };
  }, []);

  const openSystemSettings = () => {
    void Linking.openSettings();
  };

  const showPermissionAlert = () => {
    alert('Notifications are off', 'Enable notifications in device settings.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open settings', onPress: openSystemSettings },
    ]);
  };

  const handleToggleReminder = async (nextEnabled: boolean) => {
    if (Platform.OS === 'web' || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      if (!nextEnabled) {
        const nextSettings = await disableDailyReminderAsync();
        setSettings(nextSettings);
        setPermissionStatus(await getReminderPermissionStatusAsync());
        toast.show('Daily reminder turned off', { type: 'success' });
        return;
      }

      const result = await enableDailyReminderAsync();
      const nextPermissionStatus = await getReminderPermissionStatusAsync();
      setPermissionStatus(nextPermissionStatus);

      if (!result.granted) {
        setSettings(await getDailyReminderSettingsAsync());
        showPermissionAlert();
        return;
      }

      setSettings(result.settings);
      toast.show(
        `Daily reminder set for ${formatReminderTime(
          result.settings.hour,
          result.settings.minute
        )}`,
        { type: 'success' }
      );
    } catch (error) {
      console.error('Failed to update reminder state', error);
      toast.show('Failed to update daily reminder', { type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTimeSelection = async (hour: number, minute: number) => {
    if (Platform.OS === 'web' || isSaving || !settings.enabled) {
      return;
    }

    setIsSaving(true);

    try {
      const result = await updateDailyReminderTimeAsync(hour, minute);
      const nextPermissionStatus = await getReminderPermissionStatusAsync();
      setPermissionStatus(nextPermissionStatus);

      if (!result.granted) {
        setSettings(await getDailyReminderSettingsAsync());
        showPermissionAlert();
        return;
      }

      setSettings(result.settings);
      toast.show(`Reminder moved to ${formatReminderTime(hour, minute)}`, {
        type: 'success',
      });
    } catch (error) {
      console.error('Failed to update reminder time', error);
      toast.show('Failed to update reminder time', { type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const description =
    Platform.OS === 'web'
      ? 'Available in iOS and Android builds.'
      : settings.enabled
        ? `Scheduled for ${formatReminderTime(settings.hour, settings.minute)} every day.`
        : 'Get a daily nudge to review Scripture.';

  const permissionCopy =
    permissionStatus === 'denied'
      ? 'Notifications are blocked in system settings.'
      : null;

  return (
    <View>
      <ThemedText
        size={12}
        className='uppercase text-[#707070] dark:text-[#909090]'
      >
        Reminders
      </ThemedText>
      <View className='mt-2 gap-4 rounded-3xl bg-container p-4'>
        <View className='flex-row items-start justify-between gap-4'>
          <View className='flex-1 gap-1'>
            <ThemedText className='font-medium'>
              Daily scripture reminder
            </ThemedText>
            <ThemedText className='text-sm text-muted-foreground'>
              {description}
            </ThemedText>
            {permissionCopy ? (
              <ThemedText className='text-sm text-destructive'>
                {permissionCopy}
              </ThemedText>
            ) : null}
          </View>
          <Switch
            checked={settings.enabled}
            disabled={Platform.OS === 'web' || isLoading || isSaving}
            onCheckedChange={handleToggleReminder}
          />
        </View>

        {Platform.OS !== 'web' && settings.enabled ? (
          <View className='gap-3'>
            <ThemedText className='text-sm text-muted-foreground'>
              Choose a reminder time
            </ThemedText>
            <View className='flex-row flex-wrap gap-2'>
              {DAILY_REMINDER_TIME_OPTIONS.map(option => {
                const isSelected =
                  settings.hour === option.hour &&
                  settings.minute === option.minute;

                return (
                  <Pressable
                    key={`${option.hour}:${option.minute}`}
                    disabled={isSaving}
                    onPress={() =>
                      handleTimeSelection(option.hour, option.minute)
                    }
                    className={cn(
                      'rounded-full border px-4 py-2',
                      isSelected
                        ? 'border-foreground bg-foreground'
                        : 'border-border bg-background'
                    )}
                  >
                    <ThemedText
                      className={cn(
                        'text-sm',
                        isSelected ? 'text-background' : 'text-foreground'
                      )}
                    >
                      {formatReminderTime(option.hour, option.minute)}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        {(isLoading || isSaving) && Platform.OS !== 'web' ? (
          <View className='flex-row items-center gap-2'>
            <ActivityIndicator size='small' />
            <ThemedText className='text-sm text-muted-foreground'>
              Updating reminder settings...
            </ThemedText>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default function ProfileScreen() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const toast = useToast();
  const clearOfflineData = useOfflineDataStore(state => state.clearOfflineData);
  const { savedVerses, savedCollections, completedPracticeSessions } =
    useOfflineLaunchStats();
  const { confirmDeleteAccount, isDeletingAccount } = useDeleteAccount();

  const handleSignOut = async () => {
    try {
      await signOut();
      clearOfflineData();
    } catch (error) {
      console.error('Failed to sign out', error);
      toast.show('Failed to sign out', { type: 'error' });
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className='flex-1'>
      {Platform.OS === 'web' && (
        <>
          <title>Profile - Into My Heart</title>
          <meta
            name='description'
            content='Manage your profile and launch settings for Into My Heart.'
          />
          <meta
            name='keywords'
            content='Bible, memorization, verses, practice, profile'
          />
          <meta name='author' content='Into My Heart' />
          <meta name='robots' content='index, follow' />
          <meta property='og:type' content='website' />
          <meta property='og:site_name' content='Into My Heart' />
          <meta property='og:locale' content='en_US' />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='theme-color' content='#313131' />
          <meta name='msapplication-TileColor' content='#313131' />
        </>
      )}

      <PageHeader title='Profile' />

      <ScrollView>
        <View className='gap-6 p-[18px]'>
          <View className='items-center gap-4 rounded-3xl bg-container p-6'>
            <Avatar alt={user?.firstName || ''} className='h-24 w-24'>
              <AvatarImage source={{ uri: user?.imageUrl }} />
              <AvatarFallback>
                <ThemedText>{user?.firstName?.charAt(0)}</ThemedText>
              </AvatarFallback>
            </Avatar>

            <View className='items-center gap-1'>
              <ThemedText className='text-lg font-medium'>
                {user?.firstName} {user?.lastName}
              </ThemedText>
            </View>

            <View className='w-full flex-row items-center justify-between gap-4'>
              <View className='flex-1 items-center rounded-2xl bg-background px-3 py-4'>
                <ThemedText className='text-[24px] font-semibold text-[#707070]'>
                  {savedVerses}
                </ThemedText>
                <ThemedText className='mt-1 text-center text-xs'>
                  Saved verses
                </ThemedText>
              </View>
              <View className='flex-1 items-center rounded-2xl bg-background px-3 py-4'>
                <ThemedText className='text-[24px] font-semibold text-[#707070]'>
                  {savedCollections}
                </ThemedText>
                <ThemedText className='mt-1 text-center text-xs'>
                  Saved collections
                </ThemedText>
              </View>
              <View className='flex-1 items-center rounded-2xl bg-background px-3 py-4'>
                <ThemedText className='text-[24px] font-semibold text-[#707070]'>
                  {completedPracticeSessions}
                </ThemedText>
                <ThemedText className='mt-1 text-center text-xs'>
                  Completed sessions
                </ThemedText>
              </View>
            </View>
          </View>

          <View className='gap-6'>
            <View>
              <ThemedText
                size={12}
                className='uppercase text-[#707070] dark:text-[#909090]'
              >
                Account
              </ThemedText>
              <LinkItem title='Profile details' href='/profile/edit-profile' />
            </View>

            <View>
              <ThemedText
                size={12}
                className='uppercase text-[#707070] dark:text-[#909090]'
              >
                Appearance
              </ThemedText>
              <DarkModeItem />
            </View>

            <DailyReminderItem />

            <View>
              <ThemedText
                size={12}
                className='uppercase text-[#707070] dark:text-[#909090]'
              >
                Legal
              </ThemedText>
              <LinkItem title='Privacy policy' href={PRIVACY_HREF} />
              <LinkItem title='Terms of service' href={TERMS_HREF} />
              <LinkItem title='Account deletion' href={ACCOUNT_DELETION_HREF} />
            </View>
          </View>

          <View className='gap-3'>
            <CustomButton variant='outline' onPress={handleSignOut}>
              Sign out
            </CustomButton>

            <CustomButton
              variant='destructive'
              disabled={isDeletingAccount}
              onPress={confirmDeleteAccount}
            >
              {isDeletingAccount ? 'Deleting account...' : 'Delete account'}
            </CustomButton>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
