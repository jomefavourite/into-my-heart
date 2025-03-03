import React from 'react';
import { Box } from './ui/box';
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from './ui/button';
import { SvgProps } from 'react-native-svg';
import AddIcon from '../assets/icons/light=add-01.svg';
import AddCircleIcon from '../assets/icons/light=add-circle.svg';

type Props = {
  leftIcon?: boolean;
  rightIcon?: boolean;
  Icon?: React.FC<SvgProps>;
};

const CustomButton = ({ leftIcon = true, rightIcon = true }: Props) => {
  return (
    <Box>
      <Button
        size='lg'
        variant='solid'
        action='secondary'
        className='w-full rounded-full'
      >
        {leftIcon && <ButtonIcon as={AddIcon} className='text-emerald-500' />}
        <ButtonText className=''>Hello</ButtonText>
        {rightIcon && (
          <ButtonIcon
            as={AddCircleIcon}
            className='text-red-500 text-xl font-bold stroke-[1.5]'
            size='lg'
          />
        )}
      </Button>
    </Box>
  );
};

export default CustomButton;
