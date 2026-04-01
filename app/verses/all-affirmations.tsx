import { View, Platform, FlatList } from 'react-native';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import RemoveCircleIcon from '@/components/icons/RemoveCircleIcon';
import BackHeader from '@/components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import AffirmationCard from '@/components/Affirmations/AffirmationCard';
import ItemSeparator from '@/components/ItemSeparator';
import ThemedText from '@/components/ThemedText';
import DeleteIcon from '@/components/icons/DeleteIcon';
import CustomButton from '@/components/CustomButton';
import CancelIcon from '@/components/icons/CancelIcon';
import { useGridListView } from '@/store/tab-store';
import FlashListSkeletonLoader from '@/components/FlashListSkeletonLoader';
import { useRouter } from 'expo-router';
import { useToast } from 'react-native-toast-notifications';
import { useAlert } from '@/hooks/useAlert';
import {
  useOfflineAffirmations,
  useOfflineSyncStatus,
} from '@/hooks/useOfflineData';
import { useOfflineDataStore } from '@/store/offlineDataStore';

const AllAffirmationsScreen = () => {
  const { gridView } = useGridListView();
  const [shouldSelect, setShouldSelect] = useState(false);
  const [selectedAffirmations, setSelectedAffirmations] = useState<string[]>([]);
  const router = useRouter();
  const toast = useToast();
  const { alert } = useAlert();
  const results = useOfflineAffirmations();
  const deleteAffirmation = useOfflineDataStore(
    state => state.deleteAffirmationLocal
  );
  const { hasHydrated } = useOfflineSyncStatus();

  const toggleSelectedAffirmation = (_id: string) => {
    setSelectedAffirmations(prev =>
      prev.includes(_id) ? prev.filter(id => id !== _id) : [...prev, _id]
    );
  };

  const handleDeleteAffirmations: () => Promise<void> = async () => {
    try {
      selectedAffirmations.forEach(syncId => deleteAffirmation(syncId));
      toast.show('Affirmations deleted successfully', { type: 'success' });
      setSelectedAffirmations([]);
      setShouldSelect(false);
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
          onPress={() => {
            alert(
              `Delete ${selectedAffirmations.length} affirmation${
                selectedAffirmations.length > 1 ? 's' : ''
              }?`,
              'This action cannot be undone.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: handleDeleteAffirmations,
                },
              ]
            );
          }}
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
        {!hasHydrated ? (
          <FlashListSkeletonLoader type='verses' gridView={gridView} />
        ) : results && results.length > 0 ? (
          <FlatList
            data={results}
            key={gridView ? 'grid-all-affirmations' : 'list-all-affirmations'}
            numColumns={gridView ? 2 : 1}
            contentContainerStyle={{ paddingHorizontal: 18 }}
            renderItem={({ item }) => (
              <AffirmationCard
                _id={item.syncId}
                content={item.content}
                containerClassName={gridView ? 'flex-1' : 'w-full'}
                canDelete={shouldSelect}
                onDeletePress={() => toggleSelectedAffirmation(item.syncId)}
                noRoute={shouldSelect}
                isSelectedForDelete={selectedAffirmations.includes(item.syncId)}
              />
            )}
            ItemSeparatorComponent={ItemSeparator}
            columnWrapperStyle={
              gridView ? { gap: 8, width: '100%' } : undefined
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
                Add Affirmation
              </CustomButton>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AllAffirmationsScreen;
