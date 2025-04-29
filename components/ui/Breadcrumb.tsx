import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Href, router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useColorScheme } from '~/hooks/useColorScheme';
import ThemedText from '../ThemedText';
import { cn } from '~/lib/utils';

type BreadcrumbItem = {
  label: string;
  href?: Href;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const { isDarkMode } = useColorScheme();

  // const textColor = isDark ? colors.dark.text.primary : colors.light.text.primary;
  // const secondaryTextColor = isDark ? colors.dark.text.secondary : colors.light.text.secondary;

  return (
    <View className='p-[18px] flex-row items-center'>
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          {index > 0 && (
            <ChevronRight
              size={16}
              // color={secondaryTextColor}
              style={styles.separator}
            />
          )}
          {item.href ? (
            <TouchableOpacity onPress={() => router.push(item.href!)}>
              <ThemedText
                style={[
                  styles.link,
                  // { color: colors.primary }
                ]}
                className={cn(
                  'text-[#909090]',
                  index === items.length - 1 && 'text-[#313131]'
                )}
              >
                {item.label}
              </ThemedText>
            </TouchableOpacity>
          ) : (
            <ThemedText style={[styles.text]}>{item.label}</ThemedText>
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: spacing.lg,
    // paddingVertical: spacing.md,
  },
  separator: {
    // marginHorizontal: spacing.xs,
  },
  link: {
    // fontFamily: 'Inter-SemiBold',
    // fontSize: typography.body.small,
  },
  text: {
    fontFamily: 'Inter-SemiBold',
    // fontSize: typography.body.small,
  },
});
