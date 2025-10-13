import { View } from 'react-native';
import React from 'react';
import ThemedText from '../ThemedText';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import { Button } from '../ui/button';
import { FlatList } from 'react-native';
import { router, useRouter } from 'expo-router';
import VerseCard from './VerseCard';
import ItemSeparator from '../ItemSeparator';
import SuggestionEmpty from '../EmptyScreen/SuggestionEmpty';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuthGuard } from '@/hooks/useAuthGuard';

const VersesSuggestion = ({
  gridView = false,
  isHome = false,
}: {
  gridView: boolean;
  isHome?: boolean;
}) => {
  const { canMakeQueries, isLoading } = useAuthGuard();
  const router = useRouter();

  const getVerseSuggestions = useQuery(
    api.verseSuggestions.getAvailableVerseSuggestions,
    canMakeQueries ? { take: 5 } : 'skip'
  );

  const addVerseSuggestionToUser = useMutation(
    api.verseSuggestions.addVerseSuggestionToUser
  );

  // console.log(getVerses, 'getVerses');

  const handleAddVerseSuggestion = async (verseData: any) => {
    try {
      await addVerseSuggestionToUser({
        suggestionId: verseData._id,
      });
      // The UI will automatically update due to Convex reactivity
    } catch (error) {
      console.error('Error adding verse suggestion:', error);
      // You might want to show an alert here
    }
  };
  return (
    <View>
      <View className='flex-row items-center justify-between'>
        {isHome ? (
          <ThemedText className='font-medium'>Verse Suggestions</ThemedText>
        ) : (
          <ThemedText className='py-2 text-lg font-semibold'>
            Verse Suggestions
          </ThemedText>
        )}

        <Button
          size={'icon'}
          variant={'ghost'}
          onPress={() => router.push('/verses/all-verses-suggestions')}
          className='flex-row gap-0'
        >
          <ThemedText className='pl-2 text-xs'>View all</ThemedText>
          <ArrowRightIcon />
        </Button>
      </View>

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
            noRoute={true}
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
  );
};

export default VersesSuggestion;
