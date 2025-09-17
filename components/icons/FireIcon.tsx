import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { useColorScheme } from '@/hooks/useColorScheme';

const FireIcon = (props: SvgProps) => {
  const { isDarkMode } = useColorScheme();

  return (
    <Svg width={24} height={24} fill='none' {...props}>
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M12 21.5a8 8 0 0 0 8-8c0-2.96-1.609-6.893-4-9.165l-2 2.664-3.5-4.5C7 5 4 9.595 4 13.501a8 8 0 0 0 8 8Z'
      />
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M12 18.5c2.21 0 4-2.016 4-4.5 0-.792-.181-1.535-.5-2.181l-2 1.68-3-4c-1 1-2.5 2.612-2.5 4.5 0 2.485 1.79 4.5 4 4.5Z'
      />
    </Svg>
  );
};
export default FireIcon;
