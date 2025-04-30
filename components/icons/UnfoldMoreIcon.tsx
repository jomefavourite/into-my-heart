import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { useColorScheme } from '~/hooks/useColorScheme';

const UnfoldMoreIcon = (props: SvgProps) => {
  const { isDarkMode } = useColorScheme();

  return (
    <Svg width={24} height={24} fill='none' {...props}>
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M18 14s-4.419 5-6 5c-1.581 0-6-5-6-5'
      />
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M18 14s-4.419 5-6 5c-1.581 0-6-5-6-5M18 10s-4.419-5-6-5c-1.581 0-6 5-6 5'
      />
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M18 10s-4.419-5-6-5c-1.581 0-6 5-6 5'
      />
    </Svg>
  );
};
export default UnfoldMoreIcon;
