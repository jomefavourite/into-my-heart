import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { useColorScheme } from '@/hooks/useColorScheme';
const IdeaIcon = (props: SvgProps) => {
  const { isDarkMode } = useColorScheme();

  return (
    <Svg width={24} height={24} fill='none' {...props}>
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeWidth={1.517}
        d='M6.09 14.999a6.86 6.86 0 0 1-.59-2.794C5.5 8.5 8.41 5.499 12 5.499s6.5 3.002 6.5 6.706a6.86 6.86 0 0 1-.59 2.794'
      />
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeWidth={1.517}
        d='M6.09 14.999a6.86 6.86 0 0 1-.59-2.794C5.5 8.5 8.41 5.499 12 5.499s6.5 3.002 6.5 6.706a6.86 6.86 0 0 1-.59 2.794'
      />
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.517}
        d='M12 1.999v1M12 1.999v1M22 11.999h-1M22 11.999h-1M3 11.999H2M3 11.999H2M19.07 4.928l-.707.707M19.07 4.928l-.707.707M5.637 5.636l-.707-.707M5.637 5.636l-.707-.707M14.517 19.305c1.01-.326 1.416-1.251 1.53-2.181.034-.278-.195-.509-.475-.509H8.477a.483.483 0 0 0-.488.534c.112.928.394 1.606 1.464 2.156m5.064 0H9.453m5.064 0c-.121 1.945-.683 2.716-2.51 2.694-1.954.036-2.404-.916-2.554-2.694'
      />
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.517}
        d='M14.517 19.305c1.01-.326 1.416-1.251 1.53-2.181.034-.278-.195-.509-.475-.509H8.477a.483.483 0 0 0-.488.534c.112.928.394 1.606 1.464 2.156m5.064 0H9.453m5.064 0c-.121 1.945-.683 2.716-2.51 2.694-1.954.036-2.404-.916-2.554-2.694'
      />
    </Svg>
  );
};
export default IdeaIcon;
