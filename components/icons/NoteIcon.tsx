import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { useColorScheme } from '@/hooks/useColorScheme';
const NoteIcon = (props: SvgProps) => {
  const { isDarkMode } = useColorScheme();

  return (
    <Svg width={24} height={24} fill='none' {...props}>
      <Path
        stroke={isDarkMode ? '#303030' : '#fff'}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M17 2v2m-5-2v2M7 2v2M3.5 10c0-3.3 0-4.95 1.025-5.975C5.55 3 7.2 3 10.5 3h3c3.3 0 4.95 0 5.975 1.025C20.5 5.05 20.5 6.7 20.5 10v5c0 3.3 0 4.95-1.025 5.975C18.45 22 16.8 22 13.5 22h-3c-3.3 0-4.95 0-5.975-1.025C3.5 19.95 3.5 18.3 3.5 15v-5Z'
      />
      <Path
        stroke={isDarkMode ? '#303030' : '#fff'}
        strokeLinecap='round'
        strokeWidth={1.5}
        d='M8 15h4m-4-5h8'
      />
    </Svg>
  );
};
export default NoteIcon;
