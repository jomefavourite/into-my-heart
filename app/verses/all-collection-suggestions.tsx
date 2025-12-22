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
import { useMutation, useQuery } from 'convex/react';
import CancelIcon from '@/components/icons/CancelIcon';
import { useGridListView } from '@/store/tab-store';
import { useAuth } from '@clerk/clerk-expo';
import FlashListSkeletonLoader from '@/components/FlashListSkeletonLoader';
import CollectionSuggestionCard from '@/components/Verses/CollectionSuggestionCard';

const AllCollectionSuggestions = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { gridView } = useGridListView();

  const { isDarkMode } = useColorScheme();

  const addCollectionSuggestionToCollection = useMutation(
    api.collectionSuggestions.addCollectionSuggestionToUser
  );

  const results =
    useQuery(
      api.collectionSuggestions.getAllCollectionSuggestions,
      isSignedIn && isLoaded ? {} : 'skip'
    ) ?? [];

  const isLoading = !results;

  const handleAddCollectionSuggestion = async (collectionData: any) => {
    try {
      await addCollectionSuggestionToCollection({
        suggestionId: collectionData._id,
      });
      // The UI will automatically update due to Convex reactivity
    } catch (error) {
      console.error('Error adding collection suggestion:', error);
      // You might want to show an alert here
    }
  };

  return (
    <SafeAreaView className='flex-1'>
      {Platform.OS === 'web' && (
        <>
          <title>Collection Suggestions - Into My Heart</title>
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
        title={'Collection Suggestions'}
        items={[
          { label: 'Collections', href: '/verses' },
          {
            label: 'Collection Suggestions',
            href: '/verses/all-collection-suggestions',
          },
        ]}
      />

      <View className='flex-1 pb-[18px]'>
        {isLoading ? (
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
              <CollectionSuggestionCard
                _id={item._id}
                collectionName={item.collectionName}
                versesLength={item.versesLength}
                collectionVerses={item.collectionVerses}
                containerClassName={gridView ? 'flex-1' : 'w-full'}
                canCheck={true}
                onAddPress={() => handleAddCollectionSuggestion(item)}
              />
            )}
            columnWrapperStyle={
              gridView ? { gap: 8, width: '100%' } : undefined
            }
            ItemSeparatorComponent={ItemSeparator}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default AllCollectionSuggestions;
