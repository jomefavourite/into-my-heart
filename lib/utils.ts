import { clsx, type ClassValue } from 'clsx';
import { Href } from 'expo-router';
import { twMerge } from 'tailwind-merge';
import OnboardIcon1 from '~/components/icons/onboarding/onboarding-1.svg';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface OnboardingStep {
  title: string;
  subtile: string;
  link: Href;
  Icon: React.ComponentType<any> | null; // Or any other appropriate type for Icon
  btnText: string;
}

import { create } from 'zustand';

interface HeaderBottomSheet {
  streakBottomSheetIndex: number;
  startDateBottomSheetIndex: number;
  reviewFreqIndex: number;
  reviewFreqValue: string;
  removeGoalIndex: number;
  setStreakBottomSheetIndex: (by: number) => void;
  setStartDateBottomSheetIndex: (by: number) => void;
  setReviewFreqIndex: (by: number) => void;
  setReviewFreqValue: (by: string) => void;
  setRemoveGoalIndex: (by: number) => void;
}

export const useBottomSheetStore = create<HeaderBottomSheet>()((set) => ({
  streakBottomSheetIndex: -1,
  startDateBottomSheetIndex: -1,
  reviewFreqIndex: -1,
  reviewFreqValue: 'Daily',
  removeGoalIndex: -1,
  setStreakBottomSheetIndex: (by) =>
    set(() => ({ streakBottomSheetIndex: by })),
  setStartDateBottomSheetIndex: (by) =>
    set(() => ({ startDateBottomSheetIndex: by })),
  setReviewFreqIndex: (by) => set(() => ({ reviewFreqIndex: by })),
  setReviewFreqValue: (by) => set(() => ({ reviewFreqValue: by })),
  setRemoveGoalIndex: (by) => set(() => ({ removeGoalIndex: by })),
}));

export interface OnboardingData {
  [stepNumber: number]: OnboardingStep;
}

export const ONBOARDING_DATA: OnboardingData = {
  1: {
    title: "God's Word Hidden in Your Heart.",
    subtile:
      "Build a habit of hiding God's Word in your heart with interactive tools designed to help you remember and apply scripture.",
    link: '/(onboarding)/step2',
    Icon: OnboardIcon1,
    btnText: 'Next',
  },
  2: {
    title: 'Build a Habit That Lasts.',
    subtile:
      'Choose your own verses or explore curated collections. Set goals and review at your own pace.',
    link: '/(onboarding)/step3',
    Icon: null,
    btnText: 'Next',
  },
  3: {
    title: 'Scripture. Practice. Retain.',
    subtile:
      'Use fill-in-the-blanks, flashcards, and guided review to make scripture memorization simple and effective.',
    link: '/(onboarding)/onboard',
    Icon: null,
    btnText: 'Get started',
  },
};
