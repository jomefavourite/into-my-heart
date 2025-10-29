import { View, ScrollView, Platform, Alert } from 'react-native';
import React, { useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from 'convex-helpers/react/cache';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as Speech from 'expo-speech';
import ThemedText from '@/components/ThemedText';
import BackHeader from '@/components/BackHeader';
import { Button } from '@/components/ui/button';
import { Id } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';
import { Card } from '@/components/ui/card';
import NoteIcon from '@/components/icons/NoteIcon';
import ImageIcon from '@/components/icons/ImageIcon';
import IdeaIcon from '@/components/icons/IdeaIcon';
import CustomButton from '@/components/CustomButton';
import { useAuth } from '@clerk/clerk-expo';
import { formatVerseDisplay } from '@/lib/utils';
import { Image } from 'expo-image';
import Logo from '@/components/icons/logo/Logo';
import WithTooltip from '@/components/WithTooltip';
import VolumeHighIcon from '@/components/icons/VolumeHighIcon';

export default function VersePage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { verseId } = useLocalSearchParams();
  const verse = useQuery(
    api.verses.getVerseById,
    isSignedIn && isLoaded
      ? {
          id: verseId as Id<'verses'>,
        }
      : 'skip'
  );
  const viewShotRef = useRef<ViewShot>(null);

  const handleNotesPress = () => {
    router.push(`/verses/${verseId}/notes`);
  };

  const handleDownloadImage = async () => {
    if (!verse || !viewShotRef.current) return;

    try {
      const uri = await viewShotRef?.current?.capture();

      // Note: For web is broken for now
      if (Platform.OS === 'web') {
        // For web, download the image
        const link = document.createElement('a');
        link.href = uri;
        link.download = `${verse.bookName}-${verse.chapter}-${formatVerseDisplay(verse.verses)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        Alert.alert('Success', 'Image downloaded successfully!');
      } else {
        // For mobile, share the image
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert('Error', 'Sharing is not available on this device');
        }
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      Alert.alert('Error', 'Failed to download image. Please try again.');
    }
  };

  const handleSpeakVerse = () => {
    if (!verse || !verse.verseTexts) return;

    // Stop any currently playing speech
    Speech.stop();

    // Combine all verse texts into a single string
    const fullText = `${verse.bookName} ${verse.chapter}:${formatVerseDisplay(verse.verses)}. ${verse.verseTexts.map(text => `${text.verse}. ${text.text}`).join(' ')}`;

    // Speak the verse
    Speech.speak(fullText, {
      language: 'en',
      pitch: 1.0,
      rate: 0.9,
    });
  };

  return (
    <SafeAreaView className='flex-1'>

{Platform.OS === 'web' && (
        <>
          <title>{verse?.bookName} {verse?.chapter}:{formatVerseDisplay(verse?.verses)} - Into My Heart</title>
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
                    {text.verse}. {text.text}
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
                        {text.verse}. {text.text}
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
                        {text.verse}. {text.text}
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
            <WithTooltip tooltipContents='Play audio'>
              <Button size={'icon'} onPress={handleSpeakVerse}  className='w-10'>
                <VolumeHighIcon />
              </Button>
            </WithTooltip>

            <WithTooltip tooltipContents='Add to notes'>
              <Button size={'icon'} onPress={handleNotesPress} className='w-10'>
                <NoteIcon />
              </Button>
            </WithTooltip>
            
            {/* <Button size={'icon'}>
              <TimeScheduleIcon />
            </Button> */}

            <WithTooltip tooltipContents='Download image'>
            <Button
              size={'icon'}
              className='w-10'
              onPress={handleDownloadImage}
            >
              <ImageIcon />
            </Button>
              </WithTooltip>
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
