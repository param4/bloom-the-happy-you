import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Narrow key-value abstraction — the single place JSON (de)serialization
 * happens. Repositories depend on this interface, never on AsyncStorage
 * directly (DIP), so storage can be swapped (SecureStore, MMKV, remote…)
 * without touching any repository.
 */
export interface IKeyValueStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}

export class AsyncStorageKvStore implements IKeyValueStore {
  async get<T>(key: string): Promise<T | null> {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      // Corrupt value — treat as absent rather than crashing callers (LSP:
      // every impl promises "null when unavailable", never a throw).
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }
}
