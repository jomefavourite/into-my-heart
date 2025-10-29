import React from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Href, router, useLocalSearchParams } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import ThemedText from '../ThemedText';
import { cn } from '@/lib/utils';
type BreadcrumbItem = {
  label: string;
  href?: Href;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  BreadcrumbRightComponent?: React.ReactNode;
};

function Breadcrumb({ items, BreadcrumbRightComponent }: BreadcrumbProps) {
  const { book: bookURL, chapter: chapterURL } = useLocalSearchParams();
  const { width } = useWindowDimensions();

  const bookName = String(bookURL || '');
  const chapter = Number(chapterURL || '');

  const handlePress = (href: Href) => {
    router.replace(`${href}?book=${bookName}&chapter=${chapter}` as Href);
  };

  // Check if mobile view (non-web or width <= 768)
  const isMobileView = Platform.OS !== 'web' || width <= 768;

  // Transform items based on length (only on mobile)
  const getDisplayItems = () => {
    if (!isMobileView) {
      return items;
    }

    if (items.length <= 3) {
      return items;
    } else if (items.length === 4) {
      return [items[0], { label: '...', href: undefined }, items[2], items[3]];
    } else {
      // More than 4 items: show first, ellipsis, ellipsis, last
      return [
        items[0],
        { label: '...', href: undefined },
        { label: '...', href: undefined },
        items[items.length - 1],
      ];
    }
  };

  const displayItems = getDisplayItems();

  return (
    <View className='flex-row items-center justify-between p-[18px]'>
      <View className='flex-row items-center'>
        {displayItems.map((item, index) => (
          <React.Fragment key={`${item.label}-${index}`}>
            {index > 0 && (
              <ChevronRight size={16} className='dark:text-white' />
            )}
            {item.href ? (
              <TouchableOpacity onPress={() => handlePress(item.href!)}>
                <ThemedText
                  className={cn(
                    'text-sm text-[#909090]',
                    index === displayItems.length - 1 &&
                      'text-[#313131] dark:text-white'
                  )}
                >
                  {item.label}
                </ThemedText>
              </TouchableOpacity>
            ) : (
              <ThemedText
                className={cn(
                  'text-sm text-[#909090]',
                  index === displayItems.length - 1 &&
                    'text-[#313131] dark:text-white'
                )}
              >
                {item.label}
              </ThemedText>
            )}
          </React.Fragment>
        ))}
      </View>

      {BreadcrumbRightComponent}
    </View>
  );
}

export default Breadcrumb;
