import { useConvexAuth } from 'convex/react';
import { useAuth } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

/**
 * Custom hook to manage authentication state across Clerk and Convex
 * Provides a unified interface for checking auth status and user data
 */
export function useAuthState() {
  const { isAuthenticated, isLoading: convexLoading } = useConvexAuth();
  const { isSignedIn, isLoaded: clerkLoaded } = useAuth();
  const userRole = useQuery(api.users.getCurrentUserRole);
  const isAdmin = useQuery(api.users.isCurrentUserAdmin);

  // Determine overall loading state
  const isLoading = convexLoading || !clerkLoaded;

  // Determine if user is authenticated (both Clerk and Convex)
  const isFullyAuthenticated = isAuthenticated && isSignedIn;

  // Determine if user is admin
  const hasAdminAccess = isAdmin ?? false;

  return {
    // Auth states
    isAuthenticated: isFullyAuthenticated,
    isLoading,
    isSignedIn,

    // User data
    userRole: userRole ?? 'user',
    isAdmin: hasAdminAccess,

    // Convenience flags
    isUser: userRole === 'user',
    isAdminUser: hasAdminAccess,

    // Loading states
    isConvexLoading: convexLoading,
    isClerkLoading: !clerkLoaded,
  };
}

/**
 * Hook specifically for admin-only features
 * Returns loading state and admin status
 */
export function useAdminAuth() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const isAdmin = useQuery(api.users.isCurrentUserAdmin);

  return {
    isAuthenticated,
    isLoading,
    isAdmin: isAdmin ?? false,
    canAccessAdmin: isAuthenticated && (isAdmin ?? false),
  };
}
