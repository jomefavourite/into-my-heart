import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useAuthState } from '../hooks/useAuthState';

/**
 * Hook to check if the current user is an admin
 * @returns boolean indicating if current user is admin
 */
export function useIsAdmin() {
  const { isAdmin } = useAuthState();
  return isAdmin;
}

/**
 * Hook to get the current user's role
 * @returns 'admin' | 'user' | undefined
 */
export function useUserRole() {
  const { userRole } = useAuthState();
  return userRole;
}

/**
 * Hook to check if current user has admin privileges
 * @returns boolean indicating if user has admin access
 */
export function useHasAdminAccess() {
  const { isAdmin } = useAuthState();
  return isAdmin;
}

/**
 * Hook to check if current user can access admin features
 * @returns object with admin access information
 */
export function useAdminAccess() {
  const { isAdmin, isLoading, isAuthenticated } = useAuthState();

  return {
    canAccess: isAuthenticated && isAdmin,
    isLoading,
    isAdmin,
    isAuthenticated,
  };
}
