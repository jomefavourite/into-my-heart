import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { usePersistence, useStorageInfo } from '~/hooks/usePersistence';
import { useBookStore } from '~/store/bookStore';
import { useVersesTabStore } from '~/store/tab-store';
import { useIsCollOrVerse } from '~/store/tab-store';
import { useGridListView } from '~/store/tab-store';
import ThemedText from './ThemedText';
import CustomButton from './CustomButton';

/**
 * Debug component for monitoring and managing persistence
 * Only show in development builds
 */
export default function PersistenceDebug() {
  const [isVisible, setIsVisible] = useState(false);
  const { isLoading, error, clearAllData } = usePersistence();
  const storageInfo = useStorageInfo();

  // Get current store states
  const bookStore = useBookStore();
  const versesTabStore = useVersesTabStore();
  const isCollOrVerseStore = useIsCollOrVerse();
  const gridListViewStore = useGridListView();

  // Only show in development
  if (__DEV__ === false) {
    return null;
  }

  const handleClearAll = async () => {
    Alert.alert(
      'Clear All Data',
      'This will clear all saved data including collections. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            const success = await clearAllData();
            if (success) {
              Alert.alert('Success', 'All data cleared');
            } else {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  if (!isVisible) {
    return (
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        style={{
          position: 'absolute',
          top: 50,
          right: 10,
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: 8,
          borderRadius: 4,
        }}
      >
        <ThemedText style={{ color: 'white', fontSize: 12 }}>Debug</ThemedText>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        zIndex: 9999,
        padding: 20,
      }}
    >
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <ThemedText
            style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}
          >
            Persistence Debug
          </ThemedText>
          <TouchableOpacity onPress={() => setIsVisible(false)}>
            <ThemedText style={{ color: 'white', fontSize: 18 }}>✕</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        <View style={{ marginBottom: 15 }}>
          <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>
            Loading State:
          </ThemedText>
          <ThemedText style={{ color: isLoading ? 'yellow' : 'green' }}>
            {isLoading ? 'Loading...' : 'Loaded'}
          </ThemedText>
        </View>

        {/* Error State */}
        {error && (
          <View style={{ marginBottom: 15 }}>
            <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>
              Error:
            </ThemedText>
            <ThemedText style={{ color: 'red' }}>{error}</ThemedText>
          </View>
        )}

        {/* Storage Info */}
        <View style={{ marginBottom: 15 }}>
          <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>
            Storage Info:
          </ThemedText>
          <ThemedText style={{ color: 'white' }}>
            Keys: {storageInfo.size}
          </ThemedText>
          <ThemedText style={{ color: 'white' }}>
            Keys: {storageInfo.keys.join(', ')}
          </ThemedText>
        </View>

        {/* Store States */}
        <View style={{ marginBottom: 15 }}>
          <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>
            Store States:
          </ThemedText>

          <ThemedText style={{ color: 'white' }}>
            Book Store: {bookStore.collectionName || 'No collection'}
          </ThemedText>
          <ThemedText style={{ color: 'white' }}>
            Collection Verses: {bookStore.collectionVerses.length}
          </ThemedText>
          <ThemedText style={{ color: 'white' }}>
            Active Tab: {versesTabStore.activeTab}
          </ThemedText>
          <ThemedText style={{ color: 'white' }}>
            Mode: {isCollOrVerseStore.isCollOrVerse || 'None'}
          </ThemedText>
          <ThemedText style={{ color: 'white' }}>
            Grid View: {gridListViewStore.gridView ? 'Yes' : 'No'}
          </ThemedText>
        </View>

        {/* Actions */}
        <View style={{ marginTop: 20 }}>
          <CustomButton onPress={handleClearAll} variant='outline'>
            Clear All Data
          </CustomButton>
        </View>
      </ScrollView>
    </View>
  );
}
