import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '~/components/BackHeader';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import ThemedText from '~/components/ThemedText';
import { Button } from '~/components/ui/button';
import { useRouter } from 'expo-router';
import AddIcon from '~/components/icons/AddIcon';
import { FlatList } from 'react-native';
import { useBookStore } from '~/store/bookStore';
import VerseCard from '~/components/Verses/VerseCard';
import ItemSeparator from '~/components/ItemSeparator';
import CustomButton from '~/components/CustomButton';
import ArrowRightIcon from '~/components/icons/ArrowRightIcon';
import AddVersesEmpty from '~/components/EmptyScreen/AddVersesEmpty';
import { useMutation } from 'convex/react';
import { api } from '~/convex/_generated/api';

const CreateCollection = () => {
  const router = useRouter();

  const { collectionName, collectionVerses, setCollectionName, resetAll } =
    useBookStore();

  const addCollection = useMutation(api.collections.addCollection);

  const [hasInputError, setHasInputError] = useState(false);

  const handleCreateCollection = async () => {
    if (!collectionName) {
      setHasInputError(true);
      return;
    }

    setHasInputError(false);

    const mappedCollectionVerses = collectionVerses.map((verse) => ({
      ...verse,
      reviewFreq: verse.reviewFreq ?? '',
    }));

    const payload = {
      collectionName,
      collectionVerses: mappedCollectionVerses,
      versesLength: mappedCollectionVerses.length,
    };

    try {
      await addCollection(payload);
      resetAll();
      router.push('/verses#collections');
    } catch (error) {
      console.error('Error adding collection:', error);
    }
  };
  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        title='Create Collection'
        items={[
          { label: 'Verses', href: '/verses' },
          { label: 'Create Collection', href: '/verses/create-collection' },
        ]}
      />

      <View className='flex-1 px-[18px]'>
        <View className='gap-1 pb-3 '>
          <Label nativeID='collectionName'>Collection name</Label>
          <Input
            aria-aria-labelledby='collectionName'
            defaultValue={collectionName}
            placeholder='Enter goal name'
            className={`dark:text-white ${hasInputError ? 'border border-red-500' : ''}`}
            onChangeText={(text) => {
              setCollectionName(text);
              if (hasInputError && text.trim()) setHasInputError(false);
            }}
          />
          {hasInputError && (
            <ThemedText size={12} className='text-red-500 text-sm mt-1'>
              Collection name is required
            </ThemedText>
          )}
        </View>

        <View className='flex-row items-center justify-between'>
          <ThemedText>Verses</ThemedText>

          <Button
            size={'icon'}
            variant={'ghost'}
            onPress={() => router.push('/verses/select-book')}
          >
            <AddIcon stroke='white' />
          </Button>
        </View>

        <View className='flex-1 justify-between'>
          {collectionVerses.length < 1 && <AddVersesEmpty />}

          <FlatList
            data={collectionVerses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <VerseCard
                bookName={item.bookName}
                chapter={item.chapter}
                verses={item.verses}
                onAddPress={() => console.log(`${item} pressed`)}
                canCheck={false}
                // containerClassName={gridView ? 'w-[50%]' : 'w-full'}
              />
            )}
            ItemSeparatorComponent={ItemSeparator}
          />

          <View className='my-5'>
            <CustomButton
              disabled={collectionVerses.length < 1}
              onPress={handleCreateCollection}
            >
              Create Collection
            </CustomButton>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateCollection;
