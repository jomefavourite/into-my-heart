import React, { Children, ReactNode } from 'react';
import { SvgProps } from 'react-native-svg';
import { Button } from './ui/button';
import { Text } from './ui/text';
import { Pressable } from 'react-native';
import { cn } from '~/lib/utils';
import ThemedText from './ThemedText';

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
  textClassName?: string;
  children?: string;
};

const CustomButton = ({
  variant = 'default',
  size = 'default',
  leftIcon = false,
  rightIcon = false,
  Icon = () => null,
  className,
  textClassName,
  children = '',
  ...props
}: Props): React.ReactNode => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'rounded-full flex flex-row justify-center items-center space-x-2 ',
        className
      )}
      {...props}
    >
      {leftIcon && <Icon />}
      <ThemedText
        size={14}
        variant='medium'
        className='text-center leading-[20px]'
      >
        {children}
      </ThemedText>
      {rightIcon && <Icon />}
    </Button>
  );
};

export default CustomButton;
