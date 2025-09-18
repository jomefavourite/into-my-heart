import React from 'react';
import { View, TouchableOpacity } from 'react-native';
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

  const bookName = String(bookURL || '');
  const chapter = Number(chapterURL || '');

  const handlePress = (href: Href) => {
    router.replace(`${href}?book=${bookName}&chapter=${chapter}` as Href);
  };

  return (
    <View className='flex-row justify-between items-center p-[18px]'>
      <View className='flex-row items-center'>
        {items.map((item, index) => (
          <React.Fragment key={item.label}>
            {index > 0 && <ChevronRight size={16} />}
            {item.href ? (
              <TouchableOpacity onPress={() => handlePress(item.href!)}>
                <ThemedText
                  size={14}
                  className={cn(
                    'text-[#909090]',
                    index === items.length - 1 && 'text-[#313131]'
                  )}
                >
                  {item.label}
                </ThemedText>
              </TouchableOpacity>
            ) : (
              <ThemedText>{item.label}</ThemedText>
            )}
          </React.Fragment>
        ))}
      </View>

      {BreadcrumbRightComponent}
    </View>
  );
}

export default Breadcrumb;
