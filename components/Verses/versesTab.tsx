import { FlatList, StyleSheet, View } from 'react-native';
import React, { memo } from 'react';
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

type VersesTabProps = {
  gridView: boolean;
};

const VersesTab = ({ gridView }: VersesTabProps) => {
  const getVerses = useQuery(api.verses.getVerses, { take: 5 });
  const getVerseSuggestions = useQuery(
    api.verseSuggestions.getVersesSuggestion
  );
  const router = useRouter();

  const addVerse = useMutation(api.verses.addVerse);
  const addVerseSuggestion = useMutation(
    api.verseSuggestions.addVerseSuggestion
  );

  // console.log(getVerses, 'getVerses');

  const handleAddVerseSuggestion = (verseData) => {
    // addVerse({
    //   bookName: verseData.bookName,
    //   chapter: verseData.chapter,
    //   verses: verseData.verses,
    //   reviewFreq: '',
    // });
  };

  return (
    <View>
      <View>
        <View className='flex-row items-center justify-between'>
          <ThemedText size={18} variant='semibold' className='py-2'>
            My Verse
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
              _id={item._id}
              bookName={item.bookName}
              chapter={item.chapter}
              verses={item.verses}
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
