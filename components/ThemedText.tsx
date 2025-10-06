import React from 'react';
import { StyleSheet, TextProps } from 'react-native';
import { cn } from '@/lib/utils';
import { Text } from './ui/text';

type FontVariant = 'regular' | 'medium' | 'semibold' | 'bold';
type FontSize = 12 | 13 | 14 | 15 | 16 | 18 | 22 | 27 | 44;

const fontMap: { [key in FontVariant]: string } = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

const sizeMap: { [key in FontSize]: number } = {
  12: 12,
  13: 13,
  14: 14,
  15: 15,
  16: 16,
  18: 18,
  22: 22,
  27: 27,
  44: 44,
};

interface ThemedTextProps extends TextProps {
  variant?: FontVariant;
  size?: FontSize;
  className?: string;
  children: React.ReactNode;
}

const ThemedText: React.FC<ThemedTextProps> = ({
  variant = 'regular',
  size = 16,
  className = '',
  children,
  ...props
}) => {
  return (
    <Text className={cn(className)} {...props}>
      {children}
    </Text>
  );
};

export default ThemedText;
