import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAction } from 'convex/react';
import { useClerk } from '@clerk/clerk-expo';
import { api } from '@/convex/_generated/api';
import { useOfflineDataStore } from '@/store/offlineDataStore';
import { useAlert } from '@/hooks/useAlert';

export const useDeleteAccount = () => {
  const router = useRouter();
  const { signOut } = useClerk();
  const { alert } = useAlert();
  const clearOfflineData = useOfflineDataStore(state => state.clearOfflineData);
  const deleteCurrentUserAccount = useAction(api.account.deleteCurrentUserAccount);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const confirmDeleteAccount = useMemo(
    () => () => {
      alert(
        'Delete account',
        'This permanently removes your account and all saved verses, collections, notes, affirmations, and practice history.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete account',
            style: 'destructive',
            onPress: async () => {
              setIsDeletingAccount(true);

              try {
                await deleteCurrentUserAccount({});
                clearOfflineData();
                await signOut().catch(() => null);
                router.replace('/(onboarding)/onboard');
              } catch (error) {
                console.error('Failed to delete account', error);
                alert(
                  'Delete failed',
                  'We could not delete your account right now. Please try again.'
                );
              } finally {
                setIsDeletingAccount(false);
              }
            },
          },
        ]
      );
    },
    [alert, clearOfflineData, deleteCurrentUserAccount, router, signOut]
  );

  return {
    confirmDeleteAccount,
    isDeletingAccount,
  };
};
