import { View, Alert } from 'react-native';
import React, { useState } from 'react';
import BackHeader from '@/components/BackHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ThemedText from '@/components/ThemedText';
import { useUser } from '@clerk/clerk-expo';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '@/components/CustomButton';
import DeleteIcon, { DeleteLightIcon } from '@/components/icons/DeleteIcon';
import CustomBottomSheet from '@/components/CustomBottomSheet';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useToast } from 'react-native-toast-notifications';

export const metadata = {
  title: 'Edit Profile',
  description:
    'Edit your profile information including name and profile picture',
};

export default function EditProfile() {
  const { user } = useUser();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const updateUserProfile = useMutation(api.users.updateUserProfile);
  const toast = useToast();

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
      Alert.alert('No image selected', 'You did not select any image.');
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

      // toast.show('Profile updated successfully!', {
      //   type: 'succes',
      //   placement: 'bottom',
      //   duration: 4000,
      //   animationType: 'slide-in',
      // });

      // Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      // toast.show('Failed to update profile. Please try again.', {
      //   type: 'danger',
      //   placement: 'bottom',
      //   duration: 4000,
      // });
      // Alert.alert('Error', 'Failed to update profile. Please try again.');
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

            <CustomButton
              leftIcon
              variant='destructive'
              className='w-full'
              onPress={() => {
                bottomSheetRef.current?.expand();
              }}
            >
              Delete Account
            </CustomButton>
          </View>
        </View>

        <CustomBottomSheet ref={bottomSheetRef} index={-1} snapPoints={['30%']}>
          <BottomSheetView className='p-4 py-8'>
            <ThemedText className='text-center font-medium'>
              Delete your account?
            </ThemedText>
            <ThemedText className='dark:text-[#909090 text-center text-[#707070]'>
              This will permanently remove your data, including your saved
              verses, progress, and goals. This action cannot be undone.
            </ThemedText>

            <View className='mt-7 gap-2'>
              <CustomButton onPress={() => bottomSheetRef.current?.close()}>
                Cancel
              </CustomButton>
              <CustomButton variant='destructive'>Delete Account</CustomButton>
            </View>
          </BottomSheetView>
        </CustomBottomSheet>
      </View>
    </SafeAreaView>
  );
}
