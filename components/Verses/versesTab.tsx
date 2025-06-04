import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import VerseCard from '~/components/VerseCard';
import { verses } from '~/lib/constants';
import ThemedText from '../ThemedText';
import ItemSeparator from '../ItemSeparator';
import { useQuery } from 'convex/react';
import { api } from '~/convex/_generated/api';

type VersesTabProps = {
  gridView: boolean;
};

const VersesTab = ({ gridView }: VersesTabProps) => {
  const getVerses = useQuery(api.verses.getVerses);

  console.log(getVerses, 'getVerses');

  return (
    <View>
      <View>
        <ThemedText style={styles.text}>My Verse </ThemedText>
        <FlatList
          data={getVerses}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <VerseCard
              bookName={item.bookName}
              chapter={item.chapter}
              text={'hello'}
              onAddPress={() => console.log(`${item} pressed`)}
              // containerClassName={gridView ? 'w-[50%]' : 'w-full'}
            />
          )}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={
            gridView ? { flexDirection: 'row', flexWrap: 'wrap', gap: 10 } : {}
          }
        />
      </View>
      <View>
        <ThemedText style={styles.text}>Verse Suggestions</ThemedText>
        <FlatList
          data={verses}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <VerseCard
              reference={item.reference}
              text={item.text}
              onAddPress={() => console.log(`${item.text} pressed`)}
              // containerClassName={gridView ? 'w-[50%]' : 'w-full'}
            />
          )}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={
            gridView ? { flexDirection: 'row', flexWrap: 'wrap', gap: 10 } : {}
          }
        />
      </View>
    </View>
  );
};

export default VersesTab;

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: 500,
  },
});
