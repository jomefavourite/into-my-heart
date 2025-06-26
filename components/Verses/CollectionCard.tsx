import React, { memo } from 'react';
import { View, TouchableOpacity, Pressable } from 'react-native';
import AddCircleIcon from '~/components/icons/AddCircleIcon';
import ThemedText from '../ThemedText';
import { useRouter } from 'expo-router';
import { Id } from '~/convex/_generated/dataModel';

interface CollectionCardProps {
  _id: Id<'collections'>;
  collectionName: string;
  versesLength?: number;
  containerClassName?: string;
  onAddPress?: () => void;
  canCheck?: boolean;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  _id,
  collectionName = 'Genesis',
  versesLength = 0,
  containerClassName = '',
  onAddPress = () => {},
  canCheck = true,
}) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        canCheck ? null : router.push(`/verses/collection/${_id}`)
      }
      className={`flex-row bg-container rounded-xl items-center py-[18px] px-4 ${containerClassName}`}
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
          className='w-fit text-[#707070] dark:text-[#909090] !overflow-hidden !text-ellipsis'
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
