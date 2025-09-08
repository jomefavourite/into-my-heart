import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AdminPanel } from '../../components/AdminPanel';
import { useAuthState } from '../../hooks/useAuthState';
import { AdminSuggestions } from '~/components/AdminSuggestions';

export default function AdminPage() {
  const { userRole, isAdmin, isLoading } = useAuthState();

  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center bg-gray-50'>
        <Text className='text-lg text-gray-600'>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className='flex-1 bg-gray-50'>
      <View className='p-4'>
        <View className='bg-white rounded-lg p-4 mb-4 shadow-sm'>
          <Text className='text-lg font-semibold text-gray-900 mb-2'>
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
