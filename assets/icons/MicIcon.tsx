import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { useColorScheme } from '~/hooks/useColorScheme';
const MicIcon = (props: SvgProps) => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <Svg width={24} height={24} fill='none' {...props}>
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeWidth={1.5}
        d='M17 7v4a5 5 0 0 1-10 0V7a5 5 0 0 1 10 0Z'
      />
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeWidth={1.5}
        d='M20 11a8 8 0 0 1-8 8m0 0a8 8 0 0 1-8-8m8 8v3m0 0h3m-3 0H9'
      />
    </Svg>
  );
};
export default MicIcon;
