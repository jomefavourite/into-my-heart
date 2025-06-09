import { create } from 'zustand';
interface VersesTabStore {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const useVersesTabStore = create<VersesTabStore>((set) => ({
  activeTab: 'verses',
  setActiveTab: (value) => set({ activeTab: value }),
}));
