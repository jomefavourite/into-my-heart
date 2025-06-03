import { View } from 'react-native';
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

  const handleValueChange = (newValue: string[]) => {
    setValue(newValue);
  };

  console.log('Selected verses:', value);

  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        title='Select Verses'
        items={[
          { label: 'Verses', href: '/verses' },
          { label: 'Select Book', href: '/verses/select-book' },
          { label: 'Select Verses', href: '/verses/select-verses' },
        ]}
      />

      <View className='px-[18px]'>
        <ThemedText className=' text-lg font-semibold mb-4'>
          Select Verses - Genesis 1
        </ThemedText>

        <ToggleGroup
          value={value}
          onValueChange={handleValueChange}
          type='multiple'
          className=' w-full flex-wrap gap-2 justify-start'
        >
          {new Array(20).fill(0).map((_, index) => {
            const verseValue = `${index + 1}`;
            const isActive = value.includes(verseValue);

            return (
              <ToggleGroupItem
                key={index}
                value={verseValue}
                aria-label={`Select verse ${index + 1}`}
                className={`bg-container flex-row  items-center rounded-md w-[54px] h-[40px] ${isActive ? 'bg-black hover:bg-black web:group-hover:bg-black' : ''}`}
              >
                <ThemedText style={isActive ? { color: 'white' } : {}}>
                  {index + 1}
                </ThemedText>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>

        <CustomButton
          onPress={() => router.push('/verses/verse-summary')}
          disabled={value.length === 0}
        >
          Continue
        </CustomButton>
      </View>
    </SafeAreaView>
  );
}
