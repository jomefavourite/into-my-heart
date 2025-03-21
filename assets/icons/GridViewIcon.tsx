import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { useColorScheme } from '~/hooks/useColorScheme';

const GridViewIcon = (props: SvgProps) => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <Svg width={24} height={24} fill='none' {...props}>
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeWidth={1.5}
        d='M2 11.4c0-1.158.097-1.4.56-1.4h6.88c.463 0 .56.242.56 1.4v1.2c0 1.158-.097 1.4-.56 1.4H2.56c-.463 0-.56-.242-.56-1.4v-1.2ZM2 3.4c0-1.158.097-1.4.56-1.4h6.88c.463 0 .56.242.56 1.4v1.2C10 5.758 9.903 6 9.44 6H2.56C2.097 6 2 5.758 2 4.6V3.4ZM14 3.4c0-1.158.097-1.4.56-1.4h6.88c.463 0 .56.242.56 1.4v1.2c0 1.158-.097 1.4-.56 1.4h-6.88c-.463 0-.56-.242-.56-1.4V3.4ZM14 11.4c0-1.158.097-1.4.56-1.4h6.88c.463 0 .56.242.56 1.4v1.2c0 1.158-.097 1.4-.56 1.4h-6.88c-.463 0-.56-.242-.56-1.4v-1.2ZM14 19.4c0-1.158.097-1.4.56-1.4h6.88c.463 0 .56.242.56 1.4v1.2c0 1.158-.097 1.4-.56 1.4h-6.88c-.463 0-.56-.242-.56-1.4v-1.2ZM2 19.4c0-1.158.097-1.4.56-1.4h6.88c.463 0 .56.242.56 1.4v1.2c0 1.158-.097 1.4-.56 1.4H2.56c-.463 0-.56-.242-.56-1.4v-1.2Z'
      />
    </Svg>
  );
};
export default GridViewIcon;
