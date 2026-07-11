import * as FileSystem from 'expo-file-system/legacy';

import { newId } from '@/lib/ids';

import type { IMediaStore } from './interfaces';

/**
 * Extension from a URI's final path segment, or null when it has none —
 * `split('.').pop()` alone would return the whole URI for dot-less inputs
 * (e.g. Android `content://…/1234`), producing an invalid destination path.
 */
const extensionOf = (uri: string): string | null => {
  const name = uri.split('?')[0].split('/').pop() ?? '';
  const dot = name.lastIndexOf('.');
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : '';
  return /^[a-z0-9]{1,8}$/.test(ext) ? ext : null;
};

/**
 * Copies volatile camera/picker cache files into the app's document
 * directory so they survive cache eviction. The only file-system-aware
 * module in the app.
 */
export class MediaStore implements IMediaStore {
  private readonly root = `${FileSystem.documentDirectory}bloom/`;

  persistVideo(tempUri: string): Promise<string> {
    return this.persist(tempUri, 'videos', 'mov');
  }

  persistImage(tempUri: string): Promise<string> {
    return this.persist(tempUri, 'images', 'jpg');
  }

  persistAudio(tempUri: string): Promise<string> {
    return this.persist(tempUri, 'audio', 'm4a');
  }

  async remove(uri: string): Promise<void> {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  }

  async removeAll(): Promise<void> {
    await FileSystem.deleteAsync(this.root, { idempotent: true });
  }

  private async persist(tempUri: string, folder: string, fallbackExt: string): Promise<string> {
    const dir = `${this.root}${folder}/`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    const to = `${dir}${newId()}.${extensionOf(tempUri) ?? fallbackExt}`;
    await FileSystem.copyAsync({ from: tempUri, to });
    return to;
  }
}
