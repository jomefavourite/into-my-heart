import React from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { AdminPanel } from '../../components/Admin/AdminPanel';
import { useAuthState } from '../../hooks/useAuthState';
import { AdminSuggestions } from '@/components/Admin/AdminSuggestions';
import Loader from '@/components/Loader';

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
      {Platform.OS === 'web' && (
        <>
          <title>Admin Panel - Into My Heart</title>
          <meta
            name='description'
            content='Admin panel for managing users, suggestions, and system settings.'
          />
          <meta
            name='keywords'
            content='Bible, memorization, verses, flashcards, practice, Christian, faith, scripture'
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
