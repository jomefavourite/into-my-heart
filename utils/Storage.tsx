import { StorageUtils as PlatformStorageUtils } from './PlatformStorage';

export const setOnboardingComplete = async () => {
  try {
    await PlatformStorageUtils.setItem('onboarded', 'true');
  } catch (e) {
    console.error('Error setting onboarding status:', e);
  }
};

export const getOnboardingStatus = async (): Promise<boolean> => {
  try {
    const value = await PlatformStorageUtils.getItem('onboarded');
    return value === 'true';
  } catch (e) {
    console.error('Error getting onboarding status:', e);
    return false; // Default to false on error
  }
};

// Re-export platform-aware storage utilities
export const StorageUtils = PlatformStorageUtils;
