import * as FileSystem from 'expo-file-system/legacy';

import { newId } from '@/lib/ids';

import type { IMediaStore } from './interfaces';

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

  async remove(uri: string): Promise<void> {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  }

  private async persist(tempUri: string, folder: string, fallbackExt: string): Promise<string> {
    const dir = `${this.root}${folder}/`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    const ext = tempUri.split('.').pop()?.toLowerCase() || fallbackExt;
    const to = `${dir}${newId()}.${ext}`;
    await FileSystem.copyAsync({ from: tempUri, to });
    return to;
  }
}
