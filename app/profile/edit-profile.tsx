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

export default function EditProfile() {
  const { user } = useUser();

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
    <SafeAreaView className='flex-1 '>
      <BackHeader title='Profile Details' />

      <View className='p-[18px]'>
        <View className='mx-auto'>
          <Avatar alt={user?.firstName || ''} className='w-24 h-24'>
            <AvatarImage
              source={{ uri: selectedImage ? selectedImage : user?.imageUrl }}
            />
            <AvatarFallback>
              <ThemedText>{user?.firstName?.charAt(0)}</ThemedText>
            </AvatarFallback>
          </Avatar>

          <CustomButton onPress={pickImageAsync}>o</CustomButton>
        </View>

        <View>
          <View className='gap-1 pb-3'>
            <Label nativeID='firstName'>First name</Label>
            <Input
              aria-aria-labelledby='firstName'
              defaultValue=''
              placeholder='Enter first name'
              className='dark:text-white'
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
