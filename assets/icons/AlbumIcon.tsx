import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { useColorScheme } from '~/hooks/useColorScheme';

const AlbumIcon = (props: SvgProps) => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <Svg width={24} height={24} fill='none' {...props}>
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeWidth={1.5}
        d='M6 17.974c.129 1.309.42 2.19 1.077 2.847C8.256 22 10.154 22 13.949 22s5.693 0 6.872-1.18C22 19.643 22 17.745 22 13.95c0-3.795 0-5.693-1.18-6.872-.656-.657-1.537-.948-2.846-1.077'
      />
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeWidth={1.5}
        d='M2 10c0-3.771 0-5.657 1.172-6.828C4.343 2 6.229 2 10 2c3.771 0 5.657 0 6.828 1.172C18 4.343 18 6.229 18 10c0 3.771 0 5.657-1.172 6.828C15.657 18 13.771 18 10 18c-3.771 0-5.657 0-6.828-1.172C2 15.657 2 13.771 2 10Z'
      />
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M2 11.118a14.608 14.608 0 0 1 1.872-.116c2.652-.049 5.239.674 7.3 2.04C13.081 14.31 14.424 16.053 15 18'
      />
      <Path fill={isDarkMode ? '#fff' : '#303030'} d='M13 7h.009-.01Z' />
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M13 7h.009'
      />
    </Svg>
  );
};
export default AlbumIcon;
