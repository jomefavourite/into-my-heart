import React from 'react';
import { SvgProps } from 'react-native-svg';
import { Button } from './ui/button';
import { Text } from './ui/text';

type Props = {
  leftIcon?: boolean;
  rightIcon?: boolean;
  Icon?: React.FC<SvgProps>;
};

const CustomButton = ({
  leftIcon = false,
  rightIcon = false,
  Icon = () => null,
}: Props) => {
  return (
    <Button
      variant={'outline'}
      size={'lg'}
      className={
        'rounded-full flex flex-row w-full justify-center items-center space-x-2 '
      }
    >
      {leftIcon && <Icon className='' />}
      <Text className='text-center leading-[20px]'>Hello</Text>
      {rightIcon && <Icon className='  text-red-500 dark:text-white' />}
    </Button>
  );
};

export default CustomButton;
