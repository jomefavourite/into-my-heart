import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { useColorScheme } from '@/hooks/useColorScheme';
const CameraIcon = (props: SvgProps) => {
  const { isDarkMode } = useColorScheme();

  return (
    <Svg width={24} height={24} fill='none' {...props}>
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeWidth={1.5}
        d='M7 6c-1.22.004-1.896.033-2.451.266-.778.327-1.41.93-1.78 1.696-.303.625-.352 1.426-.45 3.028l-.156 2.511c-.245 3.984-.368 5.977.8 7.238C4.134 22 6.104 22 10.044 22h3.915c3.94 0 5.91 0 7.079-1.261 1.169-1.261 1.046-3.254.8-7.238l-.155-2.51c-.099-1.603-.148-2.404-.45-3.03a3.473 3.473 0 0 0-1.78-1.695c-.556-.233-1.231-.262-2.452-.265'
      />
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='m17 7-.886-2.215c-.382-.955-.715-2.039-1.697-2.525C13.892 2 13.262 2 12 2c-1.262 0-1.892 0-2.417.26-.982.486-1.315 1.57-1.697 2.525L7 7'
      />
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeWidth={1.5}
        d='M15.5 14a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z'
      />
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M12 6h.009'
      />
    </Svg>
  );
};
export default CameraIcon;
