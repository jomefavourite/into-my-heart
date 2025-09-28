import { View, Pressable, Image } from 'react-native';
import CustomButton from '@/components/CustomButton';
import ThemedText from '@/components/ThemedText';
import { useRef } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import HomeHeader from '@/components/Home/Header';
import { Button } from '@/components/ui/button';
import FavouriteIcon from '@/components/icons/FavouriteIcon';
import ShareIcon from '@/components/icons/ShareIcon';
import { Link, useRouter } from 'expo-router';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import { FlatList } from 'react-native';
import { verses } from '@/lib/utils';
import VerseCard from '@/components/Verses/VerseCard';
import ItemSeparator from '@/components/ItemSeparator';
import AddVersesEmpty from '@/components/EmptyScreen/AddVersesEmpty';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth, useUser } from '@clerk/clerk-expo';
import '@/global.css';
import Loader from '@/components/Loader';

export const metadata = {
  title: 'Into My Heart - Memorize Bible Verses',
  description:
    'Memorize Bible verses with proven techniques. Practice with flashcards, fill-in-the-blanks, and recitation methods.',
  openGraph: {
    title: 'Into My Heart - Memorize Bible Verses',
    description:
      'Memorize Bible verses with proven techniques. Practice with flashcards, fill-in-the-blanks, and recitation methods.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Into My Heart - Memorize Bible Verses',
    description:
      'Memorize Bible verses with proven techniques. Practice with flashcards, fill-in-the-blanks, and recitation methods.',
  },
};

export default function HomeScreen() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  // Fetch user's verses - only when user is fully authenticated and loaded
  const getVerses = useQuery(
    api.verses.getVerses,
    isSignedIn && isLoaded && user ? { take: 5 } : 'skip'
  );

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
          <View className='gap-8 web:grid web:lg:grid-cols-2'>
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

                <View className='mt-2 rounded-3xl border-none bg-[#313131] px-5 py-6 dark:bg-[#343434]'>
                  <ThemedText
                    size={12}
                    variant='medium'
                    className='text-white dark:text-primary'
                  >
                    John 3:16 KJV
                  </ThemedText>
                  <ThemedText
                    variant='medium'
                    className='my-7 text-base text-white dark:text-primary'
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
                    <ThemedText className='text-xs'>View all -{'>'}</ThemedText>
                  </Link>
                </View>

                {!isSignedIn || !isLoaded || !user ? (
                  <AddVersesEmpty />
                ) : getVerses === undefined ? (
                  <View className='flex-1 items-center justify-center py-8'>
                    <Loader />
                  </View>
                ) : getVerses && getVerses.length > 0 ? (
                  <FlatList
                    data={getVerses}
                    style={{ height: 300 }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <VerseCard
                        _id={item._id}
                        bookName={item.bookName}
                        chapter={item.chapter}
                        verses={item.verses}
                        verseTexts={item.verseTexts}
                        onAddPress={() =>
                          console.log(
                            `${item.bookName} ${item.chapter} pressed`
                          )
                        }
                        canCheck={false}
                        noRoute={true}
                      />
                    )}
                    ItemSeparatorComponent={ItemSeparator}
                  />
                ) : (
                  <AddVersesEmpty />
                )}
              </View>
            </View>

            <View className='gap-3'>
              <View className='gap-2'>
                <View className='mb-2 flex-row items-center justify-between'>
                  <ThemedText className='font-medium'>
                    Verse Suggestions
                  </ThemedText>
                  <Link href={'/verses/verse-suggestions'}>
                    <ThemedText className='text-xs'>View all -{'>'}</ThemedText>
                  </Link>
                </View>

                <FlatList
                  data={verses}
                  style={{ height: 300 }}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <VerseCard
                      bookName={item.bookName}
                      chapter={item.chapter}
                      verses={item.verses}
                      verseTexts={[
                        { verse: item.verses[0], text: item.reference },
                      ]}
                      onAddPress={() =>
                        console.log(`${item.reference} pressed`)
                      }
                    />
                  )}
                  ItemSeparatorComponent={ItemSeparator}
                />
              </View>

              <View className='mb-12 gap-2'>
                <ThemedText className='text-lg font-medium'>
                  Bible study and Memorization tips
                </ThemedText>

                <ThemedText className='text-[#707070] dark:text-[#909090]'>
                  Discover practical ways to study scripture and memorize verses
                  effectively. Whether you're just starting out or looking to
                  deepen your understanding, these strategies will guide you
                  every step of the way.
                </ThemedText>

                <Image
                  source={require('@/assets/images/bible-tips.png')}
                  style={{ width: '100%', height: 300 }}
                  className='my-2 w-full rounded-xl'
                />

                <Pressable
                  onPress={() => router.push('/memorization-tips')}
                  className='flex-row items-center gap-1'
                >
                  <ThemedText className='ml-auto text-[13px]'>
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
