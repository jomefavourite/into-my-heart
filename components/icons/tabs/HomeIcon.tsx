import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { useColorScheme } from '~/hooks/useColorScheme';

interface HomeIconProps extends SvgProps {
  focused: boolean;
  inverse?: boolean;
}

const HomeIcon = ({ focused, inverse, ...rest }: HomeIconProps) => {
  const { isDarkMode } = useColorScheme();

  let fillColor: string;
  if (inverse) {
    fillColor = focused ? (isDarkMode ? '#303030' : '#FFFFFF') : 'none';
  } else {
    fillColor = focused ? (isDarkMode ? '#FFFFFF' : '#303030') : 'none';
  }

  const strokeColor = inverse
    ? isDarkMode
      ? '#303030'
      : '#FFFFFF'
    : isDarkMode
      ? '#FFFFFF'
      : '#303030';

  const smallDashColor = inverse
    ? focused
      ? isDarkMode
        ? '#fff'
        : '#303030'
      : isDarkMode
        ? '#303030'
        : '#fff'
    : focused
      ? isDarkMode
        ? '#303030'
        : '#fff'
      : isDarkMode
        ? '#fff'
        : '#303030';

  return (
    <Svg width={24} height={24} fill='none' {...rest}>
      <Path
        stroke={strokeColor}
        fill={fillColor}
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M2.351 13.213c-.353-2.297-.53-3.445-.095-4.464.434-1.018 1.398-1.715 3.325-3.108L7.021 4.6C9.418 2.867 10.617 2 12 2s2.582.867 4.979 2.6l1.44 1.041c1.927 1.393 2.89 2.09 3.325 3.108.434 1.019.258 2.167-.095 4.464l-.301 1.96c-.5 3.256-.751 4.884-1.919 5.856-1.168.971-2.875.971-6.29.971H10.86c-3.415 0-5.122 0-6.29-.971-1.168-.972-1.418-2.6-1.919-5.857l-.3-1.959Z'
      />
      <Path
        stroke={smallDashColor}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M10 18h4'
      />
    </Svg>
  );
};
export default HomeIcon;
