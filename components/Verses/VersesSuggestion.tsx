import { View } from 'react-native';
import React from 'react';
import ThemedText from '../ThemedText';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import { Button } from '../ui/button';
import { FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import VerseCard from './VerseCard';
import ItemSeparator from '../ItemSeparator';
import SuggestionEmpty from '../EmptyScreen/SuggestionEmpty';
import { useOfflineVerseSuggestions } from '@/hooks/useOfflineData';
import { useOfflineDataStore } from '@/store/offlineDataStore';

const VersesSuggestion = ({
  gridView = false,
  isHome = false,
}: {
  gridView: boolean;
  isHome?: boolean;
}) => {
  const router = useRouter();
  const getVerseSuggestions = useOfflineVerseSuggestions(6);
  const addVerseSuggestionToUser = useOfflineDataStore(
    state => state.adoptVerseSuggestionLocal
  );

  const handleAddVerseSuggestion = async (verseData: any) => {
    try {
      addVerseSuggestionToUser(verseData.syncId);
    } catch (error) {
      console.error('Error adding verse suggestion:', error);
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
        keyExtractor={(_item, index) => index.toString()}
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
            _id={item.syncId}
            bookName={item.bookName}
            chapter={item.chapter}
            verses={item.verses}
            verseTexts={item.verseTexts || []}
            onAddPress={() => handleAddVerseSuggestion(item)}
            containerClassName={gridView ? 'flex-1' : 'w-full'}
            noRoute={true}
          />
        )}
        columnWrapperStyle={
          gridView ? { gap: 8, width: '100%' } : undefined
        }
        ItemSeparatorComponent={ItemSeparator}
        scrollEnabled={false}
      />
    </View>
  );
};

export default VersesSuggestion;
