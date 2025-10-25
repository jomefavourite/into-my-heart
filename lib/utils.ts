import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import OnboardIcon1 from '@/components/icons/onboarding/onboarding-1.svg';
import React from 'react';
import { create } from 'zustand';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const verses = [
  {
    bookName: 'Genesis',
    chapter: 1,
    verses: ['1'],
    reviewFreq: 'Daily',
    reference: 'In the beginning, God created the heavens and the earth.',
  },
  {
    bookName: 'Genesis',
    chapter: 1,
    verses: ['1'],
    reviewFreq: 'Daily',
    reference: 'In the beginning, God created the heavens and the earth.',
  },
  {
    bookName: 'Genesis',
    chapter: 1,
    verses: ['1'],
    reviewFreq: 'Daily',
    reference: 'In the beginning, God created the heavens and the earth.',
  },
];

export interface OnboardingStep {
  title: string;
  subtile: string;
  Icon: React.ComponentType<any> | null; // Or any other appropriate type for Icon
  btnText: string;
}

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

export const useBottomSheetStore = create<HeaderBottomSheet>()(set => ({
  streakBottomSheetIndex: -1,
  startDateBottomSheetIndex: -1,
  reviewFreqIndex: -1,
  reviewFreqValue: 'Daily',
  removeGoalIndex: -1,
  setStreakBottomSheetIndex: by => set(() => ({ streakBottomSheetIndex: by })),
  setStartDateBottomSheetIndex: by =>
    set(() => ({ startDateBottomSheetIndex: by })),
  setReviewFreqIndex: by => set(() => ({ reviewFreqIndex: by })),
  setReviewFreqValue: by => set(() => ({ reviewFreqValue: by })),
  setRemoveGoalIndex: by => set(() => ({ removeGoalIndex: by })),
}));

export interface OnboardingData {
  [stepNumber: number]: OnboardingStep;
}

export const ONBOARDING_DATA: OnboardingData = {
  1: {
    title: "God's Word Hidden in Your Heart.",
    subtile:
      "Build a habit of hiding God's Word in your heart with interactive tools designed to help you remember and apply scripture.",

    Icon: OnboardIcon1,
    btnText: 'Next',
  },
  2: {
    title: 'Build a Habit That Lasts.',
    subtile:
      'Choose your own verses or explore curated collections. Set goals and review at your own pace.',

    Icon: null,
    btnText: 'Next',
  },
  3: {
    title: 'Scripture. Practice. Retain.',
    subtile:
      'Use fill-in-the-blanks, flashcards, and guided review to make scripture memorization simple and effective.',
    Icon: null,
    btnText: 'Get started',
  },
};

// Helper function to format verse display
export const formatVerseDisplay = (verses: string[] | undefined) => {
  if (!verses || verses.length === 0) return '1';
  if (verses.length === 1) return verses[0];

  // For 3 or more verses, show range format
  const sortedVerses = [...verses].sort((a, b) => parseInt(a) - parseInt(b));
  const firstVerse = sortedVerses[0];
  const lastVerse = sortedVerses[sortedVerses.length - 1];

  return ` ${firstVerse} - ${lastVerse}`;
};

export const PracticeCompleteMessages = {
  standard: [
    'Great job! Another verse is taking root in your heart. Keep it up!',
    'Well done! Every session brings you closer to making scripture first nature.',
    'You’re building a habit that lasts! Stay consistent, and watch how God’s Word transforms you.',
  ],
  faithFocused: [
    'God’s Word is shaping your heart, one verse at a time. Keep growing!',
    'Strong roots, lasting faith! Keep pressing in, and the Word will stay with you.',
    'You’re not just memorizing—you’re storing up truth that will guide you always!',
  ],
  perfectScore: [
    'You crushed it! These verses is becoming part of you',
    'Flawless! Your dedication to the Word is shining through.',
    'Spot on! Keep practicing, and soon scripture will flow effortlessly from your heart.',
  ],
  streakBoosting: [
    'Your streak is growing! Keep up the momentum and stay rooted in truth.',
    'Another day, another step in faith! Keep the streak alive and stay in the Word.',
    'You’re on fire! Keep building your streak and let scripture shape your journey.',
  ],
  progress: [
    "Each step forward is a victory. Keep going, you're making real progress!",
    'Bit by bit, these verses are becoming part of you. Stay the course!',
    'Small steps, big impact! The Word is taking root in your heart.',
  ],
  encouragement: [
    'Even when it’s hard, God’s Word is working in you. Stay faithful, keep practicing!',
    'You’re doing great! Keep pressing in, and the Word will transform you.',
    'Your dedication is paying off. Keep practicing, and soon scripture will flow effortlessly from your heart.',
  ],
};
