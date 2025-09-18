import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Web-compatible storage interface
interface StorageInterface {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  getAllKeys: () => Promise<string[]>;
}

// Web storage implementation using localStorage
class WebStorage implements StorageInterface {
  async getItem(key: string): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Web storage getItem error:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Web storage setItem error:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Web storage removeItem error:', error);
    }
  }

  async clear(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Web storage clear error:', error);
    }
  }

  async getAllKeys(): Promise<string[]> {
    if (typeof window === 'undefined') return [];
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Web storage getAllKeys error:', error);
      return [];
    }
  }
}

// Memory storage fallback for SSR
class MemoryStorage implements StorageInterface {
  private storage = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }

  async getAllKeys(): Promise<string[]> {
    return Array.from(this.storage.keys());
  }
}

// Platform-aware storage factory
function createPlatformStorage(): StorageInterface {
  if (Platform.OS === 'web') {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      return new WebStorage();
    }
    // Fallback to memory storage for SSR
    return new MemoryStorage();
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
