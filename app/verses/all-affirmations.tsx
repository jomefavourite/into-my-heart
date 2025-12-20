import { View, Platform, FlatList, Alert } from 'react-native';
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import RemoveCircleIcon from '@/components/icons/RemoveCircleIcon';
import BackHeader from '@/components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '@/convex/_generated/api';
import { usePaginatedQuery } from 'convex-helpers/react/cache';
import AffirmationCard from '@/components/Affirmations/AffirmationCard';
import ItemSeparator from '@/components/ItemSeparator';
import ThemedText from '@/components/ThemedText';
import DeleteIcon from '@/components/icons/DeleteIcon';
import { Id } from '@/convex/_generated/dataModel';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useColorScheme } from '@/hooks/useColorScheme';
import CustomButton from '@/components/CustomButton';
import { useMutation } from 'convex/react';
import CancelIcon from '@/components/icons/CancelIcon';
import { useGridListView } from '@/store/tab-store';
import { FlashList } from '@shopify/flash-list';
import { useAuth } from '@clerk/clerk-expo';
import FlashListSkeletonLoader from '@/components/FlashListSkeletonLoader';
import { useRouter } from 'expo-router';
import { useToast } from 'react-native-toast-notifications';

const AllAffirmationsScreen = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { gridView } = useGridListView();
  const [shouldSelect, setShouldSelect] = useState(false);
  const [selectedAffirmations, setSelectedAffirmations] = useState<
    Id<'affirmations'>[]
  >([]);
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { isDarkMode } = useColorScheme();
  const router = useRouter();
  const toast = useToast();

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.affirmations.getAllAffirmations,
    isSignedIn && isLoaded ? {} : 'skip',
    { initialNumItems: 20 }
  );

  const deleteAffirmation = useMutation(api.affirmations.deleteAffirmation);

  const toggleSelectedAffirmation = (_id: Id<'affirmations'>) => {
    setSelectedAffirmations(prev =>
      prev.includes(_id) ? prev.filter(id => id !== _id) : [...prev, _id]
    );
  };

  const handleDeleteAffirmations: () => Promise<void> = async () => {
    try {
      await Promise.all(
        selectedAffirmations.map(id => deleteAffirmation({ id }))
      );
      toast.show('Affirmations deleted successfully', { type: 'success' });
      setSelectedAffirmations([]);
      setBottomSheetIndex(-1);
      setShouldSelect(false);
      bottomSheetRef.current?.close();
    } catch (error) {
      console.error('Error deleting affirmations:', error);
      toast.show('Failed to delete affirmations', { type: 'error' });
    }
  };

  const RightComponent = (
    <View className='flex flex-row gap-2'>
      {!shouldSelect && (
        <Button
          size={'icon'}
          variant={'ghost'}
          onPress={() => setShouldSelect(true)}
        >
          <RemoveCircleIcon />
        </Button>
      )}

      {shouldSelect && (
        <Button
          size={'icon'}
          variant={'ghost'}
          disabled={selectedAffirmations?.length === 0}
          onPress={() => setBottomSheetIndex(1)}
        >
          <DeleteIcon />
        </Button>
      )}

      {Platform.OS === 'web' && shouldSelect ? (
        <Button
          size={'icon'}
          variant={'ghost'}
          onPress={() => setShouldSelect(false)}
        >
          <CancelIcon />
        </Button>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView className='flex-1'>
      {Platform.OS === 'web' && (
        <>
          <title>All Affirmations - Into My Heart</title>
          <meta
            name='description'
            content='View and manage all your affirmations. Delete and organize your positive affirmations.'
          />
          <meta
            name='keywords'
            content='affirmations, positive thinking, self-improvement, motivation'
          />
          <meta name='author' content='Into My Heart' />
          <meta name='robots' content='index, follow' />
          <meta property='og:type' content='website' />
          <meta property='og:site_name' content='Into My Heart' />
          <meta property='og:locale' content='en_US' />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='theme-color' content='#313131' />
          <meta name='msapplication-TileColor' content='#313131' />
        </>
      )}

      <BackHeader
        title={shouldSelect ? 'Delete Affirmations' : 'My Affirmations'}
        BreadcrumbRightComponent={RightComponent}
        LiftComponent={
          shouldSelect ? (
            <Button
              size={'icon'}
              variant={'ghost'}
              onPress={() => {
                setShouldSelect(false);
                setSelectedAffirmations([]);
              }}
            >
              <CancelIcon />
            </Button>
          ) : null
        }
        RightComponent={RightComponent}
        items={[
          { label: 'Verses', href: '/verses' },
          { label: 'All My Affirmations', href: '/verses/all-affirmations' },
        ]}
      />

      <View className='flex-1 pb-[18px]'>
        {isLoading && results === undefined ? (
          <FlashListSkeletonLoader type='verses' gridView={gridView} />
        ) : results && results.length > 0 ? (
          <FlashList
            data={results}
            estimatedItemSize={100}
            key={gridView ? 'grid-all-affirmations' : 'list-all-affirmations'}
            numColumns={gridView ? 2 : 1}
            renderItem={({ item }) => (
              <AffirmationCard
                _id={item._id}
                content={item.content}
                containerClassName={gridView ? 'flex-1' : 'w-full'}
                canDelete={shouldSelect}
                onDeletePress={() => toggleSelectedAffirmation(item._id)}
                noRoute={shouldSelect}
                isSelectedForDelete={selectedAffirmations.includes(item._id)}
              />
            )}
            ItemSeparatorComponent={ItemSeparator}
            onEndReached={() => {
              if (status === 'CanLoadMore') {
                loadMore(10);
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              status === 'LoadingMore' ? (
                <View className='py-4'>
                  <ThemedText className='text-center text-muted-foreground'>
                    Loading more...
                  </ThemedText>
                </View>
              ) : null
            }
          />
        ) : (
          <View className='flex-1 items-center justify-center px-[18px]'>
            <View className='rounded-2xl bg-container p-7'>
              <ThemedText className='mx-auto max-w-[160px] text-center'>
                No affirmations yet. Start adding positive affirmations to your
                collection.
              </ThemedText>
              <CustomButton
                variant='ghost'
                className='mt-3'
                onPress={() => router.push('/verses/create-affirmation')}
              >
                <ThemedText>Add Affirmation</ThemedText>
              </CustomButton>
            </View>
          </View>
        )}
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={bottomSheetIndex}
        snapPoints={[1, 200]}
        enablePanDownToClose
        onClose={() => setBottomSheetIndex(-1)}
        backgroundStyle={{
          backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
        }}
      >
        <BottomSheetView className='flex-1 px-4'>
          <ThemedText className='mb-4 text-lg font-semibold'>
            Delete {selectedAffirmations.length} affirmation
            {selectedAffirmations.length > 1 ? 's' : ''}?
          </ThemedText>
          <ThemedText className='mb-4 text-muted-foreground'>
            This action cannot be undone.
          </ThemedText>
          <View className='flex-row gap-2'>
            <CustomButton
              variant='outline'
              className='flex-1'
              onPress={() => {
                setBottomSheetIndex(-1);
              }}
            >
              <ThemedText>Cancel</ThemedText>
            </CustomButton>
            <CustomButton className='flex-1' onPress={handleDeleteAffirmations}>
              <ThemedText>Delete</ThemedText>
            </CustomButton>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default AllAffirmationsScreen;
