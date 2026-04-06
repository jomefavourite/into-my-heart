import { View, Pressable, Image, Platform } from 'react-native';
import ThemedText from '@/components/ThemedText';
import { Button } from '@/components/ui/button';
import { Link, useRouter } from 'expo-router';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import { FlatList } from 'react-native';
import VerseCard from '@/components/Verses/VerseCard';
import ItemSeparator from '@/components/ItemSeparator';
import AddVersesEmpty from '@/components/EmptyScreen/AddVersesEmpty';
import '@/global.css';
import Loader from '@/components/Loader';
import PageHeader from '@/components/PageHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import VersesSuggestion from '@/components/Verses/VersesSuggestion';
import { formatVerseDisplay } from '@/lib/utils';
import { normalizeBibleText } from '@/lib/verseText';
import {
  useOfflineFeaturedVerse,
  useOfflineLaunchStats,
  useOfflineSyncStatus,
  useOfflineVerseSuggestions,
  useOfflineVerses,
} from '@/hooks/useOfflineData';

export default function HomeScreen() {
  const router = useRouter();
  const getVerses = useOfflineVerses(6);
  const featuredVerse = useOfflineFeaturedVerse();
  const getVerseSuggestions = useOfflineVerseSuggestions(1);
  const { hasHydrated } = useOfflineSyncStatus();
  const { lastPracticeSession } = useOfflineLaunchStats();

  // Determine which verse to show (featured or first suggestion)
  const displayVerse =
    featuredVerse ||
    (getVerseSuggestions && getVerseSuggestions.length > 0
      ? getVerseSuggestions[0]
      : null);
  const isSuggestedVerse = !featuredVerse && displayVerse;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className='flex-1'>
      {Platform.OS === 'web' && (
        <>
          <title>Into My Heart - Memorize Bible Verses</title>
          <meta
            name='description'
            content='Into My Heart - Memorize Bible verses with proven techniques. Practice with flashcards, fill-in-the-blanks, and recitation methods.'
          />
          <meta
            name='keywords'
            content='Bible, memorization, verses, flashcards, practice, Christian, faith, scripture'
          />
          <meta name='author' content='Into My Heart' />
          <meta name='robots' content='index, follow' />
          <meta property='og:type' content='website' />
          <meta property='og:site_name' content='Into My Heart' />
          <meta property='og:locale' content='en_US' />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='theme-color' content='#313131' />
          <meta name='msapplication-TileColor' content='#313131' />
        </>
      )}

      {/* {Platform.OS !== 'web' && <HomeHeader isWelcome />} */}
      {/* <View>
        <HomeHeader isWelcome />
      </View> */}

      <PageHeader title='Home' isWelcome />

      <FlatList
        className='flex-1 px-[18]'
        data={[{ id: 'accordion' }]}
        keyExtractor={item => item.id}
        nestedScrollEnabled
        renderItem={() => (
          <View className='web:scroll-container gap-5 web:grid web:lg:grid-cols-2'>
            <View className='gap-4'>
              {/* Featured Verse */}
              <View>
                <View className='flex-row items-center gap-2'>
                  <ThemedText
                    size={12}
                    variant='medium'
                    className='!font-semibold md:text-base md:font-medium'
                  >
                    Featured Verse
                  </ThemedText>
                  <View className='rounded-full bg-container px-2 py-0.5'>
                    <ThemedText className='text-xs'>KJV</ThemedText>
                  </View>
                  {isSuggestedVerse && (
                    <View className='rounded-full bg-[#909090] px-2 py-0.5'>
                      <ThemedText className='text-xs text-white'>
                        Suggested
                      </ThemedText>
                    </View>
                  )}
                </View>

                {!hasHydrated ? (
                  <View className='mt-2 rounded-3xl border-none bg-[#313131] px-5 py-6 dark:bg-[#343434]'>
                    <Loader />
                  </View>
                ) : displayVerse ? (
                  <Pressable
                    onPress={() => {
                      if (displayVerse.syncId && !isSuggestedVerse) {
                        router.push(`/verses/${displayVerse.syncId}`);
                      }
                    }}
                    className='mt-2 rounded-3xl border-none bg-[#313131] px-5 py-6 dark:bg-[#343434]'
                  >
                    <ThemedText
                      size={12}
                      variant='medium'
                      className='text-white dark:text-primary'
                    >
                      {displayVerse.bookName} {displayVerse.chapter}:
                      {formatVerseDisplay(displayVerse.verses)}
                    </ThemedText>
                    <ThemedText
                      variant='medium'
                      className='my-2 text-base text-white dark:text-primary'
                    >
                      {displayVerse.verseTexts
                        ?.map(
                          text =>
                            `${text.verse}. ${normalizeBibleText(text.text)}`
                        )
                        .join(' ') || '...'}
                    </ThemedText>

                    <View className='flex-row items-center justify-between'>
                      {/* <View className='flex-row gap-2'>
                        <Button size={'icon'} className='bg-transparent'>
                          <FavouriteIcon stroke='white' />
                        </Button>
                        <Button size={'icon'} className='bg-transparent'>
                          <ShareIcon stroke='white' />
                        </Button>
                      </View> */}

                      {/* <CustomButton
                        variant='secondary'
                        className='w-fit'
                        // onPress={() => router.push('/(home)/verse-of-the-day')}
                      >
                        Memorize
                      </CustomButton> */}
                    </View>
                  </Pressable>
                ) : (
                  <View className='mt-2 rounded-3xl border-none bg-[#313131] px-5 py-6 dark:bg-[#343434]'>
                    <ThemedText className='text-white dark:text-primary'>
                      No featured verse yet. Select a verse to feature it.
                    </ThemedText>
                  </View>
                )}
              </View>

              <View className='rounded-3xl bg-container p-4'>
                <ThemedText className='font-medium'>Recent Practice</ThemedText>
                <ThemedText className='mt-2 text-sm text-muted-foreground'>
                  {lastPracticeSession
                    ? `${lastPracticeSession.method === 'fillInBlanks' ? 'Fill in the blanks' : lastPracticeSession.method === 'flashcards' ? 'Flashcards' : 'Recitation'} session completed with ${lastPracticeSession.verseCount} verse${lastPracticeSession.verseCount === 1 ? '' : 's'}.`
                    : 'Finish a practice session to start building your launch progress history.'}
                </ThemedText>
              </View>

              {/* My Verses */}
              <View className='gap-2'>
                <View className='flex-row items-center justify-between'>
                  <ThemedText className='font-medium'>My Verses</ThemedText>

                  <Button
                    size={'icon'}
                    variant={'ghost'}
                    onPress={() => router.push('/verses/all-verses')}
                    className='flex-row gap-0'
                  >
                    <ThemedText className='pl-2 text-xs'>View all</ThemedText>
                    <ArrowRightIcon />
                  </Button>
                </View>

                {!hasHydrated ? (
                  <View className='flex-1 items-center justify-center py-8'>
                    <Loader />
                  </View>
                ) : getVerses && getVerses.length > 0 ? (
                  <FlatList
                    data={getVerses}
                    // style={{ height: 300 }}
                    keyExtractor={(_item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <VerseCard
                        _id={item.syncId}
                        bookName={item.bookName}
                        chapter={item.chapter}
                        verses={item.verses}
                        verseTexts={item.verseTexts}
                        canCheck={false}
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
              <VersesSuggestion gridView={false} isHome={true} />

              <View className='mb-12 gap-2'>
                <ThemedText className='text-lg font-medium'>
                  Bible study and Memorization tips
                </ThemedText>

                <ThemedText className='text-[#707070] dark:text-[#909090]'>
                  Discover practical ways to study scripture and memorize verses
                  effectively in KJV. These simple strategies will help you keep
                  a steady practice rhythm without overcomplicating your study
                  time.
                </ThemedText>

                <Image
                  source={require('@/assets/images/bible-tips.png')}
                  style={{ width: '100%', height: 300 }}
                  className='my-2 w-full rounded-xl'
                />

                <Link href={'/memorization-tips'} className='ml-auto'>
                  <View className='flex flex-row items-center gap-1'>
                    <ThemedText className='text-center text-[13px]'>
                      Read here
                    </ThemedText>
                    <ArrowRightIcon />
                  </View>
                </Link>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
