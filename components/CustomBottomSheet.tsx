import React, { forwardRef, memo } from 'react';
import BottomSheet, { BottomSheetProps } from '@gorhom/bottom-sheet';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

type CustomBottomSheetProps = Omit<
  BottomSheetProps,
  'backgroundStyle' | 'style'
>;

const CustomBottomSheet = forwardRef<
  BottomSheetMethods,
  CustomBottomSheetProps
>((props, ref) => {
  const { isDarkMode } = useColorScheme();

  const defaultBackgroundStyle = {
    backgroundColor: isDarkMode ? '#313131' : '#fff',
  };

  const defaultStyle = {
    // shadowColor: isDarkMode ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.1)',
    // shadowOffset: {
    //   width: 0,
    //   height: -4,
    // },
    // shadowOpacity: 1,
    // shadowRadius: 26,
    elevation: 5, // for Android shadow
    borderRadius: 30,
  };

  return (
    <BottomSheet
      ref={ref}
      backgroundStyle={{
        backgroundColor: isDarkMode ? '#313131' : '#fff',
      }}
      style={{
        boxShadow: isDarkMode
          ? '0px -4px 26px rgba(0,0,0, 0.5)'
          : '0px -4px 26px rgba(0,0,0, 0.1)',
        borderRadius: 30,
      }}
      enablePanDownToClose={true}
      {...props}
    />
  );
});

CustomBottomSheet.displayName = 'CustomBottomSheet';

export default memo(CustomBottomSheet);
