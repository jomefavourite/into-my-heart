import React from 'react';
import { Platform, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/components/BackHeader';
import ThemedText from '@/components/ThemedText';
import { Switch } from '@/components/ui/switch';
import { usePracticeLauncherPreferences } from '@/store/tab-store';

export default function PracticeSettingsScreen() {
  const randomizePracticeOrder = usePracticeLauncherPreferences(
    state => state.randomizePracticeOrder
  );
  const setRandomizePracticeOrder = usePracticeLauncherPreferences(
    state => state.setRandomizePracticeOrder
  );

  const toggleRandomizeOrder = (nextValue?: boolean) => {
    setRandomizePracticeOrder(nextValue ?? !randomizePracticeOrder);
  };

  return (
    <SafeAreaView className='flex-1'>
      {Platform.OS === 'web' && (
        <>
          <title>Practice Settings - Into My Heart</title>
          <meta
            name='description'
            content='Choose how practice sessions are ordered in Into My Heart.'
          />
        </>
      )}

      <BackHeader
        title='Practice Settings'
        items={[
          { label: 'Memorize', href: '/memorize' },
          { label: 'Practice Settings', href: '/memorize/settings' },
        ]}
      />

      <View className='flex-1 px-[18px] pb-[18px]'>
        <View className='rounded-3xl bg-container p-5'>
          <ThemedText className='text-lg font-medium'>
            Practice order
          </ThemedText>
          <ThemedText className='mt-2 text-sm text-muted-foreground'>
            Choose whether technique sessions should start in your saved order or
            shuffle verses and collection verses each time you begin.
          </ThemedText>

          <Pressable
            onPress={() => toggleRandomizeOrder()}
            className='mt-5 flex-row items-start justify-between gap-4 rounded-2xl bg-background px-4 py-4'
          >
            <View className='flex-1 gap-1'>
              <ThemedText className='font-medium'>
                Randomize practice order
              </ThemedText>
              <ThemedText className='text-sm text-muted-foreground'>
                When on, every new technique session starts in a fresh shuffled
                order. When off, sessions follow the list as shown.
              </ThemedText>
            </View>

            <Switch
              checked={randomizePracticeOrder}
              onCheckedChange={toggleRandomizeOrder}
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
