import React, { Children, ReactNode } from 'react';
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
  children?: string;
};

const CustomButton = ({
  variant = 'default',
  size = 'default',
  leftIcon = false,
  rightIcon = false,
  Icon = () => null,
  className,
  children = '',
  ...props
}: Props): React.ReactNode => {
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
      {leftIcon && <Icon />}
      <Text className='text-center leading-[20px]'>{children}</Text>
      {rightIcon && <Icon />}
    </Button>
  );
};

export default CustomButton;
