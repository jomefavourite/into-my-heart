import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AdminPanel } from '../../components/Admin/AdminPanel';
import { useAuthState } from '../../hooks/useAuthState';
import { AdminSuggestions } from '@/components/Admin/AdminSuggestions';
import Loader from '@/components/Loader';

export const metadata = {
  title: 'Admin Panel - Into My Heart',
  description:
    'Admin panel for managing users, suggestions, and system settings.',
  openGraph: {
    title: 'Admin Panel - Into My Heart',
    description:
      'Admin panel for managing users, suggestions, and system settings.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Admin Panel - Into My Heart',
    description:
      'Admin panel for managing users, suggestions, and system settings.',
  },
};

export default function AdminPage() {
  const { userRole, isAdmin, isLoading } = useAuthState();

  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center bg-gray-50'>
        <Loader />
      </View>
    );
  }

  return (
    <ScrollView className='flex-1 bg-gray-50'>
      <View className='p-4'>
        <View className='mb-4 rounded-lg bg-white p-4 shadow-sm'>
          <Text className='mb-2 text-lg font-semibold text-gray-900'>
            Admin Dashboard
          </Text>
          <Text className='text-sm text-gray-600'>
            Welcome to the admin panel. Your role:{' '}
            <Text className='font-medium text-blue-600'>{userRole}</Text>
          </Text>
        </View>

        {/* <AdminPanel /> */}
        <AdminSuggestions />
      </View>
    </ScrollView>
  );
}
