import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/components/BackHeader';

export default function Recitation() {
  return (
    <SafeAreaView>
      <BackHeader items={[{ label: 'Verses', href: '/verses' }]} />
      <Text>Recitation</Text>
    </SafeAreaView>
  );
}
