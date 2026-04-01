import { FlatList, View } from 'react-native';
import React, { memo } from 'react';
import AffirmationCard from './AffirmationCard';
import ThemedText from '../ThemedText';
import ItemSeparator from '../ItemSeparator';
import { Button } from '../ui/button';
import { useRouter } from 'expo-router';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import FlashListSkeletonLoader from '../FlashListSkeletonLoader';
import {
  useOfflineAffirmations,
  useOfflineSyncStatus,
} from '@/hooks/useOfflineData';

type AffirmationsTabProps = {
  gridView: boolean;
};

const AffirmationsTab = ({ gridView }: AffirmationsTabProps) => {
  const router = useRouter();
  const getAffirmations = useOfflineAffirmations(10);
  const { hasHydrated } = useOfflineSyncStatus();

  return (
    <View style={{ flex: 1 }}>
      <View>
        <View className='flex-row items-center justify-between'>
          <ThemedText className='py-2 text-lg font-semibold'>
            My Affirmations
          </ThemedText>

          <Button
            size={'icon'}
            variant={'ghost'}
            onPress={() => router.push('/verses/all-affirmations')}
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
            key={gridView ? 'grid-affirmations' : 'list-affirmations'}
            data={getAffirmations}
            keyExtractor={(item, index) => item.syncId || index.toString()}
            numColumns={gridView ? 2 : 1}
            ListEmptyComponent={() => (
              <View className='rounded-2xl bg-container p-7'>
                <ThemedText className='mx-auto max-w-[160px] text-center'>
                  No affirmations yet. Start adding positive affirmations to
                  your collection.
                </ThemedText>
                <Button
                  variant='ghost'
                  className='mt-3'
                  onPress={() => router.push('/verses/create-affirmation')}
                >
                  <ThemedText>Add Affirmation</ThemedText>
                </Button>
              </View>
            )}
            renderItem={({ item }) => (
              <AffirmationCard
                _id={item.syncId}
                content={item.content}
                containerClassName={gridView ? 'flex-1' : 'w-full'}
                canDelete={false}
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
    </View>
  );
};

export default memo(AffirmationsTab);
