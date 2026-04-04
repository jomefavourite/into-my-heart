import { View } from 'react-native';
import React, { useState } from 'react';
import BackHeader from '@/components/BackHeader';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ThemedText from '@/components/ThemedText';
import { useUser } from '@clerk/clerk-expo';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '@/components/CustomButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAlert } from '@/hooks/useAlert';

export const metadata = {
  title: 'Edit Profile',
  description:
    'Edit your profile information including name and profile picture',
};

export default function EditProfile() {
  const { user } = useUser();
  const updateUserProfile = useMutation(api.users.updateUserProfile);
  const { alert } = useAlert();

  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [isLoading, setIsLoading] = useState(false);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('No image selected', 'You did not select any image.');
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Update user profile with Clerk
      await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // If there's a new image, update it
      if (selectedImage) {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        await user.setProfileImage({ file: blob });
      }

      // Update Convex with the new profile data
      await updateUserProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        imageUrl: selectedImage || user.imageUrl,
      });

      alert('Profile updated', 'Your profile details have been saved.');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(
        'Save failed',
        'We could not update your profile right now. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        title='Profile Details'
        items={[{ label: 'Verses', href: '/verses' }]}
      />

      <View className='p-[18px]'>
        <View className='gap-10'>
          <View className='mx-auto mt-6'>
            <View className='mx-auto h-24 w-24 items-center justify-center gap-0 rounded-full border-2 border-dashed border-gray-300 p-0 dark:border-gray-600'>
              <CustomButton
                onPress={pickImageAsync}
                variant='default'
                className='mx-auto gap-0'
                innerElement={
                  <Avatar alt={firstName || ''} className='h-20 w-20'>
                    {/* <AvatarImage
                      source={{
                        uri: selectedImage ? selectedImage : user?.imageUrl,
                      }}
                    /> */}
                    <AvatarFallback>
                      <ThemedText className='text-lg font-medium'>
                        {firstName?.charAt(0) ||
                          user?.firstName?.charAt(0) ||
                          '?'}
                      </ThemedText>
                    </AvatarFallback>
                  </Avatar>
                }
              />
            </View>
            <ThemedText className='mt-2 text-center text-sm text-gray-600 dark:text-gray-400'>
              Tap to change photo
            </ThemedText>
          </View>

          <View className='gap-4'>
            <View className='gap-3 pb-3'>
              <Label nativeID='firstName'>First name</Label>
              <Input
                aria-aria-labelledby='firstName'
                value={firstName}
                onChangeText={setFirstName}
                placeholder='Enter first name'
                className='dark:text-white'
                editable={true}
              />
            </View>
            <View className='gap-3 pb-3'>
              <Label nativeID='lastName'>Last name</Label>
              <Input
                aria-aria-labelledby='lastName'
                value={lastName}
                onChangeText={setLastName}
                placeholder='Enter last name'
                className='dark:text-white'
                editable={true}
              />
            </View>
            <View className='gap-3 pb-3'>
              <Label nativeID='email'>Email</Label>
              <Input
                aria-aria-labelledby='email'
                value={user?.primaryEmailAddress?.toString() || ''}
                placeholder='Email address'
                className='dark:text-white'
                editable={false}
              />
            </View>
          </View>

          <View className='gap-3'>
            <CustomButton
              onPress={handleSave}
              className='w-full'
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </CustomButton>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
