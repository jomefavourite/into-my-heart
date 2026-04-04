import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { PlatformStorage } from '@/utils/PlatformStorage';
import type { PendingImportShare } from '@/lib/offline-sync';

type ImportShareState = {
  pendingShare: PendingImportShare | null;
  setPendingShare: (share: PendingImportShare) => void;
  clearPendingShare: () => void;
};

export const useImportShareStore = create<ImportShareState>()(
  persist(
    set => ({
      pendingShare: null,
      setPendingShare: pendingShare => set({ pendingShare }),
      clearPendingShare: () => set({ pendingShare: null }),
    }),
    {
      name: 'import-share-store',
      storage: createJSONStorage(() => PlatformStorage),
    }
  )
);
