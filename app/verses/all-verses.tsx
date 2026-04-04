import { View, Platform, FlatList } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import RemoveCircleIcon from '@/components/icons/RemoveCircleIcon';
import BackHeader from '@/components/BackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddVersesEmpty from '@/components/EmptyScreen/AddVersesEmpty';
import VerseCard from '@/components/Verses/VerseCard';
import ItemSeparator from '@/components/ItemSeparator';
import ThemedText from '@/components/ThemedText';
import DeleteIcon from '@/components/icons/DeleteIcon';
import BottomSheet from '@gorhom/bottom-sheet';
import { useColorScheme } from '@/hooks/useColorScheme';
import CustomButton from '@/components/CustomButton';
import CancelIcon from '@/components/icons/CancelIcon';
import { useAlert } from '@/hooks/useAlert';
import { useGridListView } from '@/store/tab-store';
import { useAuth } from '@clerk/clerk-expo';
import MoveCollectionIcon from '@/components/icons/MoveCollectionIcon';
import MoveToCollectionBottomSheet from '@/components/MoveToCollectionBottomSheet';
import MoveToCollectionModal from '@/components/MoveToCollectionModal';
import { useRouter } from 'expo-router';
import { useOfflineSyncStatus, useOfflineVerses } from '@/hooks/useOfflineData';
import { useOfflineDataStore } from '@/store/offlineDataStore';

const AllVersesScreen = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const { gridView } = useGridListView();
  const [shouldSelect, setShouldSelect] = useState(false);
  const [selectedVerses, setSelectedVerses] = useState<string[]>([]);
  const [moveBottomSheetIndex, setMoveBottomSheetIndex] = useState(-1);
  const moveBottomSheetRef = useRef<BottomSheet>(null);
  const { isDarkMode } = useColorScheme();
  const { alert } = useAlert();
  const results = useOfflineVerses();
  const deleteVerse = useOfflineDataStore(state => state.deleteVerseLocal);
  const { hasHydrated, currentUser } = useOfflineSyncStatus();
  const hasOfflineAccess = Boolean(currentUser);

  useEffect(() => {
    if (!isLoaded || !hasHydrated || isSignedIn || hasOfflineAccess) return;
    const timeoutId = setTimeout(() => {
      router.replace('/(onboarding)/onboard');
    }, 1200);
    return () => clearTimeout(timeoutId);
  }, [hasHydrated, hasOfflineAccess, isLoaded, isSignedIn, router]);

  if (!isLoaded || !hasHydrated) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center px-[18px]'>
        <ThemedText className='text-center text-base text-[#909090]'>
          Checking your session…
        </ThemedText>
      </SafeAreaView>
    );
  }

  const toggleSelectedVerse = (_id: string) => {
    setSelectedVerses(prev =>
      prev.includes(_id) ? prev.filter(id => id !== _id) : [...prev, _id]
    );
  };

  const handleDeleteVerses: () => Promise<void> = async () => {
    selectedVerses.forEach(syncId => deleteVerse(syncId));
    setSelectedVerses([]);
    setShouldSelect(false);
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
          onPress={() => {
            alert(
              'Delete Verses',
              'These verses will be removed and all progress. This action cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Remove verses',
                  style: 'destructive',
                  onPress: handleDeleteVerses,
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
      {!isSignedIn && !hasOfflineAccess ? (
        <View className='flex-1 items-center justify-center gap-3 px-[18px]'>
          <ThemedText className='text-center text-xl font-semibold'>
            Sign in required
          </ThemedText>
          <ThemedText className='max-w-sm text-center text-[#909090]'>
            Redirecting to sign in so you can access all verses.
          </ThemedText>
          <CustomButton onPress={() => router.replace('/(onboarding)/onboard')}>
            Go to Sign in
          </CustomButton>
        </View>
      ) : (
        <>
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
            <View className='px-[18px] pb-4'>
              <ThemedText className='text-sm'>{`${results.length} verses`}</ThemedText>
            </View>
            {results.length === 0 ? (
              <FlatList
                key={gridView ? 'grid-myverses' : 'list-myverses'}
                data={results}
                keyExtractor={(_item, index) => index.toString()}
                numColumns={gridView ? 2 : 1}
                contentContainerStyle={{ paddingHorizontal: 18 }}
                ListEmptyComponent={() => (
                  <>
                    <AddVersesEmpty />
                  </>
                )}
                renderItem={({ item }) => (
                  <VerseCard
                    _id={item.syncId}
                    bookName={item.bookName}
                    chapter={item.chapter}
                    verses={item.verses}
                    verseTexts={item.verseTexts}
                    containerClassName={gridView ? 'flex-1' : 'w-full'}
                    canCheck={false}
                    canDelete={shouldSelect}
                    onDeletePress={() => toggleSelectedVerse(item.syncId)}
                    isSelectedForDelete={selectedVerses.includes(item.syncId)}
                  />
                )}
                columnWrapperStyle={
                  gridView ? { gap: 8, width: '100%' } : undefined
                }
                ItemSeparatorComponent={ItemSeparator}
              />
            ) : (
              <FlatList
                key={gridView ? 'grid-myverses' : 'list-myverses'}
                data={results}
                keyExtractor={(_item, index) => index.toString()}
                numColumns={gridView ? 2 : 1}
                contentContainerStyle={{ paddingHorizontal: 18 }}
                renderItem={({ item }) => (
                  <VerseCard
                    _id={item.syncId}
                    bookName={item.bookName}
                    chapter={item.chapter}
                    verses={item.verses}
                    verseTexts={item.verseTexts}
                    containerClassName={gridView ? 'flex-1' : 'w-full'}
                    canCheck={false}
                    canDelete={shouldSelect}
                    onDeletePress={() => toggleSelectedVerse(item.syncId)}
                    isSelectedForDelete={selectedVerses.includes(item.syncId)}
                  />
                )}
                columnWrapperStyle={
                  gridView ? { gap: 8, width: '100%' } : undefined
                }
                ItemSeparatorComponent={ItemSeparator}
              />
            )}
          </View>

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
        </>
      )}
    </SafeAreaView>
  );
};

export default AllVersesScreen;
