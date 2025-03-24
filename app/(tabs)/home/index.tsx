import { View, ScrollView, Pressable } from 'react-native';
import CustomButton from '~/components/CustomButton';
import ThemedText from '~/components/ThemedText';
import { useCallback, useRef } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import HomeHeader from '~/components/Home/Header';
import { Button } from '~/components/ui/button';
import FavouriteIcon from '~/assets/icons/FavouriteIcon';
import ShareIcon from '~/assets/icons/ShareIcon';
import { useRouter } from 'expo-router';
import ArrowRightIcon from '~/assets/icons/ArrowRightIcon';
import { H3 } from '~/components/ui/typography';

export default function HomeScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const router = useRouter();

  return (
    <>
      <HomeHeader />

      <ScrollView style={{ padding: 18 }}>
        {/* Verse of the Day */}
        <View className='py-2'>
          <ThemedText className='text-sm'>Verse of the Day</ThemedText>

          <View className='bg-primary border-none rounded-3xl py-6 px-5 mt-3'>
            <ThemedText className='text-sm text-white dark:text-primary '>
              Card Title
            </ThemedText>
            <ThemedText className='text-white dark:text-primary text-base my-7'>
              For God so loved the world, that he gave his only Son, that
              whoever believes in him should not perish but have eternal life.
            </ThemedText>

            <View className='flex-row items-center justify-between'>
              <View className='flex-row gap-2'>
                <Button size={'icon'}>
                  <FavouriteIcon stroke='white' />
                </Button>
                <Button size={'icon'}>
                  <ShareIcon stroke='white' />
                </Button>
              </View>
              <CustomButton
                variant='secondary'
                className='w-fit'
                onPress={() => router.push('/(tabs)/home/verse-of-the-day')}
              >
                Memorize
              </CustomButton>
            </View>
          </View>
        </View>

        {/* My verses */}
        <View className='py-2 mt-4'>
          <ThemedText>My Verses</ThemedText>

          <View className='bg-container p-7 rounded-2xl mt-5'>
            <ThemedText className='font-medium text-center max-w-[160px] mx-auto'>
              Start hiding God's Word in your heart
            </ThemedText>
            <CustomButton
              variant='ghost'
              rightIcon
              Icon={ArrowRightIcon}
              className='mt-3'
            >
              Add verse
            </CustomButton>
          </View>

          <View className='mt-5'>
            <ThemedText className='font-medium'>Verse Suggestions</ThemedText>

            <View className='gap-2 md:flex-wrap md:h-[160px]'>
              {[1, 2, 3].map((_, index) => (
                <View
                  key={index}
                  className='flex-row bg-container py-3 px-4 rounded-xl'
                >
                  <View>
                    <ThemedText>Genesis 1:1</ThemedText>
                    <ThemedText>
                      In the beginning, God created the heavens and the earth.
                    </ThemedText>
                  </View>
                  <CustomButton variant='ghost' size='icon' className='mt-3'>
                    Add verse
                  </CustomButton>
                </View>
              ))}
            </View>
          </View>

          <View className='mt-5 mb-12'>
            <H3>Bible study and Memorization tips</H3>
            <ThemedText>lj</ThemedText>

            <Pressable
              onPress={() => router.push('/(tabs)/home/memorization-tips')}
            >
              <ThemedText className='flex-row items-center'>
                Read more
                <ArrowRightIcon />
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
