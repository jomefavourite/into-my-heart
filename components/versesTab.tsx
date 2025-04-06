import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import VerseCard from '~/components/VerseCard'
import { verses } from '~/lib/constants'
import { cn } from '~/lib/utils'
import ThemedText from './ThemedText'

type VersesTabProps = {
  view?: 'list' | 'grid';
}

const VersesTab = ({ view }: VersesTabProps) => {
  const itemClassName = view === 'grid' ? 'w-[49%]' : ' ';

  return (
      <View>
      <ThemedText size={14} variant='medium' numberOfLines={2}>
        Verse Suggestions
      </ThemedText>
        <FlatList
            data={verses}
            keyExtractor={(item, index) => index.toString()} 
            renderItem={({ item }) => (
              <ScrollView className={cn('', itemClassName)}>
                <VerseCard view={view} reference={item.reference} text={item.text} onAddPress={() => console.log(`${item.text} pressed`)} />
              </ScrollView>
            )}
          />
      </View>
  )
}

export default VersesTab


const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: 500
  }
})