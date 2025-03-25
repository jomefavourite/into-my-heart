import {
  View,
  ScrollView,
  Pressable,
  Platform,
  Text,
  Image,
} from 'react-native';
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
import AddCircleIcon from '~/assets/icons/AddCircleIcon';

export default function HomeScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const router = useRouter();

  return (
    <>
      <HomeHeader />

      <ScrollView style={{ paddingHorizontal: 18, paddingVertical: 10 }}>
        {/* Verse of the Day */}
        <View>
          <ThemedText size={12} variant='semibold'>
            Verse of the Day
          </ThemedText>

          <View className='bg-[#313131] dark:bg-[#343434] border-none rounded-3xl py-6 px-5 mt-3'>
            <ThemedText
              size={12}
              variant='medium'
              className='text-white dark:text-primary '
            >
              John 3:16 KJV
            </ThemedText>
            <ThemedText
              variant='medium'
              className='text-white dark:text-primary text-base my-7'
            >
              For God so loved the world, that he gave his only Son, that
              whoever believes in him should not perish but have eternal life.
            </ThemedText>

            <View className='flex-row items-center justify-between'>
              <View className='flex-row gap-2'>
                <Button size={'icon'} className='bg-transparent'>
                  <FavouriteIcon stroke='white' />
                </Button>
                <Button size={'icon'} className='bg-transparent'>
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
        <View className='py-2 mt-4 gap-[22]'>
          <View className='gap-3'>
            <ThemedText variant='medium'>My Verses</ThemedText>

            <View className='bg-container p-7 rounded-2xl '>
              <ThemedText
                // variant='medium'
                className=' text-center max-w-[160px] mx-auto'
              >
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
          </View>

          <View className='gap-3'>
            <ThemedText variant='medium'>Verse Suggestions</ThemedText>

            <View className='gap-2 md:flex-wrap md:h-[160px]'>
              {[1, 2, 3].map((_, index) => (
                <View
                  key={index}
                  className='flex-row bg-container py-3 px-4 w-full rounded-xl gap-2'
                >
                  <View className='gap-1 '>
                    <ThemedText size={14} variant='medium'>
                      Genesis 1:1
                    </ThemedText>
                    <ThemedText
                      size={13}
                      className='w-fit text-[#707070] dark:text-[#909090]'
                    >
                      In the beginning, God created the heavens and the earth.
                    </ThemedText>
                  </View>

                  <View className=' items-center justify-center '>
                    <Pressable className=' '>
                      <AddCircleIcon />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View className='mb-12 gap-2'>
            <ThemedText size={18} variant='medium'>
              Bible study and Memorization tips
            </ThemedText>

            <ThemedText className='text-[#707070] dark:text-[#909090]'>
              Discover practical ways to study scripture and memorize verses
              effectively. Whether you're just starting out or looking to deepen
              your understanding, these strategies will guide you every step of
              the way.
            </ThemedText>

            <Image
              source={require('~/assets/images/bible-tips.png')}
              className='w-full object-contain h-[170px] rounded-xl my-2'
            />

            <Pressable
              onPress={() => router.push('/(tabs)/home/memorization-tips')}
              className='flex-row items-center gap-1'
            >
              <ThemedText size={13} className=' ml-auto'>
                Read here
              </ThemedText>
              <ArrowRightIcon />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
