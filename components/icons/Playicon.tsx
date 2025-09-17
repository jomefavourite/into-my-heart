import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { useColorScheme } from '@/hooks/useColorScheme';
const PlayIcon = (props: SvgProps) => {
  const { isDarkMode } = useColorScheme();
  return (
    <Svg width={24} height={24} fill='none' {...props}>
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M18.89 12.846c-.353 1.343-2.023 2.292-5.364 4.19-3.23 1.835-4.845 2.752-6.146 2.384a3.254 3.254 0 0 1-1.424-.841C5 17.614 5 15.743 5 12s0-5.614.956-6.579a3.254 3.254 0 0 1 1.424-.84c1.301-.37 2.916.548 6.146 2.383 3.34 1.898 5.011 2.847 5.365 4.19a3.325 3.325 0 0 1 0 1.692Z'
      />
    </Svg>
  );
};
export default PlayIcon;
