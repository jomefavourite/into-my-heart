import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { PlatformStorage } from '@/utils/PlatformStorage';

type TokenCache = {
  getToken: (key: string) => Promise<string | null>;
  saveToken: (key: string, token: string) => Promise<void>;
};

const createTokenCache = (): TokenCache => {
  return {
    getToken: async (key: string) => {
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          console.log(`${key} was used 🔐 \n`);
        } else {
          console.log('No values stored under key: ' + key);
        }
        return item;
      } catch (error) {
        console.error('secure store get item error: ', error);
        await SecureStore.deleteItemAsync(key);
        return null;
      }
    },
    saveToken: (key: string, token: string) => {
      return SecureStore.setItemAsync(key, token);
    },
  };
};

const createWebTokenCache = (): TokenCache => {
  return {
    getToken: async (key: string) => {
      try {
        return await PlatformStorage.getItem(key);
      } catch (error) {
        console.error('web token cache get item error: ', error);
        return null;
      }
    },
    saveToken: async (key: string, token: string) => {
      try {
        await PlatformStorage.setItem(key, token);
      } catch (error) {
        console.error('web token cache save error: ', error);
      }
    },
  };
};

export const tokenCache =
  Platform.OS === 'web' ? createWebTokenCache() : createTokenCache();
