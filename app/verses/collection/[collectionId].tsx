import { Platform, View } from 'react-native';
import React, { useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from 'convex-helpers/react/cache';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedText from '@/components/ThemedText';
import BackHeader from '@/components/BackHeader';
import { Button } from '@/components/ui/button';
import RemoveCircleIcon from '@/components/icons/RemoveCircleIcon';
import { Id } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';
import { FlatList } from 'react-native';
import AddVersesEmpty from '@/components/EmptyScreen/AddVersesEmpty';
import VerseCard from '@/components/Verses/VerseCard';
import ItemSeparator from '@/components/ItemSeparator';
import { useGridListView } from '@/store/tab-store';
import CustomButton from '@/components/CustomButton';
import CancelIcon from '@/components/icons/CancelIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useMutation } from 'convex/react';
import { useAuth } from '@clerk/clerk-expo';
import FlashListSkeletonLoader from '@/components/FlashListSkeletonLoader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import MoreVerticalIcon from '@/components/icons/MoreVerticalIcon';
import { useBookStore } from '@/store/bookStore';

export default function CollectionPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { collectionId } = useLocalSearchParams();
  const { gridView } = useGridListView();
  const [shouldDelete, setShouldDelete] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState<number[]>([]);
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { isDarkMode } = useColorScheme();
  const router = useRouter();
  const {
    setCollectionName,
    setCollectionVerses,
    setCollectionVersesArray,
    setVerses,
    setIsCollectionUpdate,
  } = useBookStore();

  const collection = useQuery(
    api.collections.getCollectionById,
    isSignedIn && isLoaded && collectionId
      ? {
          id: collectionId as Id<'collections'>,
        }
      : 'skip'
  );

  const updateCollectionVerses = useMutation(
    api.collections.updateCollectionVerses
  );

  const toggleSelectedVerse = (index: number) => {
    setSelectedToDelete(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleDeleteCollections: () => Promise<void> = async () => {
    await updateCollectionVerses({
      id: collectionId as Id<'collections'>,
      collectionVerses:
        collection?.collectionVerses?.filter(
          (_, index) => !selectedToDelete.includes(index)
        ) ?? [],
    });
    // toast is needed here

    setSelectedToDelete([]);
    setBottomSheetIndex(-1);
    setShouldDelete(false);
    bottomSheetRef.current?.close();
  };

  const handleAddVerses = () => {
    setCollectionName(collection?.collectionName ?? '');
    setVerses([]); // Clear any existing verses before loading collection verses

    // Use setCollectionVersesArray to replace the entire array instead of adding to it
    // This prevents duplicates when editing the same collection multiple times
    const versesArray =
      collection?.collectionVerses.map(verse => ({
        bookName: verse.bookName,
        chapter: verse.chapter,
        verses: verse.verses,
        reviewFreq: verse.reviewFreq,
        verseTexts: verse.verseTexts,
      })) ?? [];

    setCollectionVersesArray(versesArray);

    setIsCollectionUpdate(true);
    router.push(`/verses/create-collection?id=${collectionId}`);
  };

  const RightComponent = shouldDelete ? (
    <View className='flex flex-row gap-2'>
      <Button
        size={'icon'}
        variant={'ghost'}
        disabled={selectedToDelete?.length === 0}
        onPress={() => setBottomSheetIndex(1)}
      >
        <DeleteIcon />
      </Button>
      {Platform.OS === 'web' && (
        <Button
          size={'icon'}
          variant={'ghost'}
          onPress={() => {
            setShouldDelete(false);
            setSelectedToDelete([]);
          }}
        >
          <CancelIcon />
        </Button>
      )}
    </View>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={'icon'} variant={'ghost'}>
          <MoreVerticalIcon stroke='white' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mr-4'>
        <DropdownMenuItem
          onPress={() => {
            router.push(
              `/verses/add-verses-to-collection?collectionId=${collectionId}`
            );
          }}
        >
          <ThemedText className='text-sm font-medium'>Add verses</ThemedText>
        </DropdownMenuItem>
        <DropdownMenuItem onPress={handleAddVerses}>
          <ThemedText className='text-sm font-medium'>
            Edit collection
          </ThemedText>
        </DropdownMenuItem>
        <DropdownMenuItem
          onPress={() => {
            setShouldDelete(true);
            setSelectedToDelete([]);
          }}
        >
          <ThemedText className='text-sm font-medium'>Delete Verses</ThemedText>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        title={shouldDelete ? 'Delete Verses' : collection?.collectionName}
        BreadcrumbRightComponent={RightComponent}
        LiftComponent={
          shouldDelete ? (
            <Button
              size={'icon'}
              variant={'ghost'}
              onPress={() => {
                setShouldDelete(false);
                setSelectedToDelete([]);
              }}
            >
              <CancelIcon />
            </Button>
          ) : null
        }
        RightComponent={RightComponent}
        items={[
          { label: 'Verses', href: '/verses' },
          { label: 'All collections', href: '/verses/all-collections' },
          { label: 'Collection Page', href: `/verses/${collectionId}` },
        ]}
      />
      <View className='flex-1 justify-between px-[18px] pb-[18px]'>
        <ThemedText className='hidden text-lg font-bold md:block'>
          {collection?.collectionName}
        </ThemedText>

        {collection === undefined ? (
          <FlashListSkeletonLoader type='verses' gridView={gridView} />
        ) : (
          <FlatList
            key={gridView ? 'grid-myverses' : 'list-myverses'}
            data={collection?.collectionVerses}
            keyExtractor={(item, index) => index.toString()}
            numColumns={gridView ? 2 : 1}
            ListEmptyComponent={() => (
              <>
                <AddVersesEmpty />
              </>
            )}
            renderItem={({ item, index }) => (
              <VerseCard
                bookName={item.bookName}
                chapter={item.chapter}
                verses={item.verses}
                verseTexts={item.verseTexts}
                containerClassName={gridView ? 'flex-1' : 'w-full'}
                canCheck={false}
                canDelete={shouldDelete}
                onDeletePress={() => toggleSelectedVerse(index)}
                isSelectedForDelete={selectedToDelete.includes(index)}
                noRoute={true}
              />
            )}
            columnWrapperStyle={
              gridView ? { gap: 8, width: '100%' } : undefined
            }
            ItemSeparatorComponent={ItemSeparator}
            // scrollEnabled={false}
          />
        )}

        <CustomButton>Start practice</CustomButton>
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
            <CustomButton onPress={handleDeleteCollections}>
              Remove verses
            </CustomButton>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}
