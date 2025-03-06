import React from 'react';
import { SvgProps } from 'react-native-svg';
import { Button } from './ui/button';
import { Text } from './ui/text';
import { Pressable } from 'react-native';
import { cn } from '~/lib/utils';

type Props = React.ComponentPropsWithoutRef<typeof Pressable> & {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  leftIcon?: boolean;
  rightIcon?: boolean;
  Icon?: React.FC<SvgProps>;
  className?: string;
};

const CustomButton = ({
  variant = 'default',
  size = 'default',
  leftIcon = false,
  rightIcon = false,
  Icon = () => null,
  className,
  ...props
}: Props) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'rounded-full flex flex-row w-full justify-center items-center space-x-2 ',
        className
      )}
      {...props}
    >
      {leftIcon && <Icon className='' />}
      <Text className='text-center leading-[20px]'>Hello</Text>
      {rightIcon && <Icon className='  text-red-500 dark:text-white' />}
    </Button>
  );
};

export default CustomButton;
