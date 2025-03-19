import React from 'react';
import { type TextProps } from 'react-native';
import { Text } from './ui/text';
import { cn } from '~/lib/utils'; // Assuming you have a utility for class names

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'medium' | 'semibold' | 'title' | 'subtitle' | 'link';
  children: React.ReactNode;
};

const ThemedText = ({
  type = 'default',
  className,
  children,
  ...props
}: ThemedTextProps) => {
  const textStyles = cn(
    'font-inter',
    'text-base', // Default font size, can be adjusted
    {
      'font-normal': type === 'default', // FontWeight 400
      'font-medium': type === 'medium', // FontWeight 500
      'font-semibold': type === 'semibold', // FontWeight 600
      'text-3xl font-bold leading-8': type === 'title', // Example title styles
      'text-xl font-bold': type === 'subtitle', // Example subtitle styles
      'text-base text-blue-600': type === 'link', // Example link styles
    },
    className
  );

  return (
    <Text className={textStyles} {...props}>
      {children}
    </Text>
  );
};

export default ThemedText;
