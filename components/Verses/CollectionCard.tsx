import React, { memo } from 'react';
import { View, TouchableOpacity, Pressable } from 'react-native';
import AddCircleIcon from '@/components/icons/AddCircleIcon';
import ThemedText from '../ThemedText';
import { useRouter } from 'expo-router';
import { Id } from '@/convex/_generated/dataModel';

interface CollectionCardProps {
  _id: Id<'collections'> | Id<'collectionSuggestions'>;
  collectionName: string;
  versesLength?: number;
  containerClassName?: string;
  onAddPress?: () => void;
  canCheck?: boolean;
  isSuggestion?: boolean;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  _id,
  collectionName = 'Genesis',
  versesLength = 0,
  containerClassName = '',
  onAddPress = () => {},
  canCheck = true,
  isSuggestion = false,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (canCheck) {
      return;
    }

    if (isSuggestion) {
      // For suggestions, we might want to show a preview or add to collection
      onAddPress();
    } else {
      // For regular collections, navigate to the collection page
      router.push(`/verses/collection/${_id}`);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`flex-row items-center rounded-xl bg-container px-4 py-[18px] ${containerClassName}`}
    >
      <View className='flex-1 gap-2'>
        <View className='flex-row items-center justify-between'>
          <ThemedText
            numberOfLines={1}
            ellipsizeMode='tail'
            size={14}
            variant='medium'
          >
            {collectionName}
          </ThemedText>
          {/* <TouchableOpacity className='p-2' onPress={onAddPress}>
            <AddCircleIcon color={'#000'} />
          </TouchableOpacity> */}
        </View>

        <ThemedText
          numberOfLines={2}
          ellipsizeMode='tail'
          size={13}
          className='w-fit !overflow-hidden !text-ellipsis text-[13px] text-[#707070] dark:text-[#909090]'
        >
          {versesLength > 0
            ? `${versesLength} verse${versesLength > 1 ? 's' : ''}`
            : 'No verses added yet.'}
        </ThemedText>
      </View>

      {canCheck && (
        <TouchableOpacity className='p-2' onPress={onAddPress}>
          <AddCircleIcon color={'#000'} />
        </TouchableOpacity>
      )}
    </Pressable>
  );
};

export default memo(CollectionCard);
