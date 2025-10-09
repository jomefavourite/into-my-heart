import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface ChevronUpIconProps extends SvgProps {
  color?: string;
}

const ChevronUpIcon = ({ color = '#707070', ...props }: ChevronUpIconProps) => {
  return (
    <Svg width={16} height={16} fill='none' {...props}>
      <Path
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='m4 10 4-4 4 4'
      />
    </Svg>
  );
};

export default ChevronUpIcon;
