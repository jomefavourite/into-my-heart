import React from 'react';
import { View, Text } from 'react-native';
import { useIsAdmin } from '../lib/admin-utils';

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
          <View className='bg-white rounded-lg p-6 shadow-md max-w-sm mx-4'>
            <Text className='text-2xl font-bold text-red-600 mb-2 text-center'>
              Access Denied
            </Text>
            <Text className='text-gray-600 text-center'>
              You need admin privileges to access this page.
            </Text>
          </View>
        </View>
      );
    }

    if (isAdmin === undefined) {
      return (
        <View className='flex-1 items-center justify-center bg-gray-50'>
          <View className='bg-white rounded-lg p-6 shadow-md max-w-sm mx-4'>
            <Text className='text-gray-600 text-center'>Loading...</Text>
          </View>
        </View>
      );
    }

    return <Component {...props} />;
  };
}
