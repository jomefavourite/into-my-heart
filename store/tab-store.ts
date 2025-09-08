import { create } from 'zustand';
interface VersesTabStore {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const useVersesTabStore = create<VersesTabStore>((set) => ({
  activeTab: 'verses',
  setActiveTab: (value) => set({ activeTab: value }),
}));

type IsCollOrVerseStore = {
  isCollOrVerse: 'collections' | 'verses' | null;
  setIsCollOrVerse: (value: 'collections' | 'verses' | null) => void;
};

export const useIsCollOrVerse = create<IsCollOrVerseStore>((set) => ({
  isCollOrVerse: null,
  setIsCollOrVerse: (value) => set({ isCollOrVerse: value }),
}));

type GridListView = {
  gridView: boolean;
  setGridView: (value: boolean) => void;
};

export const useGridListView = create<GridListView>((set) => ({
  gridView: false,
  setGridView: (value) => set({ gridView: value }),
}));
