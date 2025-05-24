import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import VerseCard from '~/components/VerseCard';
import { verses } from '~/lib/constants';
import ThemedText from '../ThemedText';
import ItemSeparator from '../ItemSeparator';

type VersesTabProps = {
  gridView: boolean;
};

const VersesTab = ({ gridView }: VersesTabProps) => {
  return (
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
