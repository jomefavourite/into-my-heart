import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { useColorScheme } from '@/hooks/useColorScheme';

function RecitationIcon(props: SvgProps) {
  const { isDarkMode } = useColorScheme();

  const strokeColor = isDarkMode ? '#FFFFFF' : '#313131';
  const fillColor = isDarkMode ? '#FFFFFF' : '#313131';
  const pathStrokeColor = isDarkMode ? '#FFFFFF' : '#303030';

  return (
    <Svg width={72} height={62} viewBox='0 0 72 62' fill='none' {...props}>
      <Path
        d='M45.209 21.13l2.079 9.782c1.435 6.753-2.875 13.39-9.628 14.826-6.753 1.435-13.39-2.876-14.826-9.628l-2.079-9.782c-1.435-6.752 2.875-13.39 9.628-14.825 6.753-1.436 13.39 2.875 14.826 9.628z'
        fill={fillColor}
        stroke={pathStrokeColor}
        strokeWidth={3}
      />
      <Path
        d='M54.626 29.354c2.296 10.804-4.6 21.424-15.405 23.72m0 0c-10.804 2.297-21.424-4.6-23.721-15.404m23.721 15.405l1.56 7.336m0 0l7.336-1.56m-7.336 1.56l-7.337 1.56'
        stroke={strokeColor}
        strokeWidth={4}
        strokeLinecap='round'
      />
    </Svg>
  );
}

export default RecitationIcon;
