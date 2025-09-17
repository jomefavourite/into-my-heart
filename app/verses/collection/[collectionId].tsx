import { View } from 'react-native';
import React, { useRef, useState } from 'react';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import MoreVerticalIcon from '@/components/icons/MoreVerticalIcon';
import { useBookStore } from '@/store/bookStore';

export default function CollectionPage() {
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
    setVerses,
    setIsCollectionUpdate,
  } = useBookStore();

  const collection = useQuery(api.collections.getCollectionById, {
    id: collectionId as Id<'collections'>,
  });

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

    collection?.collectionVerses.forEach(verse => {
      setCollectionVerses({
        bookName: verse.bookName,
        chapter: verse.chapter,
        verses: verse.verses,
        reviewFreq: verse.reviewFreq,
        verseTexts: verse.verseTexts,
      });
    });

    setIsCollectionUpdate(true);
    router.push(`/verses/create-collection?id=${collectionId}`);
  };

  const RightComponent = (
    <>
      {!shouldDelete && (
        <Button
          size={'icon'}
          variant={'ghost'}
          onPress={() => setShouldDelete(true)}
        >
          <RemoveCircleIcon />
        </Button>
      )}

      {shouldDelete && (
        <Button
          size={'icon'}
          variant={'ghost'}
          disabled={selectedToDelete?.length === 0}
          onPress={() => setBottomSheetIndex(1)}
        >
          <DeleteIcon />
        </Button>
      )}
    </>
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
              onPress={() => setShouldDelete(false)}
            >
              <CancelIcon />
            </Button>
          ) : null
        }
        RightComponent={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size={'icon'} variant={'ghost'}>
                  <MoreVerticalIcon stroke='white' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='mr-4'>
                <DropdownMenuItem onPress={handleAddVerses}>
                  <ThemedText size={14} variant='medium'>
                    Edit collection
                  </ThemedText>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onPress={() => {
                    // setIsCollOrVerse('collections');
                  }}
                >
                  <ThemedText size={14} variant='medium'>
                    Delete Verses
                  </ThemedText>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
        items={[
          { label: 'Verses', href: '/verses' },
          { label: 'All collections', href: '/verses/all-collections' },
          { label: 'Collection Page', href: `/verses/${collectionId}` },
        ]}
      />
      <View className='flex-1 justify-between px-[18px] pb-[18px]'>
        <ThemedText className='text-lg font-bold hidden md:block'>
          {collection?.collectionName}
        </ThemedText>

        <FlatList
          key={gridView ? 'grid-myverses' : 'list-myverses'}
          data={collection?.collectionVerses}
          keyExtractor={(item, index) => index.toString()}
          numColumns={gridView ? 2 : 1}
          ListEmptyComponent={() => (
            <>
              {/* Loading */}
              {/* <VerseCardSkeleton /> */}
              <AddVersesEmpty />
            </>
          )}
          renderItem={({ item, index }) => (
            <VerseCard
              bookName={item.bookName}
              chapter={item.chapter}
              verses={item.verses}
              verseTexts={item.verseTexts}
              containerClassName={gridView ? 'w-[50%]' : 'w-full'}
              canCheck={false}
              canDelete={shouldDelete}
              onDeletePress={() => toggleSelectedVerse(index)}
              isSelectedForDelete={selectedToDelete.includes(index)}
              noRoute={true}
            />
          )}
          columnWrapperStyle={
            gridView ? { justifyContent: 'space-between', gap: 8 } : undefined
          }
          ItemSeparatorComponent={ItemSeparator}
          // scrollEnabled={false}
        />

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
          <View className='mx-auto mt-6 mb-6'>
            <ThemedText className='text-black text-center font-medium dark:text-white mb-6'>
              These verses will be removed
            </ThemedText>
            <ThemedText className='text-black text-center font-medium dark:text-white mb-6'>
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
