import { View, type ViewProps } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  ...otherProps
}: ThemedViewProps) {
  useColorScheme();

  return <View style={[style]} {...otherProps} />;
}
