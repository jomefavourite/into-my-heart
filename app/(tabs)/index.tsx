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
import FavouriteIcon from '~/components/icons/FavouriteIcon';
import ShareIcon from '~/components/icons/ShareIcon';
import { Link, useRouter } from 'expo-router';
import ArrowRightIcon from '~/components/icons/ArrowRightIcon';
import { H3 } from '~/components/ui/typography';
import AddCircleIcon from '~/components/icons/AddCircleIcon';
import { FlatList } from 'react-native';
import { verses } from '~/lib/constants';
import VerseCard from '~/components/Verses/VerseCard';
import ItemSeparator from '~/components/ItemSeparator';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddVersesEmpty from '~/components/EmptyScreen/AddVersesEmpty';

export default function HomeScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const router = useRouter();

  return (
    <>
      {/* {Platform.OS !== 'web' && <HomeHeader isWelcome />} */}
      <View className='md:hidden'>
        <HomeHeader isWelcome />
      </View>

      <FlatList
        className='flex-1 px-[18]'
        data={[{ id: 'accordion' }]}
        keyExtractor={item => item.id}
        renderItem={() => (
          <View className='web:grid gap-8 web:lg:grid-cols-2 '>
            <View className='gap-4'>
              {/* Verse of the Day */}
              <View>
                <ThemedText
                  size={12}
                  variant='medium'
                  className='!font-semibold md:text-base md:font-medium'
                >
                  Verse of the Day
                </ThemedText>

                <View className='bg-[#313131] dark:bg-[#343434] border-none rounded-3xl py-6 px-5 mt-2'>
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
                    whoever believes in him should not perish but have eternal
                    life.
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
                      onPress={() => router.push('/(home)/verse-of-the-day')}
                    >
                      Memorize
                    </CustomButton>
                  </View>
                </View>
              </View>

              {/* My Verses */}
              <View className='gap-2'>
                <View className='flex-row items-center justify-between'>
                  <ThemedText variant='medium'>My Verses</ThemedText>
                  <Link href={'/verses/all-verses'}>
                    <ThemedText size={12}>View all -{'>'}</ThemedText>
                  </Link>
                </View>

                <AddVersesEmpty />
              </View>
            </View>

            <View className='gap-3'>
              <View className='gap-2'>
                <View className='flex-row items-center justify-between mb-2'>
                  <ThemedText variant='medium'>Verse Suggestions</ThemedText>
                  <Link href={'/verses/verse-suggestions'}>
                    <ThemedText size={12}>View all -{'>'}</ThemedText>
                  </Link>
                </View>

                <FlatList
                  data={verses}
                  style={{ height: 300 }}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <VerseCard
                      reference={item.reference}
                      text={item.text}
                      onAddPress={() => console.log(`${item.text} pressed`)}
                    />
                  )}
                  ItemSeparatorComponent={ItemSeparator}
                />
              </View>

              <View className='mb-12 gap-2'>
                <ThemedText size={18} variant='medium'>
                  Bible study and Memorization tips
                </ThemedText>

                <ThemedText className='text-[#707070] dark:text-[#909090]'>
                  Discover practical ways to study scripture and memorize verses
                  effectively. Whether you're just starting out or looking to
                  deepen your understanding, these strategies will guide you
                  every step of the way.
                </ThemedText>

                <Image
                  source={require('~/assets/images/bible-tips.png')}
                  style={{ width: '100%', height: 300 }}
                  className='w-full rounded-xl my-2'
                />

                <Pressable
                  onPress={() => router.push('/memorization-tips')}
                  className='flex-row items-center gap-1'
                >
                  <ThemedText size={13} className=' ml-auto'>
                    Read here
                  </ThemedText>
                  <ArrowRightIcon />
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />
    </>
  );
}
