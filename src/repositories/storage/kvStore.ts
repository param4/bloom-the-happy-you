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
  /**
   * Atomic read-modify-write: `updater` receives the current value (null when
   * absent) and returns the next one. Updates to the same key are serialized,
   * so two concurrent updates can never overwrite each other's changes.
   */
  update<T>(key: string, updater: (current: T | null) => T): Promise<T>;
}

export class AsyncStorageKvStore implements IKeyValueStore {
  /**
   * Tail of the in-flight operation chain per key. Every write is appended to
   * its key's chain, so read-modify-writes run one at a time per key (the
   * lost-update fix for double-taps and cross-screen settings writes).
   */
  private readonly queues = new Map<string, Promise<unknown>>();

  async get<T>(key: string): Promise<T | null> {
    return this.read<T>(key);
  }

  set<T>(key: string, value: T): Promise<void> {
    return this.enqueue(key, () => this.write(key, value));
  }

  remove(key: string): Promise<void> {
    return this.enqueue(key, () => AsyncStorage.removeItem(key));
  }

  update<T>(key: string, updater: (current: T | null) => T): Promise<T> {
    return this.enqueue(key, async () => {
      const next = updater(await this.read<T>(key));
      await this.write(key, next);
      return next;
    });
  }

  private enqueue<T>(key: string, task: () => Promise<T>): Promise<T> {
    const tail = this.queues.get(key) ?? Promise.resolve();
    // Run after the previous operation settles, whether it succeeded or not.
    const run = tail.then(task, task);
    this.queues.set(
      key,
      run.then(
        () => undefined,
        () => undefined,
      ),
    );
    return run;
  }

  private async read<T>(key: string): Promise<T | null> {
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

  private write<T>(key: string, value: T): Promise<void> {
    return AsyncStorage.setItem(key, JSON.stringify(value));
  }
}
