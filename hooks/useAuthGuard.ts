import { useAuth, useUser } from '@clerk/clerk-expo';
import { useConvexAuth } from 'convex/react';
import { useEffect, useState } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  canMakeQueries: boolean;
}

/**
 * Comprehensive authentication hook that ensures both Clerk and Convex are ready
 * before allowing any database queries
 */
export function useAuthGuard(): AuthState {
  const { isSignedIn, isLoaded: clerkLoaded } = useAuth();
  const { user } = useUser();
  const { isAuthenticated: convexAuthenticated, isLoading: convexLoading } =
    useConvexAuth();
  const [isReady, setIsReady] = useState(false);

  // Wait for both Clerk and Convex to be fully loaded
  useEffect(() => {
    if (clerkLoaded && !convexLoading) {
      // Add a small delay to ensure everything is properly initialized
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [clerkLoaded, convexLoading]);

  const isFullyAuthenticated = Boolean(
    isSignedIn && clerkLoaded && user && convexAuthenticated
  );
  const isLoading = Boolean(!isReady || !clerkLoaded || convexLoading);
  const canMakeQueries = Boolean(isFullyAuthenticated && isReady && !isLoading);

  return {
    isAuthenticated: isFullyAuthenticated,
    isLoading,
    user,
    canMakeQueries,
  };
}

/**
 * Hook specifically for Convex queries that ensures authentication is ready
 */
export function useAuthenticatedQuery<T>(
  queryFn: () => T,
  dependencies: any[] = []
) {
  const { canMakeQueries } = useAuthGuard();

  // Only execute query when authentication is fully ready
  if (!canMakeQueries) {
    return undefined;
  }

  return queryFn();
}
