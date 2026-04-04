import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PlatformStorage } from '@/utils/PlatformStorage';
interface VersesTabStore {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const useVersesTabStore = create<VersesTabStore>()(
  persist(
    set => ({
      activeTab: 'verses',
      setActiveTab: value => set({ activeTab: value }),
    }),
    {
      name: 'verses-tab-store',
      storage: createJSONStorage(() => PlatformStorage),
      version: 1,
    }
  )
);

type IsCollOrVerseStore = {
  isCollOrVerse: 'collections' | 'verses' | null;
  setIsCollOrVerse: (value: 'collections' | 'verses' | null) => void;
};

export const useIsCollOrVerse = create<IsCollOrVerseStore>()(
  persist(
    set => ({
      isCollOrVerse: null,
      setIsCollOrVerse: value => set({ isCollOrVerse: value }),
    }),
    {
      name: 'is-coll-or-verse-store',
      storage: createJSONStorage(() => PlatformStorage),
      version: 1,
    }
  )
);

type GridListView = {
  gridView: boolean;
  setGridView: (value: boolean) => void;
};

export const useGridListView = create<GridListView>()(
  persist(
    set => ({
      gridView: true,
      setGridView: value => set({ gridView: value }),
    }),
    {
      name: 'grid-list-view-store',
      storage: createJSONStorage(() => PlatformStorage),
      version: 1,
    }
  )
);

type PracticeLauncherPreferencesStore = {
  randomizePracticeOrder: boolean;
  setRandomizePracticeOrder: (value: boolean) => void;
};

export const usePracticeLauncherPreferences =
  create<PracticeLauncherPreferencesStore>()(
    persist(
      set => ({
        randomizePracticeOrder: false,
        setRandomizePracticeOrder: value =>
          set({ randomizePracticeOrder: value }),
      }),
      {
        name: 'practice-launcher-preferences-store',
        storage: createJSONStorage(() => PlatformStorage),
        version: 1,
      }
    )
  );
