import React, { useState } from 'react';
import { View, Platform } from 'react-native';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@clerk/clerk-expo';

interface MoveToCollectionModalProps {
  selectedVerses: Id<'verses'>[];
  isOpen: boolean;
  onClose: () => void;
}

const MoveToCollectionModal: React.FC<MoveToCollectionModalProps> = ({
  selectedVerses,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [hasInputError, setHasInputError] = useState(false);

  const { setCollectionName, setVerses, setSelectedVerseIds } = useBookStore();
  const { setIsCollOrVerse: setTabStore } = useIsCollOrVerse();

  // Fetch existing collections
  const collections = useQuery(
    api.collections.getCollections,
    isOpen && isLoaded && isSignedIn ? {} : 'skip'
  );

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>
            Move {selectedVerses.length} verse
            {selectedVerses.length !== 1 ? 's' : ''} to Collection
          </DialogTitle>
          <DialogDescription>
            Choose an existing collection or create a new one to organize your
            verses.
          </DialogDescription>
        </DialogHeader>

        <View className='space-y-4'>
          {!showCreateNew ? (
            <>
              <View className='flex-row items-center justify-between'>
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
                <View className='max-h-60'>
                  <FlatList
                    data={collections}
                    keyExtractor={item => item._id}
                    renderItem={renderCollectionItem}
                    ItemSeparatorComponent={ItemSeparator}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              ) : (
                <View className='flex-1 items-center justify-center py-8'>
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
            <View className='space-y-4'>
              <View className='gap-1'>
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
      </DialogContent>
    </Dialog>
  );
};

export default MoveToCollectionModal;
