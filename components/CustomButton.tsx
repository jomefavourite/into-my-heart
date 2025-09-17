import React, { Children, ReactNode } from 'react';
import { SvgProps } from 'react-native-svg';
import { Button } from './ui/button';
import { Text } from './ui/text';
import { Pressable } from 'react-native';
import { cn } from '~/lib/utils';
import ThemedText from './ThemedText';
import { ActivityIndicator } from 'react-native';
import { useColorScheme } from '~/hooks/useColorScheme';

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
  isLoading?: boolean;
  innerElement?: ReactNode;
};

const CustomButton = ({
  variant = 'default',
  size = 'default',
  leftIcon = false,
  rightIcon = false,
  isLoading = false,
  Icon = () => null,
  className,
  textClassName,
  children = '',
  innerElement,
  ...props
}: Props): React.ReactNode => {
  const { isDarkMode } = useColorScheme();
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
      {innerElement && innerElement}
      {isLoading ? (
        <ActivityIndicator color={isDarkMode ? '#000' : '#fff'} />
      ) : (
        <ThemedText
          size={14}
          variant='medium'
          className='text-center leading-[20px]'
        >
          {children}
        </ThemedText>
      )}

      {rightIcon && <Icon />}
    </Button>
  );
};

export default CustomButton;
