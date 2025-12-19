import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  View,
  Pressable,
  FlatList,
  LayoutChangeEvent,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import BackHeader from '@/components/BackHeader';
import { BOOKS } from '@/lib/books';
import ThemedText from '@/components/ThemedText';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'; // from react-native-reusables
import { useBookStore } from '@/store/bookStore';
import { useIsCollOrVerse } from '@/store/tab-store';
import { ScrollView } from 'react-native';

type ChapterItemType = {
  bookName: string;
  chapter: number;
  chapterLength: number;
  chapters: {
    chapterNumber: number;
    versesLength: number;
  }[];
  itemWidth: number;
};

const ChapterItem = React.memo(
  ({
    bookName,
    chapter,
    chapterLength,
    chapters,
    itemWidth,
  }: ChapterItemType) => {
    const router = useRouter();
    const { setBookName, setChapter, setChapterLength, setVersesLength } =
      useBookStore();

    const handlePress = useCallback(() => {
      setBookName(bookName);
      setChapter(chapter);
      setChapterLength(chapterLength);

      const verseLength = chapters[chapter - 1].versesLength;
      setVersesLength(verseLength);

      router.push(
        `/verses/select-verses?book=${bookName}&chapter=${chapter}&verseLength=${verseLength}`
      );
    }, [bookName, chapter]);

    return (
      <Pressable
        style={{ width: itemWidth, height: itemWidth }}
        className='flex-row items-center justify-center rounded-md bg-container'
        onPress={handlePress}
      >
        <ThemedText className='text-center'>{chapter}</ThemedText>
      </Pressable>
    );
  }
);

export default function AddBookScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [containerWidth, setContainerWidth] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(
    undefined
  );
  const { setVerses } = useBookStore();
  const { isCollOrVerse } = useIsCollOrVerse();

  // Reset verses when the screen is loaded
  useEffect(() => {
    setVerses([]);
  }, []);

  // Clear verses whenever the page comes into focus
  useFocusEffect(
    useCallback(() => {
      setVerses([]);
    }, [setVerses])
  );

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return BOOKS;
    const lower = searchQuery.trim().toLowerCase();
    return BOOKS.filter(
      book =>
        book.name.toLowerCase().includes(lower) ||
        book.abbreviation.toLowerCase().includes(lower)
    );
  }, [searchQuery]);

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
    if (containerWidth < 1100) return 15; // Tablet / Small desktop
    return 15; // Large desktop
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
  const flatListRefs = useRef<{ [key: string]: any }>({});

  // Disable scroll capture on web after FlatList renders
  useEffect(() => {
    if (Platform.OS === 'web') {
      const timeout = setTimeout(() => {
        Object.values(flatListRefs.current).forEach((ref: any) => {
          // Try different possible internal ref paths
          const scrollRef =
            ref?._listRef?._scrollRef ||
            ref?._scrollRef ||
            ref?._component?._scrollRef ||
            ref?._listRef?.getScrollableNode?.();

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
        });
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [filteredBooks, numColumns, openAccordion]);

  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        title='Select book'
        items={
          isCollOrVerse === 'collections'
            ? [
                { label: 'Verses', href: '/verses' },
                {
                  label: 'Create Collection',
                  href: '/verses/create-collection',
                },
                { label: 'Select Book', href: '/verses/select-book' },
              ]
            : [
                { label: 'Verses', href: '/verses' },
                { label: 'Select Book', href: '/verses/select-book' },
              ]
        }
      />

      <View className='mb-2 gap-2 px-[18]'>
        <Input
          placeholder='Search by book name'
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View className='mt-2 flex flex-row justify-between'>
          <ThemedText className='text-xs font-medium'>Books</ThemedText>
          <ThemedText className='text-xs font-medium'>
            Total Chapters
          </ThemedText>
        </View>
      </View>

      <ScrollView
        className='flex-1 px-[18]'
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {filteredBooks.length === 0 && searchQuery.trim() ? (
          <View className='flex-1 items-center justify-center py-12'>
            <ThemedText className='text-center text-base text-muted-foreground'>
              Book not found
            </ThemedText>
          </View>
        ) : (
          <Accordion
            type='single'
            collapsible
            value={openAccordion}
            onValueChange={setOpenAccordion}
          >
            {filteredBooks.map(book => (
              <AccordionItem key={book.id} value={book.id}>
                <AccordionTrigger className='hover:no-underline'>
                  <View className='flex-1 flex-row items-center justify-between'>
                    <ThemedText>{book.name}</ThemedText>
                    <ThemedText>{book.chaptersLength}</ThemedText>
                  </View>
                </AccordionTrigger>

                <AccordionContent>
                  <View
                    onLayout={handleContainerLayout}
                    style={{ width: '100%' }}
                  >
                    <FlatList
                      ref={ref => {
                        if (ref) {
                          flatListRefs.current[book.id] = ref;
                        }
                      }}
                      key={`${book.id}-${numColumns}`}
                      data={Array.from(
                        { length: book.chaptersLength },
                        (_, i) => i + 1
                      )}
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
                      renderItem={({ item: chapter }) => (
                        <ChapterItem
                          chapter={chapter}
                          bookName={book.name}
                          chapterLength={book.chaptersLength}
                          chapters={book.chapters}
                          itemWidth={itemWidth}
                        />
                      )}
                    />
                  </View>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
