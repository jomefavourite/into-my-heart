import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import ThemedText from '@/components/ThemedText';
import CustomButton from '@/components/CustomButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FlatList } from 'react-native';
import ItemSeparator from '@/components/ItemSeparator';
import AddIcon from '@/components/icons/AddIcon';
import { useRouter } from 'expo-router';
import { useBookStore } from '@/store/bookStore';
import { useIsCollOrVerse } from '@/store/tab-store';

interface MoveToCollectionBottomSheetProps {
  selectedVerses: Id<'verses'>[];
  onClose: () => void;
}

const MoveToCollectionBottomSheet: React.FC<
  MoveToCollectionBottomSheetProps
> = ({ selectedVerses, onClose }) => {
  const router = useRouter();
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [hasInputError, setHasInputError] = useState(false);

  const {
    setCollectionName,
    setVerses,
    setIsCollOrVerse,
    setSelectedVerseIds,
  } = useBookStore();
  const { setIsCollOrVerse: setTabStore } = useIsCollOrVerse();

  // Fetch existing collections
  const collections = useQuery(api.collections.getCollections);

  const handleSelectExistingCollection = (collectionId: Id<'collections'>) => {
    // Store the selected verse IDs in the store
    setSelectedVerseIds(selectedVerses);
    // Navigate to create-collection page with the selected collection ID
    router.push(
      `/verses/create-collection?collectionId=${collectionId}&moveVerses=true`
    );
    onClose();
  };

  const handleCreateNewCollection = () => {
    if (!newCollectionName.trim()) {
      setHasInputError(true);
      return;
    }

    setHasInputError(false);
    setCollectionName(newCollectionName.trim());
    setSelectedVerseIds(selectedVerses); // Store the selected verse IDs
    setTabStore('collections');
    setVerses([]); // Clear any existing verses
    router.push('/verses/create-collection?moveVerses=true');
    onClose();
  };

  const renderCollectionItem = ({ item }: { item: any }) => (
    <View className='py-3'>
      <Button
        variant='ghost'
        className='w-full justify-start p-0'
        onPress={() => handleSelectExistingCollection(item._id)}
      >
        <View className='w-full flex-row items-center justify-between'>
          <View className='flex-1'>
            <ThemedText className='text-base font-medium'>
              {item.collectionName}
            </ThemedText>
            <ThemedText className='text-sm text-gray-500 dark:text-gray-400'>
              {item.versesLength} verse{item.versesLength !== 1 ? 's' : ''}
            </ThemedText>
          </View>
        </View>
      </Button>
    </View>
  );

  return (
    <BottomSheetView className='flex-1 p-4'>
      <View className='mx-auto mb-6 mt-6 flex-1'>
        <ThemedText className='mb-4 text-center text-lg font-medium text-black dark:text-white'>
          Move {selectedVerses.length} verse
          {selectedVerses.length !== 1 ? 's' : ''} to Collection
        </ThemedText>

        {!showCreateNew ? (
          <>
            <View className='mb-4 flex-row items-center justify-between'>
              <ThemedText className='text-base font-medium'>
                Existing Collections
              </ThemedText>
              <Button
                size='sm'
                variant='outline'
                onPress={() => setShowCreateNew(true)}
                className='flex-row items-center gap-2'
              >
                <AddIcon stroke='currentColor' />
                <ThemedText>New Collection</ThemedText>
              </Button>
            </View>

            {collections && collections.length > 0 ? (
              <FlatList
                data={collections}
                keyExtractor={item => item._id}
                renderItem={renderCollectionItem}
                ItemSeparatorComponent={ItemSeparator}
                className='flex-1'
              />
            ) : (
              <View className='flex-1 items-center justify-center'>
                <ThemedText className='mb-4 text-center text-gray-500 dark:text-gray-400'>
                  No collections found
                </ThemedText>
                <CustomButton onPress={() => setShowCreateNew(true)}>
                  Create Your First Collection
                </CustomButton>
              </View>
            )}
          </>
        ) : (
          <View className='flex-1'>
            <View className='mb-6 gap-1'>
              <Label nativeID='newCollectionName'>Collection name</Label>
              <Input
                aria-labelledby='newCollectionName'
                placeholder='Enter collection name'
                value={newCollectionName}
                className={`dark:text-white ${hasInputError ? 'border border-red-500' : ''}`}
                onChangeText={text => {
                  setNewCollectionName(text);
                  if (hasInputError && text.trim()) setHasInputError(false);
                }}
              />
              {hasInputError && (
                <ThemedText className='mt-1 text-xs text-red-500'>
                  Collection name is required
                </ThemedText>
              )}
            </View>

            <View className='flex-row gap-3'>
              <CustomButton
                variant='outline'
                className='flex-1'
                onPress={() => {
                  setShowCreateNew(false);
                  setNewCollectionName('');
                  setHasInputError(false);
                }}
              >
                Cancel
              </CustomButton>
              <CustomButton
                className='flex-1'
                onPress={handleCreateNewCollection}
              >
                Create Collection
              </CustomButton>
            </View>
          </View>
        )}
      </View>
    </BottomSheetView>
  );
};

export default MoveToCollectionBottomSheet;
