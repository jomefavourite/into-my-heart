import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { useColorScheme } from '~/hooks/useColorScheme';

const ShareIcon = (props: SvgProps) => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  return (
    <Svg width={24} height={24} fill='none' {...props}>
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeWidth={1.5}
        d='M18 7c.774.16 1.359.429 1.828.876C21 8.992 21 10.788 21 14.38c0 3.592 0 5.388-1.172 6.504C18.657 22 16.771 22 13 22h-2c-3.771 0-5.657 0-6.828-1.116C3 19.768 3 17.972 3 14.38c0-3.592 0-5.388 1.172-6.504C4.642 7.429 5.226 7.16 6 7'
      />
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M12.025 2 12 14m.025-12a.685.685 0 0 0-.472.175C10.647 2.94 9 4.929 9 4.929M12.025 2c.146.006.291.064.422.174C13.353 2.94 15 4.93 15 4.93'
      />
    </Svg>
  );
};
export default ShareIcon;
