import { useQuery } from 'convex/react';
import { useUser } from '@clerk/clerk-expo';
import { api } from '@/convex/_generated/api';

export function useUserProfile() {
  const { user, isLoaded } = useUser();
  const userProfile = useQuery(api.users.current, isLoaded && user ? {} : 'skip');

  return {
    userProfile,
    isLoading: userProfile === undefined,
    error: userProfile === null,
  };
}
