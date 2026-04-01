import { FlatList, View } from 'react-native';
import React, { memo } from 'react';
import VerseCard from '@/components/Verses/VerseCard';
import ThemedText from '../ThemedText';
import ItemSeparator from '../ItemSeparator';
import { Button } from '../ui/button';
import { useRouter } from 'expo-router';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import AddVersesEmpty from '../EmptyScreen/AddVersesEmpty';
import FlashListSkeletonLoader from '../FlashListSkeletonLoader';
import VersesSuggestion from './VersesSuggestion';
import { useOfflineSyncStatus, useOfflineVerses } from '@/hooks/useOfflineData';

type VersesTabProps = {
  gridView: boolean;
};

const VersesTab = ({ gridView }: VersesTabProps) => {
  const router = useRouter();
  const getVerses = useOfflineVerses(6);
  const { hasHydrated } = useOfflineSyncStatus();

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

        {!hasHydrated ? (
          <FlashListSkeletonLoader type='verses' gridView={gridView} />
        ) : (
          <FlatList
            key={gridView ? 'grid-myverses' : 'list-myverses'}
            data={getVerses}
            keyExtractor={(_item, index) => index.toString()}
            numColumns={gridView ? 2 : 1}
            ListEmptyComponent={() => (
              <>
                <AddVersesEmpty />
              </>
            )}
            renderItem={({ item }) => (
              <VerseCard
                _id={item.syncId}
                bookName={item.bookName}
                chapter={item.chapter}
                verses={item.verses}
                verseTexts={item.verseTexts}
                containerClassName={gridView ? 'flex-1' : 'w-full'}
                canCheck={false}
              />
            )}
            columnWrapperStyle={
              gridView ? { gap: 8, width: '100%' } : undefined
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
