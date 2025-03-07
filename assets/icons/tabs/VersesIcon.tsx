import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
const VersesIcon = (props: SvgProps) => (
  <Svg fill='none' {...props}>
    <Path
      stroke='#303030'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M6.5 19a3 3 0 0 1-3-3V8c0-2.828 0-4.243.879-5.121C5.257 2 6.672 2 9.5 2h5a3 3 0 0 1 3 3'
    />
    <Path
      stroke='#303030'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M14.5 5h-2c-2.828 0-4.243 0-5.121.879C6.5 6.757 6.5 8.172 6.5 11v5c0 2.828 0 4.243.879 5.121C8.257 22 9.672 22 12.5 22h1.343c.818 0 1.226 0 1.594-.152.368-.152.656-.441 1.235-1.02l2.656-2.656c.579-.579.867-.867 1.02-1.235.152-.368.152-.776.152-1.594V11c0-2.828 0-4.243-.879-5.121C18.743 5 17.328 5 14.5 5Z'
    />
    <Path
      stroke='#303030'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M15 21.5v-1c0-1.886 0-2.828.586-3.414.586-.586 1.528-.586 3.414-.586h1M10.001 13h4m-4-4h7'
    />
  </Svg>
);
export default VersesIcon;
