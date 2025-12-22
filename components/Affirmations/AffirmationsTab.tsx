import { FlatList, View } from 'react-native';
import React, { memo } from 'react';
import AffirmationCard from './AffirmationCard';
import ThemedText from '../ThemedText';
import ItemSeparator from '../ItemSeparator';
import { useQuery } from 'convex-helpers/react/cache';
import { api } from '@/convex/_generated/api';
import { Button } from '../ui/button';
import { useRouter } from 'expo-router';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import FlashListSkeletonLoader from '../FlashListSkeletonLoader';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useMutation } from 'convex/react';
import { useAlert } from '@/hooks/useAlert';

type AffirmationsTabProps = {
  gridView: boolean;
};

const AffirmationsTab = ({ gridView }: AffirmationsTabProps) => {
  const { canMakeQueries, isLoading } = useAuthGuard();
  const router = useRouter();

  const getAffirmations = useQuery(
    api.affirmations.getAffirmations,
    canMakeQueries ? { take: 10 } : 'skip'
  );

  const deleteAffirmation = useMutation(api.affirmations.deleteAffirmation);
  const { alert } = useAlert();

  const handleDelete = async (id: string) => {
    alert(
      'Delete Affirmation',
      'Are you sure you want to delete this affirmation?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAffirmation({ id: id as any });
            } catch (error) {
              console.error('Error deleting affirmation:', error);
              alert('Error', 'Failed to delete affirmation');
            }
          },
        },
      ]
    );
  };

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

        {isLoading ? (
          <FlashListSkeletonLoader type='verses' gridView={gridView} />
        ) : (
          <FlatList
            key={gridView ? 'grid-affirmations' : 'list-affirmations'}
            data={getAffirmations}
            keyExtractor={(item, index) => item._id || index.toString()}
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
                _id={item._id}
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
