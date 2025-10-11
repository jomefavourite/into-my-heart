import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { useColorScheme } from '@/hooks/useColorScheme';

const MoveCollectionIcon = (props: SvgProps) => {
  const { isDarkMode } = useColorScheme();

  return (
    <Svg
      width={24}
      height={24}
      fill='none'
      stroke={isDarkMode ? '#fff' : '#303030'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      className='lucide lucide-folder-symlink-icon lucide-folder-symlink'
      {...props}
    >
      <Path d='M2 9.35V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h7' />
      <Path d='m8 16 3-3-3-3' />
    </Svg>
  );
};
export default MoveCollectionIcon;
