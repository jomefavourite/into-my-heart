import { View, Text } from 'react-native';
import React from 'react';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import Container from '~/components/Container';

export default function CreateGoal() {
  return (
    <View className='flex-1 p-4'>
      <View className='gap-1'>
        <Label nativeID='goalName'>Goal Name</Label>
        <Input aria-aria-labelledby='goalName' defaultValue='Enter goal name' />
      </View>
    </View>
  );
}
