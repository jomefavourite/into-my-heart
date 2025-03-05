import React from 'react';
import { SvgProps } from 'react-native-svg';
import { View } from 'react-native';

type Props = {
  leftIcon?: boolean;
  rightIcon?: boolean;
  Icon?: React.FC<SvgProps>;
};

// Note:
// For Icons you need to specify the right stroke width in the classname

const CustomButton = ({ leftIcon = false, rightIcon = false }: Props) => {
  return (
    <View>
      {/* <Button size='sm' className='w-full rounded-full'>
        {leftIcon && (
          <ButtonIcon as={AddIcon} className='text-emerald-500 stroke-[]' />
        )}

        <ButtonText className=''>Hello</ButtonText>

        {rightIcon && (
          <ButtonIcon
            as={AddCircleIcon}
            className='text-red-500 text-xl font-bold stroke-[2]'
            size='lg'
          />
        )}
      </Button> */}

      {/* <Button alignSelf='center' size='$6'>
        Large
      </Button> */}

      {/* <VStack space='lg' className='pt-4'> */}
      {/* <Button size='sm' className='rounded-full'>
        <ButtonText>Submit</ButtonText>
      </Button> */}
      {/* <Box className="flex flex-row"> */}
      {/* <Button variant="link" size="sm" className="p-0"> */}
      {/* <ButtonIcon className="mr-1" size="md" as={ArrowLeftIcon} /> */}
      {/* <ButtonText>Back to login</ButtonText> */}
      {/* </Button> */}
      {/* </Box> */}
      {/* </VStack> */}
    </View>
  );
};

export default CustomButton;
