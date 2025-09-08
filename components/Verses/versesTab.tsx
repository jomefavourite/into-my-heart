import { FlatList, StyleSheet, View } from 'react-native';
import React, { memo, useEffect } from 'react';
import VerseCard, { VerseCardSkeleton } from '~/components/Verses/VerseCard';
import { verses } from '~/lib/constants';
import ThemedText from '../ThemedText';
import ItemSeparator from '../ItemSeparator';
// import { useQuery } from 'convex/react';
import { useQuery } from 'convex-helpers/react/cache';
import { api } from '~/convex/_generated/api';
import { Button } from '../ui/button';
import { useRouter } from 'expo-router';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import { useMutation } from 'convex/react';
import { addVerseSuggestion } from '~/convex/verseSuggestions';
import AddVersesEmpty from '../EmptyScreen/AddVersesEmpty';
import SuggestionEmpty from '../EmptyScreen/SuggestionEmpty';
import { useConvexAuth } from 'convex/react';

type VersesTabProps = {
  gridView: boolean;
};

const VersesTab = ({ gridView }: VersesTabProps) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  const getVerses = useQuery(
    api.verses.getVerses,
    isAuthenticated ? { take: 5 } : 'skip'
  );

  const getVerseSuggestions = useQuery(
    api.verseSuggestions.getVersesSuggestion,
    isAuthenticated ? {} : 'skip'
  );

  const addVerse = useMutation(api.verses.addVerse);
  const addVerseSuggestion = useMutation(
    api.verseSuggestions.addVerseSuggestion
  );

  // console.log(getVerses, 'getVerses');

  const handleAddVerseSuggestion = (verseData: any) => {
    // addVerse({
    //   bookName: verseData.bookName,
    //   chapter: verseData.chapter,
    //   verses: verseData.verses,
    //   reviewFreq: '',
    // });
  };

  // Don't render if not authenticated or still loading
  if (isLoading) {
    return (
      <View>
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View>
        <ThemedText>Please sign in to view your verses.</ThemedText>
      </View>
    );
  }

  // Handle authentication errors
  if (getVerses === undefined && !isLoading) {
    return (
      <View>
        <ThemedText>
          Authentication error. Please try refreshing the page.
        </ThemedText>
      </View>
    );
  }

  return (
    <View>
      <View>
        <View className='flex-row items-center justify-between'>
          <ThemedText size={18} variant='semibold' className='py-2'>
            My Verses
          </ThemedText>

          <Button
            size={'icon'}
            variant={'ghost'}
            onPress={() => router.push('/verses/all-verses')}
            className='flex-row '
          >
            <ThemedText size={12} className='pl-2'>
              View all
            </ThemedText>
            <ArrowRightIcon />
          </Button>
        </View>
        <FlatList
          key={gridView ? 'grid-myverses' : 'list-myverses'}
          data={getVerses}
          keyExtractor={(item, index) => index.toString()}
          numColumns={gridView ? 2 : 1}
          ListEmptyComponent={() => (
            <>
              {/* Loading */}
              {/* <VerseCardSkeleton /> */}
              <AddVersesEmpty />
            </>
          )}
          renderItem={({ item }) => (
            <VerseCard
              _id={item._id}
              bookName={item.bookName}
              chapter={item.chapter}
              verses={item.verses}
              verseTexts={item.verseTexts}
              containerClassName={gridView ? 'w-[50%]' : 'w-full'}
              canCheck={false}
            />
          )}
          columnWrapperStyle={
            gridView ? { justifyContent: 'space-between', gap: 8 } : undefined
          }
          ItemSeparatorComponent={ItemSeparator}
          scrollEnabled={false}
        />
      </View>
      <View>
        <ThemedText size={18} variant='semibold' className='py-2'>
          Verse Suggestions
        </ThemedText>

        <FlatList
          key={gridView ? 'grid-suggestions' : 'list-suggestions'}
          data={getVerseSuggestions}
          keyExtractor={(item, index) => index.toString()}
          numColumns={gridView ? 2 : 1}
          ListEmptyComponent={() => (
            <>
              {/* Loading */}
              {/* <VerseCardSkeleton /> */}
              <SuggestionEmpty />
            </>
          )}
          renderItem={({ item }) => (
            <VerseCard
              _id={item._id as any} // Type assertion to handle ID mismatch
              bookName={item.bookName}
              chapter={item.chapter}
              verses={item.verses}
              verseTexts={item.verseTexts || []} // Provide default empty array
              onAddPress={() => handleAddVerseSuggestion(item)}
              containerClassName={gridView ? 'w-[50%]' : 'w-full'} // Keep this for card sizing
            />
          )}
          columnWrapperStyle={
            // Apply gap between columns if gridView is true
            gridView ? { justifyContent: 'space-between', gap: 8 } : undefined
          }
          ItemSeparatorComponent={ItemSeparator}
          // contentContainerStyle={
          //   gridView
          //     ? { paddingVertical: 8, paddingHorizontal: 16 }
          //     : { paddingVertical: 8, paddingHorizontal: 16 }
          // }
          scrollEnabled={false}
        />
      </View>
    </View>
  );
};

export default memo(VersesTab);
