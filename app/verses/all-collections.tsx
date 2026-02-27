import { View, Text, ScrollView, Platform } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
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
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import CustomButton from '@/components/CustomButton';

const AllCollectionScreen = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const { gridView } = useGridListView();
  const [shouldSelect, setShouldSelect] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState<Id<'collections'>[]>(
    []
  );
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);
  const { isDarkMode } = useColorScheme();

  const [moveBottomSheetIndex, setMoveBottomSheetIndex] = useState(-1);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const moveBottomSheetRef = useRef<BottomSheet>(null);

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.collections.getAllCollections,
    isSignedIn && isLoaded ? {} : 'skip',
    { initialNumItems: 20 }
  );

  const deleteCollections = useMutation(api.collections.deleteCollections);

  useEffect(() => {
    if (!isLoaded || isSignedIn) return;
    const timeoutId = setTimeout(() => {
      router.replace('/(onboarding)/onboard');
    }, 1200);
    return () => clearTimeout(timeoutId);
  }, [isLoaded, isSignedIn, router]);

  const toggleSelectedVerse = (_id: Id<'collections'>) => {
    setSelectedToDelete(prev =>
      prev.includes(_id) ? prev.filter(id => id !== _id) : [...prev, _id]
    );
  };

  const handleDeleteCollections: () => Promise<void> = async () => {
    await deleteCollections({ ids: selectedToDelete });
    // toast is needed here
    setBottomSheetIndex(-1);
    bottomSheetRef.current?.close();
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
          disabled={selectedToDelete?.length === 0}
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
      {isLoaded && !isSignedIn ? (
        <View className='flex-1 items-center justify-center gap-3 px-[18px]'>
          <ThemedText className='text-center text-xl font-semibold'>
            Sign in required
          </ThemedText>
          <ThemedText className='max-w-sm text-center text-[#909090]'>
            Redirecting to sign in so you can access all collections.
          </ThemedText>
          <CustomButton onPress={() => router.replace('/(onboarding)/onboard')}>
            Go to Sign in
          </CustomButton>
        </View>
      ) : (
        <>
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
            title={shouldSelect ? 'Delete Collections' : 'All Collections'}
            BreadcrumbRightComponent={RightComponent}
            LiftComponent={
              shouldSelect ? (
                <Button
                  size={'icon'}
                  variant={'ghost'}
                  onPress={() => setShouldSelect(false)}
                >
                  <CancelIcon />
                </Button>
              ) : null
            }
            RightComponent={RightComponent}
            items={[
              { label: 'Verses', href: '/verses' },
              { label: 'All Collections', href: '/verses/all-collections' },
            ]}
          />

          <View className='flex-1 pb-[18px]'>
            {isLoading && results?.length === 0 ? (
              <FlashListSkeletonLoader type='collections' gridView={gridView} />
            ) : (
              <FlatList
                key={gridView ? 'grid-myverses' : 'list-myverses'}
                data={results}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingHorizontal: 18 }}
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
                    containerClassName={gridView ? 'flex-1' : 'w-full'}
                    canCheck={false}
                    canDelete={shouldSelect}
                    onDeletePress={() => toggleSelectedVerse(item._id)}
                    isSelectedForDelete={selectedToDelete.includes(item._id)}
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

          <BottomSheet
            ref={bottomSheetRef}
            index={bottomSheetIndex}
            snapPoints={['25%']}
            enablePanDownToClose={true}
            onChange={index => setBottomSheetIndex(index)}
            backgroundStyle={{
              backgroundColor: isDarkMode ? '#313131' : '#fff',
            }}
            style={{
              boxShadow: isDarkMode
                ? '0px -4px 26px rgba(0,0,0, 0.5)'
                : '0px -4px 26px rgba(0,0,0, 0.1)',
              borderRadius: 30,
            }}
          >
            <BottomSheetView className='flex-1 p-4'>
              <View className='mx-auto mb-6 mt-6'>
                <ThemedText className='mb-6 text-center font-medium text-black dark:text-white'>
                  These collections will be removed
                </ThemedText>
                <ThemedText className='mb-6 text-center font-medium text-black dark:text-white'>
                  These collections will be removed and all progress. This
                  action cannot be undone.
                </ThemedText>
                <CustomButton onPress={handleDeleteCollections}>
                  Remove collections
                </CustomButton>
              </View>
            </BottomSheetView>
          </BottomSheet>
        </>
      )}
    </SafeAreaView>
  );
};

export default AllCollectionScreen;
