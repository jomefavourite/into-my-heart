import * as React from 'react';
import Svg, { SvgProps, G, Path } from 'react-native-svg';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ProfileIconProps extends SvgProps {
  focused: boolean;
  inverse?: boolean;
}

const ProfileIcon = ({ focused, inverse, ...rest }: ProfileIconProps) => {
  const { isDarkMode } = useColorScheme();

  // Define base colors
  const primaryColor = isDarkMode ? '#FFFFFF' : '#303030';
  const secondaryColor = isDarkMode ? '#303030' : '#FFFFFF';
  const inactiveColor = isDarkMode ? '#707070' : '#707070';

  // Determine colors based on state
  let fillColor: string;
  let strokeColor: string;

  if (inverse) {
    // Inverse mode: colors are flipped
    fillColor = focused ? secondaryColor : 'none';
    strokeColor = focused ? primaryColor : inactiveColor;
  } else {
    // Normal mode
    fillColor = focused ? primaryColor : 'none';
    strokeColor = focused ? primaryColor : inactiveColor;
  }

  return (
    <Svg width={24} height={24} fill='none' {...rest}>
      <G stroke={strokeColor} fill={fillColor} strokeWidth={1.5}>
        <Path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M7.078 15.482c-1.415.842-5.125 2.562-2.865 4.715C5.316 21.248 6.545 22 8.09 22h8.818c1.546 0 2.775-.752 3.878-1.803 2.26-2.153-1.45-3.873-2.865-4.715a10.663 10.663 0 0 0-10.844 0Z'
        />
        <Path d='M17 6.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z' />
      </G>
    </Svg>
  );
};
export default ProfileIcon;
