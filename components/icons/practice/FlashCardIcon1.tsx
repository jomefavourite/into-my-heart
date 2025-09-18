import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { useColorScheme } from '@/hooks/useColorScheme';

function FlashCardIcon1(props: SvgProps) {
  const { isDarkMode } = useColorScheme();

  const fillColor = isDarkMode ? '#FFFFFF' : '#313131';
  const strokeColor = isDarkMode ? '#FFFFFF' : '#313131';
  const cardStrokeColor = isDarkMode ? '#313131' : '#fff';
  const textStrokeColor = isDarkMode ? '#313131' : '#fff';

  return (
    <Svg width={60} height={52} viewBox='0 0 60 52' fill='none' {...props}>
      <Path
        d='M42.311 47.875c2.74-1.532 3.671-4.898 5.535-11.633l2.635-9.523c1.864-6.735 2.796-10.102 1.214-12.754-1.582-2.653-5.06-3.555-12.014-5.36L34.763 7.33c-6.955-1.805-10.432-2.707-13.172-1.176-1.95 1.09-2.985 3.112-4.091 6.616'
        fill={fillColor}
      />
      <Path
        d='M42.311 47.875c2.74-1.532 3.671-4.898 5.535-11.633l2.635-9.523c1.864-6.735 2.796-10.102 1.214-12.754-1.582-2.653-5.06-3.555-12.014-5.36L34.763 7.33c-6.955-1.805-10.432-2.707-13.172-1.176-1.95 1.09-2.985 3.112-4.091 6.616'
        stroke={strokeColor}
        strokeWidth={2.75}
      />
      <Path
        d='M7.5 27.875c0-7.071 0-10.607 2.197-12.803 2.196-2.197 5.732-2.197 12.803-2.197h5c7.071 0 10.606 0 12.803 2.197C42.5 17.268 42.5 20.804 42.5 27.875v12.5c0 7.071 0 10.606-2.197 12.803-2.197 2.197-5.732 2.197-12.803 2.197h-5c-7.071 0-10.607 0-12.803-2.197C7.5 50.981 7.5 47.446 7.5 40.375v-12.5z'
        fill={fillColor}
        stroke={cardStrokeColor}
        strokeWidth={2.75}
      />
      <Path
        d='M34.09 31.738H16.364M31.364 37.193H19.093'
        stroke={textStrokeColor}
        strokeWidth={2.75}
        strokeLinecap='round'
      />
    </Svg>
  );
}

export default FlashCardIcon1;
