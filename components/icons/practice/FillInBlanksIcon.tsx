import * as React from 'react';
import Svg, { SvgProps, Path, G, Rect, Defs, ClipPath } from 'react-native-svg';

const FillInBlanksIcon = (props: SvgProps) => (
  <Svg width={54} height={51} fill='none' {...props}>
    <Path fill='#1E1E1E' d='M0 0h54v51H0z' />
    <Path
      fill='#444'
      d='M-414-541a2 2 0 0 1 2-2h621a2 2 0 0 1 2 2V517a2 2 0 0 1-2 2h-621a2 2 0 0 1-2-2V-541Z'
    />
    <Path
      fill='#fff'
      fillOpacity={0.1}
      d='M-412-542h621v-2h-621v2Zm622 1V517h2V-541h-2Zm-1 1059h-621v2h621v-2Zm-622-1V-541h-2V517h2Zm1 1a1 1 0 0 1-1-1h-2a3 3 0 0 0 3 3v-2Zm622-1a1 1 0 0 1-1 1v2a3 3 0 0 0 3-3h-2Zm-1-1059a1 1 0 0 1 1 1h2a3 3 0 0 0-3-3v2Zm-621-2a3 3 0 0 0-3 3h2a1 1 0 0 1 1-1v-2Z'
    />
    <G clipPath='url(#a)'>
      <Path fill='#fff' d='M-289-418H86v800h-375z' />
      <G clipPath='url(#b)'>
        <Path
          fill='#313131'
          d='M30.952 16.479a5.5 5.5 0 1 0-10.05-2.567c-4.063-1.021-6.266-1.43-8.023-.388-1.758 1.043-2.455 3.172-3.506 7.226a5.5 5.5 0 1 1-2.567 10.052c-1.022 4.062-1.43 6.264-.388 8.022 1.042 1.757 3.171 2.455 7.225 3.506a5.5 5.5 0 1 1 10.053 2.567c4.061 1.021 6.264 1.43 8.021.388 1.758-1.043 2.455-3.172 3.507-7.227a5.5 5.5 0 1 0 2.567-10.05c1.02-4.062 1.43-6.265.387-8.023-1.042-1.758-3.172-2.455-7.226-3.506Z'
        />
      </G>
    </G>
    <Defs>
      <ClipPath id='a'>
        <Path fill='#fff' d='M-289-418H86v800h-375z' />
      </ClipPath>
      <ClipPath id='b'>
        <Rect width={339} height={68} x={-271} y={-17} fill='#fff' rx={10} />
      </ClipPath>
    </Defs>
  </Svg>
);
export default FillInBlanksIcon;
