import { useColorScheme as useNativewindColorScheme } from 'nativewind';

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativewindColorScheme();

  return {
    colorScheme: colorScheme ?? 'dark',
    isDarkMode: colorScheme === 'dark',
    setColorScheme,
    toggleColorScheme,
  };
}
