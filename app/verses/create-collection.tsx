import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '~/components/BackHeader';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import ThemedText from '~/components/ThemedText';
import { Button } from '~/components/ui/button';
import { useRouter } from 'expo-router';
import AddIcon from '~/components/icons/AddIcon';
import { FlatList } from 'react-native';

const CreateCollection = () => {
  const router = useRouter();

  const handleCreateCollection = () => {
    // await addCollection({
    //     bookName: bookName,
    //     chapter: chapter,
    //     verses: versesList.map((v) => v.toString()),
    //     collectionName: collectionName,
    //     reviewFreq: reviewFreqValue,
    //   });
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

      <View className='px-[18px]'>
        <View className='gap-1 pb-3 '>
          <Label nativeID='collectionName'>Collection name</Label>
          <Input
            aria-aria-labelledby='collectionName'
            defaultValue=''
            placeholder='Enter goal name'
            className='dark:text-white'
          />
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

        <View>
          {/* <FlatList
          data={}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <VerseCard
              bookName={item.bookName}
              chapter={item.chapter}
              verses={item.verses}
              text={'hello'}
              onAddPress={() => console.log(`${item} pressed`)}
              // containerClassName={gridView ? 'w-[50%]' : 'w-full'}
            />
          )}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={
            gridView ? { flexDirection: 'row', flexWrap: 'wrap', gap: 10 } : {}
          }
        /> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateCollection;
