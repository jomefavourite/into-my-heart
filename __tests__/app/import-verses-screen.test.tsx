import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import ImportVerses from '@/app/verses/import-verses';

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockSaveVerseLocal = jest.fn();
const mockSetCollectionVersesArray = jest.fn();
const mockSetPendingShare = jest.fn();
const mockClearPendingShare = jest.fn();
const mockResolveExactBibleDotComVerseTexts = jest.fn();

let mockSearchParams: { text?: string; url?: string; title?: string } = {
  text: [
    'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    'John 3:16 NIV',
  ].join('\n\n'),
  url: 'https://www.bible.com/bible/111/JHN.3.16.NIV',
};

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  useLocalSearchParams: () => mockSearchParams,
}));

jest.mock('@clerk/clerk-expo', () => ({
  useAuth: () => ({
    isLoaded: true,
    isSignedIn: true,
  }),
}));

jest.mock('convex/react', () => ({
  useAction: () => mockResolveExactBibleDotComVerseTexts,
}));

jest.mock('@/hooks/useIncomingImportShare', () => ({
  useIncomingImportShare: () => ({
    sharedPayloads: [],
    resolvedSharedPayloads: [],
    clearSharedPayloads: jest.fn(),
    isResolving: false,
    error: null,
    refreshSharePayloads: jest.fn(),
  }),
}));

jest.mock('@/hooks/useOfflineData', () => ({
  useOfflineVerses: () => [],
}));

jest.mock('@/store/offlineDataStore', () => ({
  useOfflineDataStore: (selector: (state: any) => unknown) =>
    selector({
      currentUser: {
        clerkId: 'offline-user',
        email: 'tester@example.com',
      },
      saveVerseLocal: mockSaveVerseLocal,
    }),
}));

jest.mock('@/store/bookStore', () => ({
  useBookStore: () => ({
    setCollectionVersesArray: mockSetCollectionVersesArray,
  }),
}));

jest.mock('@/store/importShareStore', () => ({
  useImportShareStore: (selector: (state: any) => unknown) =>
    selector({
      pendingShare: null,
      setPendingShare: mockSetPendingShare,
      clearPendingShare: mockClearPendingShare,
    }),
}));

jest.mock('@/components/BackHeader', () => {
  const { Text: MockText } = require('react-native');
  return function MockBackHeader({ title }: { title: string }) {
    return <MockText>{title}</MockText>;
  };
});

jest.mock('@/components/CustomButton', () => {
  const {
    Text: MockText,
    TouchableOpacity: MockTouchableOpacity,
  } = require('react-native');
  return function MockCustomButton({
    children,
    onPress,
  }: {
    children: React.ReactNode;
    onPress?: () => void;
  }) {
    return (
      <MockTouchableOpacity onPress={onPress}>
        <MockText>{children}</MockText>
      </MockTouchableOpacity>
    );
  };
});

jest.mock('@/components/ThemedText', () => {
  const { Text: MockText } = require('react-native');
  return function MockThemedText({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <MockText>{children}</MockText>;
  };
});

jest.mock('@/components/ui/label', () => ({
  Label: ({ children }: { children: React.ReactNode }) => {
    const { Text: MockText } = require('react-native');
    return <MockText>{children}</MockText>;
  },
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => {
    const { View: MockView } = require('react-native');
    return <MockView>{children}</MockView>;
  },
}));

describe('ImportVerses screen', () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockReplace.mockReset();
    mockSaveVerseLocal.mockReset();
    mockSetCollectionVersesArray.mockReset();
    mockSetPendingShare.mockReset();
    mockClearPendingShare.mockReset();
    mockResolveExactBibleDotComVerseTexts.mockReset();
    mockSearchParams = {
      text: [
        'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
        'John 3:16 NIV',
      ].join('\n\n'),
      url: 'https://www.bible.com/bible/111/JHN.3.16.NIV',
    };
  });

  test('prefills from share-target params and saves imported source metadata', async () => {
    const screen = render(<ImportVerses />);

    await waitFor(() => {
      expect(screen.getByText('Ready to import')).toBeTruthy();
    });

    expect(screen.getByText('Reference: John 3:16 NIV')).toBeTruthy();
    expect(screen.getByText('Source: bible.com (NIV)')).toBeTruthy();
    expect(screen.getByText('Preview translation: NIV')).toBeTruthy();
    expect(screen.getByText('Stored verse text: NIV')).toBeTruthy();
    expect(
      screen.getByText(
        '16. For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life'
      )
    ).toBeTruthy();

    fireEvent.press(screen.getByText('Save to Verses'));

    expect(mockSaveVerseLocal).toHaveBeenCalledWith(
      expect.objectContaining({
        bookName: 'John',
        chapter: 3,
        verses: ['16'],
        verseTexts: [
          {
            verse: '16',
            text:
              'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life',
          },
        ],
        importSource: expect.objectContaining({
          provider: 'bible.com',
          channel: 'webShareTarget',
          version: 'NIV',
          sourceUrl: 'https://www.bible.com/bible/111/JHN.3.16.NIV',
          textFidelity: 'exactImported',
        }),
      })
    );
    expect(mockReplace).toHaveBeenCalledWith('/verses');
  });

  test('shows exact split previews for multi-verse bible.com imports', async () => {
    mockSearchParams = {
      text: [
        "'When Jesus saw Nathanael approaching, he said of him, “Here truly is an Israelite in whom there is no deceit.” “How do you know me?” Nathanael asked. Jesus answered, “I saw you while you were still under the fig tree before Philip called you.” Then Nathanael declared, “Rabbi, you are the Son of God; you are the king of Israel.” Jesus said, “You believe because I told you I saw you under the fig tree. You will see greater things than that.” '",
        'John 1:47-50',
      ].join('\n\n'),
      url: 'https://www.bible.com/bible/111/JHN.1.47-50.NIV',
    };
    mockResolveExactBibleDotComVerseTexts.mockResolvedValue({
      status: 'exact',
      verseTexts: [
        {
          verse: '47',
          text:
            'When Jesus saw Nathanael approaching, he said of him, “Here truly is an Israelite in whom there is no deceit.”',
        },
        {
          verse: '48',
          text:
            '“How do you know me?” Nathanael asked. Jesus answered, “I saw you while you were still under the fig tree before Philip called you.”',
        },
        {
          verse: '49',
          text:
            'Then Nathanael declared, “Rabbi, you are the Son of God; you are the king of Israel.”',
        },
        {
          verse: '50',
          text:
            'Jesus said, “You believe because I told you I saw you under the fig tree. You will see greater things than that.”',
        },
      ],
    });

    const screen = render(<ImportVerses />);

    await waitFor(() => {
      expect(screen.getByText('Stored verse text: NIV')).toBeTruthy();
    });

    expect(screen.getByText('Preview translation: NIV')).toBeTruthy();
    expect(
      screen.getByText(
        ['47. When Jesus saw Nathanael approaching, he said of him, “Here truly is an Israelite in whom there is no deceit.”',
         '48. “How do you know me?” Nathanael asked. Jesus answered, “I saw you while you were still under the fig tree before Philip called you.”',
         '49. Then Nathanael declared, “Rabbi, you are the Son of God; you are the king of Israel.”',
         '50. Jesus said, “You believe because I told you I saw you under the fig tree. You will see greater things than that.”'].join('\n')
      )
    ).toBeTruthy();
  });

  test('shows fallback warning when exact split is unavailable', async () => {
    mockSearchParams = {
      text: [
        "'When Jesus saw Nathanael approaching, he said of him, “Here truly is an Israelite in whom there is no deceit.” “How do you know me?” Nathanael asked. Jesus answered, “I saw you while you were still under the fig tree before Philip called you.” Then Nathanael declared, “Rabbi, you are the Son of God; you are the king of Israel.” Jesus said, “You believe because I told you I saw you under the fig tree. You will see greater things than that.” '",
        'John 1:47-50',
      ].join('\n\n'),
      url: 'https://www.bible.com/bible/111/JHN.1.47-50.NIV',
    };
    mockResolveExactBibleDotComVerseTexts.mockResolvedValue({
      status: 'fallback',
      reason: 'fetchFailed',
    });

    const screen = render(<ImportVerses />);

    await waitFor(() => {
      expect(screen.getByText('Stored verse text: KJV fallback')).toBeTruthy();
    });

    expect(screen.getByText('Preview translation: NIV')).toBeTruthy();
    expect(
      screen.getByText(
        'Exact verse-by-verse import was unavailable for this share. Saving will use offline KJV verse boundaries.'
      )
    ).toBeTruthy();
    expect(
      screen.getByText(
        "'When Jesus saw Nathanael approaching, he said of him, “Here truly is an Israelite in whom there is no deceit.” “How do you know me?” Nathanael asked. Jesus answered, “I saw you while you were still under the fig tree before Philip called you.” Then Nathanael declared, “Rabbi, you are the Son of God; you are the king of Israel.” Jesus said, “You believe because I told you I saw you under the fig tree. You will see greater things than that.” '"
      )
    ).toBeTruthy();
  });
});
