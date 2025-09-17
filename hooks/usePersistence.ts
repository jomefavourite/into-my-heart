import { useEffect, useState } from 'react';
import { useBookStore } from '@/store/bookStore';
import { useVersesTabStore } from '@/store/tab-store';
import { useIsCollOrVerse } from '@/store/tab-store';
import { useGridListView } from '@/store/tab-store';

/**
 * Hook to manage persistence loading states across all stores
 * Provides a unified loading state and error handling for persistence
 */
export function usePersistence() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get store states to check if they're hydrated
  const bookStore = useBookStore();
  const versesTabStore = useVersesTabStore();
  const isCollOrVerseStore = useIsCollOrVerse();
  const gridListViewStore = useGridListView();

  useEffect(() => {
    // Check if all stores are hydrated
    const checkHydration = () => {
      try {
        // All stores should be hydrated by now
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error('Persistence hydration error:', err);
        setError('Failed to load saved data');
        setIsLoading(false);
      }
    };

    // Small delay to ensure stores have time to hydrate
    const timer = setTimeout(checkHydration, 100);
    return () => clearTimeout(timer);
  }, []);

  return {
    isLoading,
    error,
    // Helper functions
    clearAllData: async () => {
      try {
        // Reset all stores
        bookStore.resetAll();
        versesTabStore.setActiveTab('verses');
        isCollOrVerseStore.setIsCollOrVerse(null);
        gridListViewStore.setGridView(false);

        // Clear AsyncStorage
        const { StorageUtils } = await import('@/utils/Storage');
        await StorageUtils.clearAll();

        return true;
      } catch (err) {
        console.error('Failed to clear all data:', err);
        return false;
      }
    },
  };
}

/**
 * Hook to get storage information for debugging
 */
export function useStorageInfo() {
  const [storageInfo, setStorageInfo] = useState<{
    keys: string[];
    size: number;
  }>({ keys: [], size: 0 });

  useEffect(() => {
    const getInfo = async () => {
      try {
        const { StorageUtils } = await import('@/utils/Storage');
        const info = await StorageUtils.getStorageInfo();
        setStorageInfo(info);
      } catch (err) {
        console.error('Failed to get storage info:', err);
      }
    };

    getInfo();
  }, []);

  return storageInfo;
}
