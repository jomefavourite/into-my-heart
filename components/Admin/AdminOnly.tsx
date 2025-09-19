import React from 'react';
import { View, Text } from 'react-native';
import { useIsAdmin } from '@/lib/admin-utils';
import Loader from '../Loader';

interface AdminOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component wrapper for admin-only content
 * Usage: <AdminOnly><AdminContent /></AdminOnly>
 */
export function AdminOnly({ children, fallback = null }: AdminOnlyProps) {
  const isAdmin = useIsAdmin();

  if (!isAdmin) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Higher-order component for admin-only pages
 * Usage: export default withAdminAccess(MyAdminPage)
 */
export function withAdminAccess<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AdminProtectedComponent(props: P) {
    const isAdmin = useIsAdmin();

    if (isAdmin === false) {
      return (
        <View className='flex-1 items-center justify-center bg-gray-50'>
          <View className='mx-4 max-w-sm rounded-lg bg-white p-6 shadow-md'>
            <Text className='mb-2 text-center text-2xl font-bold text-red-600'>
              Access Denied
            </Text>
            <Text className='text-center text-gray-600'>
              You need admin privileges to access this page.
            </Text>
          </View>
        </View>
      );
    }

    if (isAdmin === undefined) {
      return (
        <View className='flex-1 items-center justify-center bg-gray-50'>
          <View className='mx-4 max-w-sm rounded-lg bg-white p-6 shadow-md'>
            <Loader />
          </View>
        </View>
      );
    }

    return <Component {...props} />;
  };
}
