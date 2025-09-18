import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { useColorScheme } from '@/hooks/useColorScheme';
const RadioButtonIcon = (props: SvgProps) => {
  const { isDarkMode } = useColorScheme();

  return (
    <Svg width={24} height={24} fill='none' {...props}>
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z'
      />
      <Path
        fill={isDarkMode ? '#fff' : '#303030'}
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'
      />
    </Svg>
  );
};
export default RadioButtonIcon;
