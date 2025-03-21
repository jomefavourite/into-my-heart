import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { useColorScheme } from '~/hooks/useColorScheme';

const GoForward15secIcon = (props: SvgProps) => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <Svg width={24} height={24} fill='none' {...props}>
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='m12 5 1.104-1.545c.41-.576.617-.864.487-1.13-.13-.268-.46-.283-1.12-.314C12.315 2.004 12.158 2 12 2 6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10a9.985 9.985 0 0 0-4-8'
      />
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeWidth={1.5}
        d='M8 11c.528-.42 1.008-1.113 1.308-.984.3.128.204.552.204 1.212v4.776'
      />
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M16 10h-2.64a.5.5 0 0 0-.49.402l-.366 2.102c.636-.264.957-.361 1.673-.361 1.036 0 1.927.637 1.825 1.957.018 1.56-1.242 1.92-1.825 1.9-.584-.02-1.517.2-1.677-1'
      />
    </Svg>
  );
};
export default GoForward15secIcon;
