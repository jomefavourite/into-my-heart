import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { useColorScheme } from '@/hooks/useColorScheme';

function FillInBlanksIcon(props: SvgProps) {
  const { isDarkMode } = useColorScheme();

  const fillColor = isDarkMode ? '#FFFFFF' : '#313131';

  return (
    <Svg width={74} height={63} viewBox='0 0 74 63' fill='none' {...props}>
      <Path
        d='M42.489 22.315a7.5 7.5 0 10-13.725-3.422c-5.547-1.362-8.554-1.903-10.943-.467-2.389 1.435-3.323 4.343-4.725 9.88a7.5 7.5 0 11-3.423 13.728c-1.36 5.546-1.901 8.552-.466 10.94 1.435 2.39 4.344 3.324 9.88 4.725a7.5 7.5 0 1113.728 3.423c5.546 1.362 8.552 1.902 10.941.467 2.389-1.436 3.323-4.344 4.725-9.881a7.5 7.5 0 103.422-13.725c1.362-5.548 1.902-8.554.467-10.943-1.435-2.39-4.344-3.323-9.881-4.725z'
        fill={fillColor}
      />
    </Svg>
  );
}

export default FillInBlanksIcon;
