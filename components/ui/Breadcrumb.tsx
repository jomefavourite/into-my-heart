import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Href, router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useColorScheme } from '~/hooks/useColorScheme';
import ThemedText from '../ThemedText';
import { cn } from '~/lib/utils';
import { Button } from './button';
import RemoveCircleIcon from '../icons/RemoveCircleIcon';

type BreadcrumbItem = {
  label: string;
  href?: Href;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  canDelete?: boolean;
};

function Breadcrumb({ items, canDelete }: BreadcrumbProps) {
  const { isDarkMode } = useColorScheme();

  // const textColor = isDark ? colors.dark.text.primary : colors.light.text.primary;
  // const secondaryTextColor = isDark ? colors.dark.text.secondary : colors.light.text.secondary;

  return (
    <View className='flex-row justify-between items-center p-[18px]'>
      <View className='flex-row items-center'>
        {items.map((item, index) => (
          <React.Fragment key={item.label}>
            {index > 0 && <ChevronRight size={16} />}
            {item.href ? (
              <TouchableOpacity onPress={() => router.push(item.href!)}>
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

      {canDelete && (
        <Button
          size={'icon'}
          variant={'ghost'}
          // onPress={() => setShouldDelete(true)}
        >
          <RemoveCircleIcon />
        </Button>
      )}
    </View>
  );
}

export default Breadcrumb;
