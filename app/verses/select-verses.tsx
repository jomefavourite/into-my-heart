import {
  ScrollView,
  View,
  LayoutChangeEvent,
  FlatList,
  Platform,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import ThemedText from '@/components/ThemedText';
import BackHeader from '@/components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import CustomButton from '@/components/CustomButton';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useBookStore } from '@/store/bookStore';
import { useIsCollOrVerse } from '@/store/tab-store';

export default function SelectVerses() {
  const router = useRouter();
  const {
    book: bookURL,
    chapter: chapterURL,
    verseLength: verseLengthURL,
    verses: versesURL,
    verseId: verseIdURL,
  } = useLocalSearchParams();

  let {
    bookName: bookName1,
    chapter: chapter1,
    versesLength: versesLength1,
    verses: storeVerses,
    setVerses,
  } = useBookStore();
  const { isCollOrVerse } = useIsCollOrVerse();
  const hasInitialized = useRef(false);
  const isUpdatingRef = useRef(false);

  console.log(chapter1, 'chapter1 in select-verses');
  // Extract values from URL or fallback to store
  const bookName = String(bookURL || bookName1 || '');
  const chapter = String(chapterURL || chapter1 || '');
  const versesLength = Number(verseLengthURL) || versesLength1;

  // Use local state as the single source of truth for UI
  const [localVerses, setLocalVerses] = useState<string[]>([]);
  const [isUpdatingProgrammatically, setIsUpdatingProgrammatically] =
    useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  // Restore verses from URL parameters on mount or clear for fresh start
  useEffect(() => {
    if (!hasInitialized.current) {
      if (versesURL) {
        const urlVerses = String(versesURL).split(',').filter(Boolean);
        setLocalVerses(urlVerses);
        setVerses(urlVerses);
      } else {
        // If no versesURL parameter, clear verses for fresh selection
        setLocalVerses([]);
        setVerses([]);
      }
      hasInitialized.current = true;
    }
  }, [versesURL]);

  // Sync local state to store when it changes (but not during programmatic updates)
  useEffect(() => {
    if (!isUpdatingProgrammatically && !isUpdatingRef.current) {
      isUpdatingRef.current = true;
      setVerses(localVerses);
      // Reset the ref after the update
      requestAnimationFrame(() => {
        isUpdatingRef.current = false;
      });
    }
  }, [localVerses, isUpdatingProgrammatically]);

  const handleValueChange = useCallback((newValue: string[]) => {
    setLocalVerses(newValue);
  }, []);

  const handlePress = useCallback(() => {
    router.push({
      pathname: '/verses/verse-summary',
      params: {
        book: bookName,
        chapter,
        verseLength: String(versesLength),
        verses: localVerses.join(','),
        ...(verseIdURL ? { verseId: String(verseIdURL) } : {}),
      },
    });
  }, [bookName, chapter, versesLength, localVerses, verseIdURL, router]);

  const handleAddAllVerse = useCallback(() => {
    const newVerses = Array.from(
      { length: Number(versesLength) },
      (_, index) => `${index + 1}`
    );

    // Set flag to prevent sync loop
    setIsUpdatingProgrammatically(true);
    setLocalVerses(newVerses);
    setVerses(newVerses);

    // Reset flag after state updates using requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      setIsUpdatingProgrammatically(false);
    });
  }, [versesLength]);

  const gap = 8;

  // Calculate number of columns based on container width
  // 5 columns for mobile, increasing for larger screens
  const numColumns = useMemo(() => {
    if (containerWidth === 0) return 5; // Default to mobile (5 columns)

    // Breakpoints for responsive columns
    if (containerWidth < 400) return 5; // Mobile
    if (containerWidth < 600) return 8; // Mobile
    if (containerWidth < 900) return 10; // Small tablet
    if (containerWidth < 1000) return 12; // Small desktop
    // if (containerWidth < 1100) return 15; // Tablet / Small desktop
    return 12; // Large desktop
  }, [containerWidth]);

  // Calculate grid item width based on container width and number of columns
  const itemWidth = useMemo(() => {
    if (containerWidth === 0) return 60; // Default fallback
    const totalGaps = (numColumns - 1) * gap;
    return (containerWidth - totalGaps) / numColumns;
  }, [containerWidth, numColumns]);

  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  }, []);

  // Ref to access FlatList's underlying DOM element on web
  const flatListRef = useRef<any>(null);

  // Disable scroll capture on web after FlatList renders
  useEffect(() => {
    if (Platform.OS === 'web') {
      const timeout = setTimeout(() => {
        if (flatListRef.current) {
          // Try different possible internal ref paths
          const scrollRef =
            flatListRef.current?._listRef?._scrollRef ||
            flatListRef.current?._scrollRef ||
            flatListRef.current?._component?._scrollRef ||
            flatListRef.current?._listRef?.getScrollableNode?.();

          if (scrollRef) {
            const element = scrollRef.node || scrollRef;
            if (element && element.style) {
              // @ts-ignore
              element.style.touchAction = 'pan-y';
              // @ts-ignore
              element.style.overscrollBehavior = 'none';
              // @ts-ignore
              element.style.overflow = 'visible';
            }
          }
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [numColumns, versesLength]);

  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        title='Select Verses'
        items={
          isCollOrVerse === 'collections'
            ? [
                { label: 'Verses', href: '/verses' },
                {
                  label: 'Create Collection',
                  href: '/verses/create-collection',
                },
                { label: 'Select Book', href: '/verses/select-book' },
                { label: 'Select Verses', href: '/verses/select-verses' },
              ]
            : [
                { label: 'Verses', href: '/verses' },
                { label: 'Select Book', href: '/verses/select-book' },
                { label: 'Select Verses', href: '/verses/select-verses' },
              ]
        }
      />

      <View className='flex-1 justify-between'>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 18 }}>
          <View className='flex-1'>
            <ThemedText className='mb-4 text-lg font-semibold'>
              {bookName && chapter ? `${bookName} ${chapter}` : ''}
            </ThemedText>

            <View onLayout={handleContainerLayout} style={{ width: '100%' }}>
              <ToggleGroup
                value={localVerses}
                onValueChange={handleValueChange}
                type='multiple'
                className='w-full'
              >
                <FlatList
                  ref={flatListRef}
                  key={`verses-${numColumns}`}
                  data={Array.from({ length: versesLength }, (_, i) => i + 1)}
                  numColumns={numColumns}
                  scrollEnabled={false}
                  nestedScrollEnabled={false}
                  removeClippedSubviews={false}
                  keyExtractor={item => item.toString()}
                  columnWrapperStyle={numColumns > 1 ? { gap } : undefined}
                  contentContainerStyle={{ gap }}
                  style={Platform.select({
                    web: {
                      // @ts-ignore - web-specific style
                      touchAction: 'pan-y',
                      // @ts-ignore - web-specific style
                      overscrollBehavior: 'none',
                    },
                    default: {},
                  })}
                  className={Platform.select({
                    web: '[&>div]:!touch-action-pan-y [&>div]:!overflow-visible',
                    default: undefined,
                  })}
                  renderItem={({ item: verseNumber }) => {
                    const verseValue = `${verseNumber}`;
                    const isActive = localVerses.includes(verseValue);

                    return (
                      <View style={{ width: itemWidth }}>
                        <ToggleGroupItem
                          value={verseValue}
                          aria-label={`Select verse ${verseNumber}`}
                          style={{
                            width: itemWidth,
                            height: itemWidth,
                            flex: 0,
                          }}
                          className={`!flex-none flex-row items-center justify-center rounded-md bg-container ${isActive ? 'bg-black hover:bg-black web:group-hover:bg-black dark:bg-zinc-500' : ''}`}
                        >
                          <ThemedText
                            style={isActive ? { color: 'white' } : {}}
                          >
                            {String(verseNumber)}
                          </ThemedText>
                        </ToggleGroupItem>
                      </View>
                    );
                  }}
                />
              </ToggleGroup>
            </View>
          </View>
        </ScrollView>

        <View className='my-5 gap-3 px-[18px]'>
          <CustomButton variant='outline' onPress={handleAddAllVerse}>
            Add entire chapter
          </CustomButton>
          <CustomButton
            onPress={() => handlePress()}
            disabled={localVerses.length === 0}
          >
            Continue
          </CustomButton>
        </View>
      </View>
    </SafeAreaView>
  );
}
