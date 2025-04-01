import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import VerseCard from '~/components/VerseCard'
import { verses } from '~/lib/constants'

const VersesTab = () => {
  return (
      <View>
        <Text style={styles.text}>Verse Suggestions</Text>
        <FlatList
            data={verses}
            keyExtractor={(item, index) => index.toString()} 
            renderItem={({ item }) => (
              <VerseCard reference={item.reference} text={item.text} onAddPress={() => console.log(`${item.text} pressed`)} />
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