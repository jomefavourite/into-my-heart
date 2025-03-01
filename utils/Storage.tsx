import AsyncStorage from '@react-native-async-storage/async-storage';

export const setOnboardingComplete = async () => {
  try {
    await AsyncStorage.setItem('onboarded', 'true');
  } catch (e) {
    console.error('Error setting onboarding status:', e);
  }
};

export const getOnboardingStatus = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem('onboarded');
    return value === 'true';
  } catch (e) {
    console.error('Error getting onboarding status:', e);
    return false; // Default to false on error
  }
};
