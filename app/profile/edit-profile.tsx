import { SafeAreaView, View } from 'react-native';
import React, { useState } from 'react';
import BackHeader from '~/components/BackHeader';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import ThemedText from '~/components/ThemedText';
import { useUser } from '@clerk/clerk-expo';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '~/components/CustomButton';
import DeleteIcon, { DeleteLightIcon } from '~/components/icons/DeleteIcon';
import CustomBottomSheet from '~/components/CustomBottomSheet';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

export default function EditProfile() {
  const { user } = useUser();
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
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
            <Avatar alt={user?.firstName || ''} className='w-24 h-24'>
              <AvatarImage
                source={{ uri: selectedImage ? selectedImage : user?.imageUrl }}
              />
              <AvatarFallback>
                <ThemedText>{user?.firstName?.charAt(0)}</ThemedText>
              </AvatarFallback>
            </Avatar>

            {/* <CustomButton onPress={pickImageAsync}>o</CustomButton> */}
          </View>

          <View className='gap-4'>
            <View className='gap-3 pb-3'>
              <Label nativeID='firstName'>First name</Label>
              <Input
                aria-aria-labelledby='firstName'
                defaultValue={user?.firstName || ''}
                placeholder='Enter first name'
                className='dark:text-white'
                editable={false}
              />
            </View>
            <View className='gap-3 pb-3'>
              <Label nativeID='lastName'>Last name</Label>
              <Input
                aria-aria-labelledby='lastName'
                defaultValue={user?.lastName || ''}
                placeholder='Enter last name'
                className='dark:text-white'
                editable={false}
              />
            </View>
            <View className='gap-3 pb-3'>
              <Label nativeID='email'>Email</Label>
              <Input
                aria-aria-labelledby='email'
                defaultValue={user?.primaryEmailAddress?.toString() || ''}
                placeholder='Enter last name'
                className='dark:text-white'
                editable={false}
              />
            </View>
          </View>

          <CustomButton
            leftIcon
            className='w-full'
            onPress={() => {
              bottomSheetRef.current?.expand();
            }}
          >
            Delete Account
          </CustomButton>
        </View>

        <CustomBottomSheet ref={bottomSheetRef} index={-1} snapPoints={['30%']}>
          <BottomSheetView className='p-4 py-8'>
            <ThemedText variant='medium' className='text-center'>
              Delete your account?
            </ThemedText>
            <ThemedText className='text-center text-[#707070] dark:text-[#909090'>
              This will permanently remove your data, including your saved
              verses, progress, and goals. This action cannot be undone.
            </ThemedText>

            <View className='gap-2 mt-7'>
              <CustomButton onPress={() => bottomSheetRef.current?.close()}>
                Cancel
              </CustomButton>
              <CustomButton variant='outline'>Delete Account</CustomButton>
            </View>
          </BottomSheetView>
        </CustomBottomSheet>
      </View>
    </SafeAreaView>
  );
}
