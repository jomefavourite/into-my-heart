import { View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/components/BackHeader';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ThemedText from '@/components/ThemedText';
import CustomButton from '@/components/CustomButton';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useToast } from 'react-native-toast-notifications';
import { useAlert } from '@/hooks/useAlert';
import { useOfflineAffirmation } from '@/hooks/useOfflineData';
import { useOfflineDataStore } from '@/store/offlineDataStore';

const CreateAffirmation = () => {
  const router = useRouter();
  const { affirmationId } = useLocalSearchParams();
  const toast = useToast();

  const [content, setContent] = useState('');
  const [hasInputError, setHasInputError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!affirmationId;
  const existingAffirmation = useOfflineAffirmation(affirmationId);
  const saveAffirmationLocal = useOfflineDataStore(
    state => state.saveAffirmationLocal
  );
  const deleteAffirmation = useOfflineDataStore(
    state => state.deleteAffirmationLocal
  );
  const { alert } = useAlert();

  // Load existing affirmation data when editing
  useEffect(() => {
    if (existingAffirmation) {
      setContent(existingAffirmation.content);
    }
  }, [existingAffirmation]);

  const handleSave = async () => {
    if (!content.trim()) {
      setHasInputError(true);
      return;
    }

    setHasInputError(false);
    setIsLoading(true);

    try {
      if (isEditMode && typeof affirmationId === 'string') {
        saveAffirmationLocal({
          syncId: affirmationId,
          remoteId: existingAffirmation?.remoteId,
          content: content.trim(),
        });
        toast.show('Affirmation updated successfully', { type: 'success' });
      } else {
        saveAffirmationLocal({
          content: content.trim(),
        });
        toast.show('Affirmation saved successfully', { type: 'success' });
      }
      router.back();
    } catch (error) {
      console.error('Error saving affirmation:', error);
      toast.show('Failed to save affirmation', { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (!isEditMode || !affirmationId) return;

    alert(
      'Delete Affirmation',
      'Are you sure you want to delete this affirmation? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              deleteAffirmation(String(affirmationId));
              toast.show('Affirmation deleted successfully', {
                type: 'success',
              });
              router.back();
            } catch (error) {
              console.error('Error deleting affirmation:', error);
              toast.show('Failed to delete affirmation', { type: 'error' });
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className='flex-1'>
      <BackHeader
        title={isEditMode ? 'Edit Affirmation' : 'Create Affirmation'}
        items={[
          { label: 'Verses', href: '/verses' },
          {
            label: isEditMode ? 'Edit Affirmation' : 'Create Affirmation',
            href: '/verses/create-affirmation',
          },
        ]}
      />

      <View className='flex-1 px-[18px]'>
        <View className='gap-1 pb-3'>
          <Label nativeID='affirmationContent'>Affirmation</Label>
          <Textarea
            aria-labelledby='affirmationContent'
            value={content}
            placeholder='Type your affirmation here...'
            className={`min-h-[200px] dark:text-white ${
              hasInputError ? 'border border-red-500' : ''
            }`}
            onChangeText={text => {
              setContent(text);
              if (hasInputError && text.trim()) setHasInputError(false);
            }}
            numberOfLines={10}
          />
          {hasInputError && (
            <ThemedText className='mt-1 text-xs text-red-500'>
              Affirmation content is required
            </ThemedText>
          )}
        </View>

        <View className='my-5 gap-3'>
          <CustomButton
            disabled={!content.trim() || isLoading}
            onPress={handleSave}
          >
            {isLoading
              ? 'Saving...'
              : isEditMode
                ? 'Update Affirmation'
                : 'Save Affirmation'}
          </CustomButton>

          {isEditMode && (
            <CustomButton
              variant='outline'
              disabled={isLoading}
              onPress={handleDelete}
            >
              Delete Affirmation
            </CustomButton>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateAffirmation;
