import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createWebStorage,
  type StorageInterface,
} from '@/utils/IndexedDbStorage';

// Platform-aware storage factory
function createPlatformStorage(): StorageInterface {
  if (Platform.OS === 'web') {
    return createWebStorage();
  }

  // Use AsyncStorage for native platforms with type compatibility
  return {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
    removeItem: AsyncStorage.removeItem,
    clear: AsyncStorage.clear,
    getAllKeys: async () => [...(await AsyncStorage.getAllKeys())],
  };
}

// Export the platform-appropriate storage
export const PlatformStorage = createPlatformStorage();

// Export storage utilities that work across all platforms
export const StorageUtils = {
  // Safe storage operations with fallbacks
  async setItem(key: string, value: string): Promise<boolean> {
    try {
      await PlatformStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Failed to store ${key}:`, error);
      return false;
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      return await PlatformStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to retrieve ${key}:`, error);
      return null;
    }
  },

  async removeItem(key: string): Promise<boolean> {
    try {
      await PlatformStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
      return false;
    }
  },

  // Clear all app data (useful for debugging or reset)
  async clearAll(): Promise<boolean> {
    try {
      await PlatformStorage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear storage:', error);
      return false;
    }
  },

  // Get storage info
  async getStorageInfo(): Promise<{ keys: string[]; size: number }> {
    try {
      const keys = await PlatformStorage.getAllKeys();
      return { keys: [...keys], size: keys.length };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { keys: [], size: 0 };
    }
  },
};
