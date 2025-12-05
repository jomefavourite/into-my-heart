import { View, Text, ScrollView, Platform, FlatList } from 'react-native';
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import RemoveCircleIcon from '@/components/icons/RemoveCircleIcon';
import BackHeader from '@/components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '@/convex/_generated/api';
import { usePaginatedQuery } from 'convex-helpers/react/cache';
import AddVersesEmpty from '@/components/EmptyScreen/AddVersesEmpty';
import VerseCard from '@/components/Verses/VerseCard';
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
import MoveCollectionIcon from '@/components/icons/MoveCollectionIcon';
import MoveToCollectionBottomSheet from '@/components/MoveToCollectionBottomSheet';
import MoveToCollectionModal from '@/components/MoveToCollectionModal';

const AllVersesScreen = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { gridView } = useGridListView();
  const [shouldSelect, setShouldSelect] = useState(false);
  const [selectedVerses, setSelectedVerses] = useState<Id<'verses'>[]>([]);
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);
  const [moveBottomSheetIndex, setMoveBottomSheetIndex] = useState(-1);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const moveBottomSheetRef = useRef<BottomSheet>(null);
  const { isDarkMode } = useColorScheme();

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.verses.getAllVerses,
    isSignedIn && isLoaded ? {} : 'skip',
    { initialNumItems: 20 }
  );

  const deleteVerses = useMutation(api.verses.deleteVerses);

  const toggleSelectedVerse = (_id: Id<'verses'>) => {
    setSelectedVerses(prev =>
      prev.includes(_id) ? prev.filter(id => id !== _id) : [...prev, _id]
    );
  };

  const handleDeleteVerses: () => Promise<void> = async () => {
    await deleteVerses({ ids: selectedVerses });
    // toast is needed here

    setSelectedVerses([]);
    setBottomSheetIndex(-1);
    setShouldSelect(false);
    bottomSheetRef.current?.close();
  };

  const RightComponent = (
    <View className='flex flex-row gap-2'>
      {shouldSelect && (
        <Button
          size={'icon'}
          variant={'ghost'}
          disabled={selectedVerses?.length === 0}
          onPress={() => {
            if (Platform.OS === 'web') {
              setMoveBottomSheetIndex(1);
            } else {
              setMoveBottomSheetIndex(1);
            }
          }}
        >
          <MoveCollectionIcon />
          <ThemedText>Move to collection</ThemedText>
        </Button>
      )}

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
          disabled={selectedVerses?.length === 0}
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
          <title>All Verses - Into My Heart</title>
          <meta
            name='description'
            content='View and manage all your memorized Bible verses. Delete, organize, and track your progress.'
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
        title={shouldSelect ? 'Delete Verses' : 'My Verses'}
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
          { label: 'All My Verses', href: '/verses/all-verses' },
        ]}
      />

      <View className='flex-1 pb-[18px]'>
        {isLoading && results?.length === 0 ? (
          <FlashListSkeletonLoader type='verses' gridView={gridView} />
        ) : (
          <FlatList
            key={gridView ? 'grid-myverses' : 'list-myverses'}
            data={results}
            keyExtractor={(item, index) => index.toString()}
            numColumns={gridView ? 2 : 1}
            contentContainerStyle={{ paddingHorizontal: 18 }}
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
                containerClassName={gridView ? 'flex-1' : 'w-full'}
                canCheck={false}
                canDelete={shouldSelect}
                onDeletePress={() => toggleSelectedVerse(item._id)}
                isSelectedForDelete={selectedVerses.includes(item._id)}
              />
            )}
            columnWrapperStyle={
              gridView ? { gap: 8, width: '100%' } : undefined
            }
            ItemSeparatorComponent={ItemSeparator}
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
              These verses will be removed
            </ThemedText>
            <ThemedText className='mb-6 text-center font-medium text-black dark:text-white'>
              These verses will be removed and all progress. This action cannot
              be undone.
            </ThemedText>
            <CustomButton onPress={handleDeleteVerses}>
              Remove verses
            </CustomButton>
          </View>
        </BottomSheetView>
      </BottomSheet>

      {/* Move to Collection Bottom Sheet - Mobile Only */}
      {Platform.OS !== 'web' && (
        <BottomSheet
          ref={moveBottomSheetRef}
          index={moveBottomSheetIndex}
          snapPoints={['50%']}
          enablePanDownToClose={true}
          onChange={index => setMoveBottomSheetIndex(index)}
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
          <MoveToCollectionBottomSheet
            selectedVerses={selectedVerses}
            onClose={() => {
              setMoveBottomSheetIndex(-1);
              moveBottomSheetRef.current?.close();
              setSelectedVerses([]);
              setShouldSelect(false);
            }}
          />
        </BottomSheet>
      )}

      {/* Move to Collection Modal for Web */}
      {Platform.OS === 'web' && (
        <MoveToCollectionModal
          selectedVerses={selectedVerses}
          isOpen={moveBottomSheetIndex === 1}
          onClose={() => {
            setMoveBottomSheetIndex(-1);
            setSelectedVerses([]);
            setShouldSelect(false);
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default AllVersesScreen;
