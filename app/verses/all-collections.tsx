import { View, Text, ScrollView, Platform } from 'react-native';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import RemoveCircleIcon from '@/components/icons/RemoveCircleIcon';
import BackHeader from '@/components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '@/convex/_generated/api';
import { usePaginatedQuery } from 'convex-helpers/react/cache';
import { FlatList } from 'react-native-gesture-handler';
import AddVersesEmpty from '@/components/EmptyScreen/AddVersesEmpty';
import VerseCard from '@/components/Verses/VerseCard';
import ItemSeparator from '@/components/ItemSeparator';
import ThemedText from '@/components/ThemedText';
import { useGridListView } from '@/store/tab-store';
import { Id } from '@/convex/_generated/dataModel';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useMutation } from 'convex/react';
import CancelIcon from '@/components/icons/CancelIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import CollectionCard from '@/components/Verses/CollectionCard';
import { useAuth } from '@clerk/clerk-expo';
import FlashListSkeletonLoader from '@/components/FlashListSkeletonLoader';

const AllCollectionScreen = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const { gridView } = useGridListView();
  const [shouldDelete, setShouldDelete] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState<Id<'collections'>[]>(
    []
  );
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);
  const { isDarkMode } = useColorScheme();

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.collections.getAllCollections,
    isSignedIn && isLoaded ? {} : 'skip',
    { initialNumItems: 20 }
  );

  const deleteCollections = useMutation(api.collections.deleteCollections);

  const toggleSelectedVerse = (_id: Id<'collections'>) => {
    setSelectedToDelete(prev =>
      prev.includes(_id) ? prev.filter(id => id !== _id) : [...prev, _id]
    );
  };

  const handleDeleteVerses: () => Promise<void> = async () => {
    await deleteCollections({ ids: selectedToDelete });
    // toast is needed here
    setBottomSheetIndex(-1);
  };

  return (
    <SafeAreaView className='flex-1'>
      {Platform.OS === 'web' && (
        <>
          <title>All Collections - Into My Heart</title>
          <meta
            name='description'
            content='View and manage all your Bible verse collections. Organize verses by theme, topic, or study plan.'
          />
          <meta
            name='keywords'
            content='Bible, memorization, verses, flashcards, practice, Christian, faith, scripture'
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
        title={shouldDelete ? 'Delete Collections' : 'All Collections'}
        canDelete
        LiftComponent={
          shouldDelete ? (
            <Button
              size={'icon'}
              variant={'ghost'}
              onPress={() => setShouldDelete(false)}
            >
              <CancelIcon />
            </Button>
          ) : null
        }
        RightComponent={
          <>
            {shouldDelete && (
              <Button
                size={'icon'}
                variant={'ghost'}
                onPress={() => setBottomSheetIndex(1)}
              >
                <DeleteIcon />
              </Button>
            )}

            {!shouldDelete && (
              <Button
                size={'icon'}
                variant={'ghost'}
                disabled={results.length === 0}
                onPress={() => setShouldDelete(true)}
              >
                <RemoveCircleIcon />
              </Button>
            )}
          </>
        }
        items={[
          { label: 'Verses', href: '/verses' },
          { label: 'My Collections', href: '/verses/all-collections' },
        ]}
      />

      <View className='flex-1 px-[18px]'>
        {isLoading && results?.length === 0 ? (
          <FlashListSkeletonLoader type='collections' gridView={gridView} />
        ) : (
          <FlatList
            key={gridView ? 'grid-myverses' : 'list-myverses'}
            data={results}
            keyExtractor={(item, index) => index.toString()}
            numColumns={gridView ? 2 : 1}
            ListEmptyComponent={() => (
              <>
                <AddVersesEmpty />
              </>
            )}
            renderItem={({ item }) => (
              <CollectionCard
                _id={item._id}
                collectionName={item.collectionName}
                versesLength={item.versesLength}
                onAddPress={() => console.log(`${item} pressed`)}
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
    </SafeAreaView>
  );
};

export default AllCollectionScreen;
