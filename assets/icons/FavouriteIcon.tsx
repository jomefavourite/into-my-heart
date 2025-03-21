import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { useColorScheme } from '~/hooks/useColorScheme';

const FavouriteIcon = (props: SvgProps) => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <Svg width={24} height={24} fill='none' {...props}>
      <Path
        stroke={isDarkMode ? '#fff' : '#303030'}
        strokeLinecap='round'
        strokeWidth={1.5}
        d='M19.463 3.994c-2.682-1.645-5.023-.982-6.429.074-.576.433-.864.65-1.034.65-.17 0-.458-.217-1.034-.65-1.406-1.056-3.747-1.719-6.429-.074-3.519 2.159-4.315 9.28 3.803 15.29C9.886 20.427 10.659 21 12 21c1.341 0 2.114-.572 3.66-1.717 8.118-6.008 7.322-13.13 3.803-15.289Z'
      />
    </Svg>
  );
};
export default FavouriteIcon;
