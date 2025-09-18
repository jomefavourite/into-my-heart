import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { useColorScheme } from '@/hooks/useColorScheme';

const AddIcon = (props: SvgProps) => {
  const { isDarkMode } = useColorScheme();

  return (
    <Svg width={24} height={24} fill='none' {...props}>
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M12 4v16M4 12h16'
      />
    </Svg>
  );
};
export default AddIcon;
