import { create } from 'zustand';

import { DEFAULT_THEME_KEY, type ThemeKey } from '@/domain/theme';
import { getContainer, type AppServices } from '@/services/container';

interface ThemeStoreState {
  themeKey: ThemeKey;
  hydrate(): Promise<void>;
  /** Persist the chosen accent theme into settings and apply it live. */
  setTheme(key: ThemeKey): Promise<void>;
}

export const createThemeStore = (services: AppServices) =>
  create<ThemeStoreState>()((set) => ({
    themeKey: DEFAULT_THEME_KEY,
    async hydrate() {
      const settings = await services.settings.get();
      set({ themeKey: settings.theme });
    },
    async setTheme(key) {
      set({ themeKey: key });
      await services.settings.update((settings) => ({ ...settings, theme: key }));
    },
  }));

export const useThemeStore = createThemeStore(getContainer());
