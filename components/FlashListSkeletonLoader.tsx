import React from 'react';
import { View, FlatList } from 'react-native';
import VerseCardSkeleton from './Verses/VerseCardSkeleton';
import CollectionCardSkeleton from './Verses/CollectionCardSkeleton';
import ItemSeparator from './ItemSeparator';

interface FlashListSkeletonLoaderProps {
  type: 'verses' | 'collections';
  gridView?: boolean;
  numItems?: number;
}

const FlashListSkeletonLoader: React.FC<FlashListSkeletonLoaderProps> = ({
  type,
  gridView = false,
  numItems = 5,
}) => {
  // Generate skeleton data
  const skeletonData = Array.from({ length: numItems }, (_, index) => ({
    id: `skeleton-${index}`,
  }));

  const renderSkeletonItem = ({
    item,
    index,
  }: {
    item: { id: string };
    index: number;
  }) => {
    const containerClassName = gridView ? 'flex-1' : 'w-full';

    if (type === 'verses') {
      return <VerseCardSkeleton containerClassName={containerClassName} />;
    } else {
      return <CollectionCardSkeleton containerClassName={containerClassName} />;
    }
  };

  return (
    <FlatList
      key={gridView ? `skeleton-${type}-grid` : `skeleton-${type}-list`}
      data={skeletonData}
      keyExtractor={item => item.id}
      numColumns={gridView ? 2 : 1}
      renderItem={renderSkeletonItem}
      columnWrapperStyle={gridView ? { gap: 8, width: '100%' } : undefined}
      ItemSeparatorComponent={ItemSeparator}
      scrollEnabled={false}
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 18 }}
    />
  );
};

export default FlashListSkeletonLoader;
