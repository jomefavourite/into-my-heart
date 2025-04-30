import { View, Text } from 'react-native';
import React from 'react';
import ThemedText from '~/components/ThemedText';
import BackHeader from '~/components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ToggleGroup,
  ToggleGroupIcon,
  ToggleGroupItem,
} from '~/components/ui/toggle-group';
import CustomButton from '~/components/CustomButton';
import { useRouter } from 'expo-router';

export default function SelectVerses() {
  const router = useRouter();
  const [value, setValue] = React.useState<string[]>([]);
  return (
    <SafeAreaView>
      <BackHeader
        title='Select Verses'
        items={[{ label: 'Verses', href: '/verses' }]}
      />

      <ToggleGroup value={value} onValueChange={setValue} type='multiple'>
        <ToggleGroupItem value='bold' aria-label='Toggle bold'>
          <ThemedText>Bold</ThemedText>
        </ToggleGroupItem>
        <ToggleGroupItem value='italic' aria-label='Toggle italic'>
          <ThemedText>Bold</ThemedText>
        </ToggleGroupItem>
        <ToggleGroupItem value='underline' aria-label='Toggle underline'>
          <ThemedText>Bold</ThemedText>
        </ToggleGroupItem>
      </ToggleGroup>

      <CustomButton onPress={() => router.push('/verse-summary')}>
        Continue
      </CustomButton>
    </SafeAreaView>
  );
}
