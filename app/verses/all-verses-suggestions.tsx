import { View, Text, ScrollView, Platform } from 'react-native';
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
import { useMutation, useQuery } from 'convex/react';
import CancelIcon from '@/components/icons/CancelIcon';
import { useGridListView } from '@/store/tab-store';
import { FlashList } from '@shopify/flash-list';
import { useAuth } from '@clerk/clerk-expo';
import FlashListSkeletonLoader from '@/components/FlashListSkeletonLoader';

const AllVersesSuggestion = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { gridView } = useGridListView();

  const { isDarkMode } = useColorScheme();

  const addVerseSuggestionToUser = useMutation(
    api.verseSuggestions.addVerseSuggestionToUser
  );

  const results =
    useQuery(
      api.verseSuggestions.getAvailableVerseSuggestions,
      isSignedIn && isLoaded ? { take: 50 } : 'skip'
    ) ?? [];

  const isLoading = !results;

  const handleAddVerseSuggestion = async (verseData: any) => {
    try {
      await addVerseSuggestionToUser({
        suggestionId: verseData._id,
      });
      // The UI will automatically update due to Convex reactivity
    } catch (error) {
      console.error('Error adding verse suggestion:', error);
      // You might want to show an alert here
    }
  };

  return (
    <SafeAreaView className='flex-1'>
      {Platform.OS === 'web' && (
        <>
          <title>Verse Suggestions - Into My Heart</title>
          <meta
            name='description'
            content='Browse curated Bible verse suggestions. Discover new verses to memorize and study.'
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
        title={'Verse Suggestions'}
        items={[
          { label: 'Verses', href: '/verses' },
          {
            label: 'Verse Suggestions',
            href: '/verses/all-verses-suggestions',
          },
        ]}
      />

      <View className='flex-1 px-[18px]'>
        {isLoading ? (
          <FlashListSkeletonLoader type='verses' gridView={gridView} />
        ) : (
          <FlashList
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
              <VerseCard
                bookName={item.bookName}
                chapter={item.chapter}
                verses={item.verses}
                verseTexts={item.verseTexts}
                containerClassName={gridView ? 'w-[50%]' : 'w-full'}
                canCheck={true}
                onAddPress={() => handleAddVerseSuggestion(item)}
              />
            )}
            ItemSeparatorComponent={ItemSeparator}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default AllVersesSuggestion;
