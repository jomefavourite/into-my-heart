import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';
import { AdminOnly } from './AdminOnly';
import { useAuth } from '@clerk/clerk-expo';

interface User {
  _id: Id<'users'>;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: 'admin' | 'user';
  clerkId: string;
}

export function AdminPanel() {
  const { isSignedIn, isLoaded } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<Id<'users'> | null>(
    null
  );
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');

  const users =
    useQuery(api.users.getAllUsers, isSignedIn && isLoaded ? {} : 'skip') ?? [];
  const promoteToAdmin = useMutation(api.users.promoteToAdmin);
  const demoteFromAdmin = useMutation(api.users.demoteFromAdmin);
  const setUserRole = useMutation(api.users.setUserRole);

  const handlePromoteToAdmin = async (userId: Id<'users'>) => {
    try {
      await promoteToAdmin({ userId });
      Alert.alert('Success', 'User promoted to admin successfully!');
    } catch (error) {
      Alert.alert('Error', `Error: ${error}`);
    }
  };

  const handleDemoteFromAdmin = async (userId: Id<'users'>) => {
    try {
      await demoteFromAdmin({ userId });
      Alert.alert('Success', 'User demoted from admin successfully!');
    } catch (error) {
      Alert.alert('Error', `Error: ${error}`);
    }
  };

  const handleSetRole = async () => {
    if (!selectedUserId) return;

    try {
      await setUserRole({ userId: selectedUserId, role: newRole });
      Alert.alert('Success', `User role updated to ${newRole} successfully!`);
      setSelectedUserId(null);
    } catch (error) {
      Alert.alert('Error', `Error: ${error}`);
    }
  };

  return (
    <AdminOnly
      fallback={<Text>Access denied. Admin privileges required.</Text>}
    >
      <ScrollView className='flex-1 bg-gray-50'>
        <View className='p-6'>
          <Text className='mb-6 text-3xl font-bold text-gray-900'>
            Admin Panel
          </Text>

          <View className='mb-4 overflow-hidden rounded-lg bg-white shadow-md'>
            <View className='border-b border-gray-200 px-6 py-4'>
              <Text className='text-xl font-semibold text-gray-900'>
                User Management
              </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className='min-w-full'>
                {users.map((user: User) => (
                  <View key={user._id} className='border-b border-gray-200 p-4'>
                    <View className='flex-row items-center justify-between'>
                      <View className='flex-1 flex-row items-center'>
                        <View className='mr-4 h-10 w-10 items-center justify-center rounded-full bg-gray-300'>
                          <Text className='text-sm font-medium text-gray-700'>
                            {user.first_name?.[0] ||
                              user.email[0].toUpperCase()}
                          </Text>
                        </View>
                        <View className='flex-1'>
                          <Text className='text-sm font-medium text-gray-900'>
                            {user.first_name && user.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : user.email}
                          </Text>
                          <Text className='text-sm text-gray-500'>
                            {user.email}
                          </Text>
                        </View>
                      </View>

                      <View className='flex-row items-center space-x-2'>
                        <View
                          className={`rounded-full px-2 py-1 ${
                            user.role === 'admin'
                              ? 'bg-red-100'
                              : 'bg-green-100'
                          }`}
                        >
                          <Text
                            className={`text-xs font-semibold ${
                              user.role === 'admin'
                                ? 'text-red-800'
                                : 'text-green-800'
                            }`}
                          >
                            {user.role || 'user'}
                          </Text>
                        </View>

                        {user.role === 'admin' ? (
                          <TouchableOpacity
                            onPress={() => handleDemoteFromAdmin(user._id)}
                            className='rounded-md bg-yellow-100 px-3 py-1'
                          >
                            <Text className='text-sm font-medium text-yellow-600'>
                              Demote
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => handlePromoteToAdmin(user._id)}
                            className='rounded-md bg-blue-100 px-3 py-1'
                          >
                            <Text className='text-sm font-medium text-blue-600'>
                              Promote
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </AdminOnly>
  );
}
