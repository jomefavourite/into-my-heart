import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { useColorScheme } from '~/hooks/useColorScheme';
interface GoalsIconProps extends SvgProps {
  focused: boolean;
}

const GoalsIcon: React.FC<GoalsIconProps> = ({ focused, ...rest }) => {
  const { isDarkMode } = useColorScheme();

  const fillColor = focused
    ? isDarkMode
      ? '#FFFFFF' // Dark mode focused color
      : '#303030' // Light mode focused color
    : 'none';

  const strokeColor = focused ? (isDarkMode ? '#fff' : '#303030') : '#707070';
  return (
    <Svg width={24} height={24} fill='none' {...rest}>
      <Path
        stroke={strokeColor}
        strokeLinecap='round'
        strokeWidth={1.5}
        d='M17 12a5 5 0 1 1-5-5'
      />
      <Path
        stroke={strokeColor}
        strokeLinecap='round'
        strokeWidth={1.5}
        d='M14 2.2c-.646-.131-1.315-.2-2-.2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10c0-.685-.069-1.354-.2-2'
      />
      <Path
        stroke={strokeColor}
        fill={fillColor}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='m12.03 11.962 4.553-4.553m3.157-3.064-.553-1.988a.48.48 0 0 0-.761-.24c-1.436 1.173-3 2.754-1.723 5.247 2.574 1.2 4.044-.418 5.17-1.779a.486.486 0 0 0-.248-.775l-1.885-.465Z'
      />
    </Svg>
  );
};
export default GoalsIcon;
