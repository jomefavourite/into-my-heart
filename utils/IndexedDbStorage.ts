export interface StorageInterface {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  getAllKeys: () => Promise<string[]>;
}

const DB_NAME = 'into-my-heart-storage';
const STORE_NAME = 'app-storage';
const KNOWN_LEGACY_KEYS = new Set([
  'offline-data-store',
  'book-store',
  'verses-tab-store',
  'is-coll-or-verse-store',
  'grid-list-view-store',
  'practice-store',
  'onboarded',
  'theme',
]);

const getLegacyStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch (error) {
    console.error('Unable to access legacy localStorage:', error);
    return null;
  }
};

class MemoryStorage implements StorageInterface {
  private storage = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) ?? null;
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
    return [...this.storage.keys()];
  }
}

class LocalStorageFallback implements StorageInterface {
  async getItem(key: string): Promise<string | null> {
    return getLegacyStorage()?.getItem(key) ?? null;
  }

  async setItem(key: string, value: string): Promise<void> {
    getLegacyStorage()?.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    getLegacyStorage()?.removeItem(key);
  }

  async clear(): Promise<void> {
    const storage = getLegacyStorage();
    if (!storage) {
      return;
    }

    KNOWN_LEGACY_KEYS.forEach(key => {
      storage.removeItem(key);
    });
  }

  async getAllKeys(): Promise<string[]> {
    const storage = getLegacyStorage();
    if (!storage) {
      return [];
    }

    return [...KNOWN_LEGACY_KEYS].filter(key => storage.getItem(key) !== null);
  }
}

class IndexedDbStorage implements StorageInterface {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private isIndexedDbAvailable() {
    return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
  }

  private getDb() {
    if (!this.isIndexedDbAvailable()) {
      throw new Error('IndexedDB is not available in this environment.');
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const request = window.indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () =>
          reject(request.error ?? new Error('Failed to open IndexedDB.'));
      });
    }

    return this.dbPromise;
  }

  private async withStore<T>(
    mode: IDBTransactionMode,
    callback: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> {
    const db = await this.getDb();

    return new Promise<T>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, mode);
      const store = transaction.objectStore(STORE_NAME);
      const request = callback(store);
      let result: T;

      request.onsuccess = () => {
        result = request.result;
      };
      request.onerror = () =>
        reject(request.error ?? new Error('IndexedDB request failed.'));
      transaction.oncomplete = () => resolve(result);
      transaction.onerror = () =>
        reject(transaction.error ?? new Error('IndexedDB transaction failed.'));
      transaction.onabort = () =>
        reject(transaction.error ?? new Error('IndexedDB transaction aborted.'));
    });
  }

  private async writeToIndexedDb(key: string, value: string) {
    await this.withStore('readwrite', store => store.put(value, key));
  }

  private async readFromIndexedDb(key: string) {
    return this.withStore('readonly', store => store.get(key));
  }

  private async removeFromIndexedDb(key: string) {
    await this.withStore('readwrite', store => store.delete(key));
  }

  private async migrateLegacyValue(key: string) {
    const legacyStorage = getLegacyStorage();
    if (!legacyStorage) {
      return null;
    }

    const legacyValue = legacyStorage.getItem(key);
    if (legacyValue === null) {
      return null;
    }

    try {
      await this.writeToIndexedDb(key, legacyValue);
      legacyStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to migrate ${key} from localStorage:`, error);
    }

    return legacyValue;
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const value = await this.readFromIndexedDb(key);
      if (typeof value === 'string') {
        return value;
      }

      return await this.migrateLegacyValue(key);
    } catch (error) {
      console.error(`IndexedDB getItem error for ${key}:`, error);
      return getLegacyStorage()?.getItem(key) ?? null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await this.writeToIndexedDb(key, value);
      getLegacyStorage()?.removeItem(key);
    } catch (error) {
      console.error(`IndexedDB setItem error for ${key}:`, error);
      getLegacyStorage()?.setItem(key, value);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await this.removeFromIndexedDb(key);
    } catch (error) {
      console.error(`IndexedDB removeItem error for ${key}:`, error);
    } finally {
      getLegacyStorage()?.removeItem(key);
    }
  }

  async clear(): Promise<void> {
    const keys = await this.getAllKeys();
    await Promise.all(keys.map(key => this.removeItem(key)));
  }

  async getAllKeys(): Promise<string[]> {
    const keys = new Set<string>();

    try {
      const indexedDbKeys = await this.withStore(
        'readonly',
        store => store.getAllKeys() as IDBRequest<IDBValidKey[]>
      );

      indexedDbKeys.forEach(key => {
        if (typeof key === 'string') {
          keys.add(key);
        }
      });
    } catch (error) {
      console.error('IndexedDB getAllKeys error:', error);
    }

    const legacyStorage = getLegacyStorage();
    if (legacyStorage) {
      KNOWN_LEGACY_KEYS.forEach(key => {
        if (legacyStorage.getItem(key) !== null) {
          keys.add(key);
        }
      });
    }

    return [...keys];
  }
}

export const createWebStorage = (): StorageInterface => {
  if (typeof window === 'undefined') {
    return new MemoryStorage();
  }

  if (typeof window.indexedDB !== 'undefined') {
    return new IndexedDbStorage();
  }

  return new LocalStorageFallback();
};
