import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { useColorScheme } from '~/hooks/useColorScheme';
const TimeScheduleIcon = (props: SvgProps) => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <Svg width={24} height={24} fill='none' {...props}>
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M12 8v4l1.5 1.5'
      />
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeWidth={1.5}
        d='M19.545 16.453C21.182 17.337 22 17.78 22 18.5c0 .721-.818 1.163-2.455 2.047l-1.114.601c-1.257.679-1.885 1.018-2.187.772-.74-.605.413-2.164.696-2.716.288-.56.282-.858 0-1.408-.283-.552-1.436-2.111-.696-2.716.302-.246.93.093 2.187.772l1.114.601Z'
      />
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeWidth={1.5}
        d='M13.026 21.948c-.337.034-.68.052-1.026.052-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10c0 .685-.069 1.354-.2 2'
      />
    </Svg>
  );
};
export default TimeScheduleIcon;
