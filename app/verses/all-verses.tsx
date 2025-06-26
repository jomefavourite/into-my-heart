import { View, Text, ScrollView } from 'react-native';
import React, { useRef, useState } from 'react';
import { Button } from '~/components/ui/button';
import RemoveCircleIcon from '~/components/icons/RemoveCircleIcon';
import BackHeader from '~/components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '~/convex/_generated/api';
import { usePaginatedQuery } from 'convex-helpers/react/cache';
import { FlatList } from 'react-native-gesture-handler';
import AddVersesEmpty from '~/components/EmptyScreen/AddVersesEmpty';
import VerseCard from '~/components/Verses/VerseCard';
import ItemSeparator from '~/components/ItemSeparator';
import ThemedText from '~/components/ThemedText';
import DeleteIcon from '~/components/icons/DeleteIcon';
import { Id } from '~/convex/_generated/dataModel';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useColorScheme } from '~/hooks/useColorScheme';
import CustomButton from '~/components/CustomButton';
import { useMutation } from 'convex/react';
import CancelIcon from '~/components/icons/CancelIcon';
import { useGridListView } from '~/store/tab-store';

const AllVersesScreen = () => {
  const { gridView } = useGridListView();
  const [shouldDelete, setShouldDelete] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState<Id<'verses'>[]>([]);
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { isDarkMode } = useColorScheme();

  const { results, status, loadMore } = usePaginatedQuery(
    api.verses.getAllVerses,
    {},
    { initialNumItems: 20 }
  );

  const deleteVerses = useMutation(api.verses.deleteVerses);

  const toggleSelectedVerse = (_id: Id<'verses'>) => {
    setSelectedToDelete((prev) =>
      prev.includes(_id) ? prev.filter((id) => id !== _id) : [...prev, _id]
    );
  };

  const handleDeleteVerses: () => Promise<void> = async () => {
    await deleteVerses({ ids: selectedToDelete });
    // toast is needed here

    setSelectedToDelete([]);
    setBottomSheetIndex(-1);
    setShouldDelete(false);
    bottomSheetRef.current?.close();
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
        title={shouldDelete ? 'Delete Verses' : 'My Verses'}
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
        RightComponent={RightComponent}
        items={[
          { label: 'Verses', href: '/verses' },
          { label: 'All My Verses', href: '/verses/all-verses' },
        ]}
      />

      <View className='flex-1 px-[18px]'>
        <FlatList
          key={gridView ? 'grid-myverses' : 'list-myverses'}
          data={results}
          keyExtractor={(item, index) => index.toString()}
          numColumns={gridView ? 2 : 1}
          ListEmptyComponent={() => (
            <>
              {/* Loading */}
              {/* <VerseCardSkeleton /> */}
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
              containerClassName={gridView ? 'w-[50%]' : 'w-full'}
              canCheck={false}
              canDelete={shouldDelete}
              onDeletePress={() => toggleSelectedVerse(item._id)}
              isSelectedForDelete={selectedToDelete.includes(item._id)}
            />
          )}
          columnWrapperStyle={
            gridView ? { justifyContent: 'space-between', gap: 8 } : undefined
          }
          ItemSeparatorComponent={ItemSeparator}
          scrollEnabled={false}
        />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={bottomSheetIndex}
        snapPoints={['25%']}
        enablePanDownToClose={true}
        onChange={(index) => setBottomSheetIndex(index)}
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
            <CustomButton onPress={handleDeleteVerses}>
              Remove verses
            </CustomButton>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default AllVersesScreen;
