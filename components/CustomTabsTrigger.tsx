import { View, Text } from 'react-native';
import React from 'react';
import ThemedText from './ThemedText';
import { TabsTrigger } from './ui/tabs';
import { cn } from '@/lib/utils';

export default function CustomTabsTrigger({
  value,
  children,
  activeValue,
}: {
  value: string;
  children: React.ReactNode;
  activeValue: string;
}) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        "data- flex-1 px-3 py-2 text-base font-medium text-[#313131] [font-family:'Inter',Helvetica] data-[state=active]:bg-[#313131] data-[state=active]:text-white data-[state=inactive]:text-[#707070] dark:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-[#313131] dark:data-[state=inactive]:text-[#909090]"
      )}
    >
      <ThemedText
        size={13}
        variant='medium'
        className={cn(
          'text-muted-foreground',
          value === activeValue && 'text-white dark:text-primary-foreground'
        )}
      >
        {children}
      </ThemedText>
    </TabsTrigger>
  );
}
