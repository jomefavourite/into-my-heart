import { FlatList, StyleSheet, View } from 'react-native';
import React, { memo, useEffect } from 'react';
import VerseCard, { VerseCardSkeleton } from '@/components/Verses/VerseCard';
import { verses } from '@/lib/utils';
import ThemedText from '../ThemedText';
import ItemSeparator from '../ItemSeparator';
// import { useQuery } from 'convex/react';
import { useQuery } from 'convex-helpers/react/cache';
import { api } from '@/convex/_generated/api';
import { Button } from '../ui/button';
import { useRouter } from 'expo-router';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import { useMutation } from 'convex/react';
import { addVerseSuggestion } from '@/convex/verseSuggestions';
import AddVersesEmpty from '../EmptyScreen/AddVersesEmpty';
import SuggestionEmpty from '../EmptyScreen/SuggestionEmpty';
import Loader from '../Loader';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import FlashListSkeletonLoader from '../FlashListSkeletonLoader';
import VersesSuggestion from './VersesSuggestion';

type VersesTabProps = {
  gridView: boolean;
};

const VersesTab = ({ gridView }: VersesTabProps) => {
  const { canMakeQueries, isLoading } = useAuthGuard();
  const router = useRouter();

  const getVerses = useQuery(
    api.verses.getVerses,
    canMakeQueries ? { take: 5 } : 'skip'
  );

  const getVerseSuggestions = useQuery(
    api.verseSuggestions.getAvailableVerseSuggestions,
    canMakeQueries ? { take: 5 } : 'skip'
  );

  const addVerse = useMutation(api.verses.addVerse);
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
    <View style={{ flex: 1 }}>
      <View>
        <View className='flex-row items-center justify-between'>
          <ThemedText className='py-2 text-lg font-semibold'>
            My Verses
          </ThemedText>

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

        {isLoading ? (
          <FlashListSkeletonLoader type='verses' gridView={gridView} />
        ) : (
          <FlatList
            key={gridView ? 'grid-myverses' : 'list-myverses'}
            data={getVerses}
            keyExtractor={(item, index) => index.toString()}
            numColumns={gridView ? 2 : 1}
            ListEmptyComponent={() => (
              <>
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
        )}
      </View>

      <VersesSuggestion gridView={gridView} />
    </View>
  );
};

export default memo(VersesTab);
