import { create } from 'zustand'
interface TabStore {
  activeTab: 'verses' | 'collections';
  setActiveTab: (tab: 'verses' | 'collections') => void;
}

export const useTabStore = create<TabStore>((set) => ({
  activeTab: 'verses',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
