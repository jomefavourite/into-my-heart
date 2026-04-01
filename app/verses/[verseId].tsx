import { View, ScrollView, Platform } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as Speech from 'expo-speech';
import ThemedText from '@/components/ThemedText';
import BackHeader from '@/components/BackHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import NoteIcon from '@/components/icons/NoteIcon';
import ImageIcon from '@/components/icons/ImageIcon';
import IdeaIcon from '@/components/icons/IdeaIcon';
import CustomButton from '@/components/CustomButton';
import { formatVerseDisplay } from '@/lib/utils';
import Logo from '@/components/icons/logo/Logo';
import VolumeHighIcon from '@/components/icons/VolumeHighIcon';
import { Pause, Star } from 'lucide-react-native';
import MoreVerticalIcon from '@/components/icons/MoreVerticalIcon';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAlert } from '@/hooks/useAlert';
import { BOOKS } from '@/lib/books';
import { normalizeBibleText } from '@/lib/verseText';
import { useOfflineVerse } from '@/hooks/useOfflineData';
import { useOfflineDataStore } from '@/store/offlineDataStore';

export default function VersePage() {
  const router = useRouter();
  const { verseId } = useLocalSearchParams();
  const verse = useOfflineVerse(verseId);
  const viewShotRef = useRef<ViewShot>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const toggleFeaturedVerseLocal = useOfflineDataStore(
    state => state.toggleFeaturedVerseLocal
  );
  const deleteVerse = useOfflineDataStore(state => state.deleteVerseLocal);
  const { isDarkMode } = useColorScheme();
  const { alert } = useAlert();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          const speechSynthesis = window.speechSynthesis;
          if (speechSynthesis && speechUtteranceRef.current) {
            speechSynthesis.cancel();
          }
        }
      } else {
        Speech.stop();
      }
      setIsPlaying(false);
    };
  }, []);

  const handleNotesPress = () => {
    router.push(`/verses/${verseId}/notes`);
  };

  const handleToggleFeatured = async () => {
    if (!verse) return;

    try {
      toggleFeaturedVerseLocal(verse.syncId, !verse.isFeatured);
    } catch (error) {
      console.error('Error toggling featured verse:', error);
      alert('Error', 'Failed to update featured verse. Please try again.');
    }
  };

  const handleDownloadImage = async () => {
    if (!verse || !viewShotRef.current) return;

    try {
      if (!viewShotRef.current.capture) {
        alert('Error', 'Capture method is not available.');
        return;
      }
      const uri = await viewShotRef.current.capture();

      // Note: For web is broken for now
      if (Platform.OS === 'web') {
        // For web, download the image
        const link = document.createElement('a');
        link.href = uri;
        link.download = `${verse.bookName}-${verse.chapter}-${formatVerseDisplay(verse.verses)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert('Success', 'Image downloaded successfully!');
      } else {
        // For mobile, share the image
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          alert('Error', 'Sharing is not available on this device');
        }
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Error', 'Failed to download image. Please try again.');
    }
  };

  const handleSpeakVerse = () => {
    if (!verse || !verse.verseTexts) return;

    if (isPlaying) {
      // Pause/Stop current speech
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          const speechSynthesis = window.speechSynthesis;
          if (speechSynthesis) {
            speechSynthesis.cancel();
          }
        }
      } else {
        Speech.stop();
      }
      setIsPlaying(false);
      return;
    }

    // Combine all verse texts into a single string
    const fullText = `${verse.bookName} ${verse.chapter}:${formatVerseDisplay(verse.verses)}. ${verse.verseTexts.map(text => `${text.verse}. ${normalizeBibleText(text.text)}`).join(' ')}`;

    if (Platform.OS === 'web') {
      // Use Web Speech API for web
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const speechSynthesis = window.speechSynthesis;
        if (speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(fullText);
          utterance.lang = 'en-US';
          utterance.pitch = 1.0;
          utterance.rate = 0.9;

          utterance.onend = () => {
            setIsPlaying(false);
            speechUtteranceRef.current = null;
          };

          utterance.onerror = () => {
            setIsPlaying(false);
            speechUtteranceRef.current = null;
          };

          speechUtteranceRef.current = utterance;
          speechSynthesis.speak(utterance);
          setIsPlaying(true);
        }
      } else {
        alert('Error', 'Speech synthesis is not supported in this browser.');
      }
    } else {
      // Use expo-speech for native platforms
      Speech.stop();

      Speech.speak(fullText, {
        language: 'en',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => {
          setIsPlaying(false);
        },
        onStopped: () => {
          setIsPlaying(false);
        },
        onError: () => {
          setIsPlaying(false);
        },
      });

      setIsPlaying(true);
    }
  };

  const handleEditVerse = () => {
    if (!verse) return;

    // Find the book in BOOKS array
    const book = BOOKS.find(b => b.name === verse.bookName);
    if (!book) {
      alert('Error', 'Book not found. Please try again.');
      return;
    }

    // Find the chapter in the book
    const chapterData = book.chapters.find(
      ch => ch.chapterNumber === verse.chapter
    );
    if (!chapterData) {
      alert('Error', 'Chapter not found. Please try again.');
      return;
    }

    // Get the verseLength for this chapter
    const verseLength = chapterData.versesLength;

    // Navigate to select-verses page with book, chapter, verseLength, current verses, and verseId for editing
    router.push(
      `/verses/select-verses?book=${encodeURIComponent(verse.bookName)}&chapter=${verse.chapter}&verseLength=${verseLength}&verses=${verse.verses.join(',')}&verseId=${verseId}`
    );
  };

  const handleDeleteVerse = () => {
    alert('Delete Verse', 'Are you sure you want to delete this verse?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteVerse(String(verseId));
          router.back();
        },
      },
    ]);
  };

  const RightComponent = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={'icon'} variant={'ghost'}>
          <MoreVerticalIcon color={isDarkMode ? '#fff' : '#303030'} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mr-4'>
        <DropdownMenuItem onPress={handleEditVerse}>
          <ThemedText className='text-sm font-medium'>Edit Verse</ThemedText>
        </DropdownMenuItem>
        <DropdownMenuItem onPress={handleDeleteVerse}>
          <ThemedText className='text-sm font-medium'>Delete Verse</ThemedText>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <SafeAreaView className='flex-1'>
      {Platform.OS === 'web' && (
        <>
          <title>
            {verse?.bookName} {verse?.chapter}:
            {formatVerseDisplay(verse?.verses)} - Into My Heart
          </title>
          <meta
            name='description'
            content={`Into My Heart - ${verse?.bookName} ${verse?.chapter}:${formatVerseDisplay(verse?.verses)}`}
          />
          <meta
            name='keywords'
            content={`Into My Heart - ${verse?.bookName} ${verse?.chapter}:${formatVerseDisplay(verse?.verses)}`}
          />
        </>
      )}

      <BackHeader
        title={`${verse?.bookName} ${verse?.chapter}:${formatVerseDisplay(verse?.verses)}`}
        items={[
          { label: 'Verses', href: '/verses' },
          {
            label: `${verse?.bookName} ${verse?.chapter}:${formatVerseDisplay(verse?.verses)}`,
            href: `/verses/${verseId}`,
          },
        ]}
        BreadcrumbRightComponent={RightComponent}
        RightComponent={RightComponent}
      />

      {/* Hidden view for capturing */}
      <ViewShot
        ref={viewShotRef}
        options={{ format: 'png', quality: 1.0 }}
        style={{ position: 'absolute', top: -9999, width: 800, height: 600 }}
      >
        <View
          style={{
            backgroundColor: '#ffffff',
            padding: 40,
            width: 800,
            height: 600,
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Logo />

          {/* Verse content */}
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ThemedText
              style={{ fontSize: 18, color: '#313131', marginBottom: 20 }}
            >
              {verse?.bookName} {verse?.chapter}:
              {formatVerseDisplay(verse?.verses)}
            </ThemedText>

            {verse && verse?.verseTexts?.length > 0 ? (
              <View style={{ alignItems: 'center', gap: 10 }}>
                {verse.verseTexts.map((text, index) => (
                  <ThemedText
                    key={index}
                    style={{
                      fontSize: 16,
                      color: '#313131',
                      textAlign: 'center',
                    }}
                  >
                    {text.verse}. {normalizeBibleText(text.text)}
                  </ThemedText>
                ))}
              </View>
            ) : (
              <ThemedText style={{ fontSize: 16, color: '#313131' }}>
                '...'
              </ThemedText>
            )}
          </View>

          {/* App name */}
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <ThemedText style={{ fontSize: 14, color: '#909090' }}>
              Into My Heart
            </ThemedText>
          </View>
        </View>
      </ViewShot>

      <View className='flex-1 justify-between px-[18px] pb-[18px]'>
        <View>
          <Card className='h-96 justify-center px-8 py-4'>
            <View className='mx-auto max-w-[500px] gap-1'>
              <ThemedText className=''>
                {verse?.bookName} {verse?.chapter}:
                {formatVerseDisplay(verse?.verses)}
              </ThemedText>
              {Platform.OS === 'web' ? (
                <View
                  style={{
                    maxHeight: 300,
                    overflowY: 'auto',
                    paddingRight: 8,
                  }}
                >
                  {verse && verse?.verseTexts?.length > 0 ? (
                    verse?.verseTexts.map((text, index) => (
                      <ThemedText key={index} className=''>
                        {text.verse}. {normalizeBibleText(text.text)}
                      </ThemedText>
                    ))
                  ) : (
                    <ThemedText className=''>'...'</ThemedText>
                  )}
                </View>
              ) : (
                <ScrollView
                  showsVerticalScrollIndicator={true}
                  contentContainerStyle={{
                    justifyContent: 'center',
                    flexGrow: 1,
                  }}
                >
                  {verse && verse?.verseTexts?.length > 0 ? (
                    verse?.verseTexts.map((text, index) => (
                      <ThemedText key={index} className=''>
                        {text.verse}. {normalizeBibleText(text.text)}
                      </ThemedText>
                    ))
                  ) : (
                    <ThemedText className=''>'...'</ThemedText>
                  )}
                </ScrollView>
              )}
            </View>
          </Card>

          <View className='my-4 flex-row justify-center gap-3'>
            {/* <WithTooltip
              tooltipContents={isPlaying ? 'Pause audio' : 'Play audio'}
            > */}
            <Button size={'icon'} onPress={handleSpeakVerse} className='w-10'>
              {isPlaying ? (
                <Pause
                  size={24}
                  color={Platform.OS === 'web' ? '#fff' : undefined}
                />
              ) : (
                <VolumeHighIcon />
              )}
            </Button>
            {/* </WithTooltip> */}
            {/* 
            <WithTooltip
              tooltipContents={
                verse?.isFeatured ? 'Remove from featured' : 'Mark as featured'
              }
            > */}
            <Button
              size={'icon'}
              onPress={handleToggleFeatured}
              className='w-10'
              // variant={verse?.isFeatured ? 'default' : 'outline'}
            >
              <Star
                size={24}
                strokeWidth={1.5}
                fill={
                  verse?.isFeatured ? (isDarkMode ? '#000' : '#fff') : 'none'
                }
                stroke={
                  verse?.isFeatured
                    ? isDarkMode
                      ? '#000'
                      : '#fff'
                    : isDarkMode
                      ? '#000'
                      : '#fff'
                }
                color='currentColor'
              />
            </Button>
            {/* </WithTooltip> */}

            {/* <WithTooltip tooltipContents='Add to notes'> */}
            <Button size={'icon'} onPress={handleNotesPress} className='w-10'>
              <NoteIcon />
            </Button>
            {/* </WithTooltip> */}

            {/* <Button size={'icon'}>
              <TimeScheduleIcon />
            </Button> */}

            {/* <WithTooltip tooltipContents='Download image'> */}
            <Button
              size={'icon'}
              className='w-10'
              onPress={handleDownloadImage}
            >
              <ImageIcon />
            </Button>
            {/* </WithTooltip> */}
          </View>

          <View className='rounded-md bg-container p-3'>
            <View className='flex-row items-center gap-2'>
              <IdeaIcon fontSize={13} />
              <ThemedText className='text-md font-medium'>Study Tip</ThemedText>
            </View>

            <ThemedText className='text-sm'>
              Read the verse aloud repeatedly and try to understand the context
              and meaning.
            </ThemedText>
          </View>
        </View>

        <CustomButton>Start practice</CustomButton>
      </View>
    </SafeAreaView>
  );
}
