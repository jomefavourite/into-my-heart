import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { useColorScheme } from '@/hooks/useColorScheme';
const MailValidationIcon = (props: SvgProps) => {
  const { isDarkMode } = useColorScheme();
  return (
    <Svg width={24} height={24} fill='none' {...props}>
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='m6.912 6.838 2.942 1.74c1.715 1.013 2.4 1.013 4.116 0l2.942-1.74M14.912 17.338s.5 0 1 1c0 0 1.588-2.5 3-3'
      />
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='m22 10.312-.041-3.874c-.011-1.475-.808-4.426-3.905-4.426H6.105C4.737 1.912 2 2.347 2 7.142v7.11c0 1.22.272 2.863 1.61 3.853.866.64 2.001.7 3.074.753l2.247.111'
      />
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeWidth={1.5}
        d='M21.98 16.959c0 2.784-2.245 5.04-5.016 5.04s-5.018-2.256-5.018-5.04c0-2.784 2.247-5.041 5.018-5.041 2.77 0 5.017 2.257 5.017 5.04Z'
      />
    </Svg>
  );
};
export default MailValidationIcon;
