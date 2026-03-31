import { View, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedText from '@/components/ThemedText';
import BackHeader from '@/components/BackHeader';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Textarea } from '@/components/ui/textarea';
import CustomButton from '@/components/CustomButton';
import { formatVerseDisplay } from '@/lib/utils';
import { XIcon } from 'lucide-react-native';
import { normalizeBibleText } from '@/lib/verseText';

export default function VerseNotesPage() {
  const router = useRouter();
  const { verseId } = useLocalSearchParams();
  const [noteContent, setNoteContent] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const note = useQuery(api.notes.getNoteByVerseId, {
    verseId: verseId as Id<'verses'>,
  });
  const verse = useQuery(api.verses.getVerseById, {
    id: verseId as Id<'verses'>,
  });

  const upsertNote = useMutation(api.notes.upsertNote);

  // Load note content when it's fetched
  useEffect(() => {
    if (note) {
      setNoteContent(note.content);
      setIsEditing(false); // Reset edit mode when note loads
    } else {
      // If no note exists yet, allow editing
      setNoteContent('');
      setIsEditing(true);
    }
  }, [note]);

  const handleContentChange = (text: string) => {
    setNoteContent(text);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await upsertNote({
        verseId: verseId as Id<'verses'>,
        content: noteContent,
      });
      setHasChanges(false);
      setIsEditing(false);
      // Optionally show success message
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleClear = () => {
    setNoteContent('');
    setHasChanges(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (note) {
      setNoteContent(note.content);
    }
    setIsEditing(false);
    setHasChanges(false);
  };

  return (
    <SafeAreaView className='flex-1'>
      {Platform.OS === 'web' && (
        <>
          <title>
            Notes - {verse?.bookName} {verse?.chapter}:
            {formatVerseDisplay(verse?.verses)} - Into My Heart
          </title>
          <meta
            name='description'
            content={`Notes for ${verse?.bookName} ${verse?.chapter}:${formatVerseDisplay(verse?.verses)}`}
          />
        </>
      )}

      <BackHeader
        title='Notes'
        items={[
          { label: 'Verses', href: '/verses' },
          {
            label: `${verse?.bookName} ${verse?.chapter}:${formatVerseDisplay(verse?.verses)}`,
            href: `/verses/${verseId}`,
          },
          {
            label: 'Notes',
            href: `/verses/${verseId}/notes`,
          },
        ]}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View className='flex-1 justify-between px-[18px] pb-[18px]'>
          <ScrollView className='flex-1'>
            <View className='gap-3'>
              <View className='rounded-lg border border-border p-4'>
                <ThemedText className='mb-2 text-xs text-[#909090]'>
                  {verse?.bookName} {verse?.chapter}:
                  {formatVerseDisplay(verse?.verses)}
                </ThemedText>
                {verse && verse.verseTexts && verse.verseTexts.length > 0 && (
                  <ScrollView
                    className='max-h-32'
                    showsVerticalScrollIndicator={true}
                  >
                    {verse.verseTexts.map((text, index) => (
                      <ThemedText key={index} className='text-sm'>
                        {text.verse}. {normalizeBibleText(text.text)}
                      </ThemedText>
                    ))}
                  </ScrollView>
                )}
              </View>

              <View className='flex-1'>
                <View className='mb-2 flex-row items-center justify-between'>
                  <ThemedText className='text-sm font-medium'>
                    Your Notes
                  </ThemedText>
                  {!isEditing && note && (
                    <CustomButton
                      variant='outline'
                      size='sm'
                      onPress={handleEdit}
                    >
                      Edit
                    </CustomButton>
                  )}
                  {isEditing && (
                    <CustomButton
                      variant='outline'
                      size='sm'
                      onPress={handleCancel}
                    >
                      Cancel
                    </CustomButton>
                  )}
                </View>
                <Textarea
                  placeholder='Add your thoughts, insights, or reflections about this verse...'
                  value={noteContent}
                  onChangeText={handleContentChange}
                  multiline
                  style={{ minHeight: 300 }}
                  textAlignVertical='top'
                  editable={isEditing}
                />
              </View>
            </View>
          </ScrollView>

          {isEditing && (
            <View className='flex-row gap-3 pt-3'>
              {noteContent.trim() && (
                <CustomButton
                  variant='outline'
                  onPress={handleClear}
                  className='flex-1'
                >
                  Clear
                </CustomButton>
              )}

              <CustomButton
                onPress={handleSave}
                disabled={!hasChanges || !noteContent.trim()}
                className='flex-1'
              >
                Save
              </CustomButton>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
