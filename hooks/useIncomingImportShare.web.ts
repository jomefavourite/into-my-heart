import type { ResolvedSharePayload, SharePayload } from 'expo-sharing';

export const useIncomingImportShare = () => ({
  sharedPayloads: [] as SharePayload[],
  resolvedSharedPayloads: [] as ResolvedSharePayload[],
  clearSharedPayloads: () => {},
  isResolving: false,
  error: null,
  refreshSharePayloads: () => {},
});
