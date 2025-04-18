import ThemedText from '~/components/ThemedText';
import ArrowLeftIcon from '~/assets/icons/ArrowLeftIcon';
import { useRouter } from 'expo-router';
import { Button } from './ui/button';
import { View } from 'react-native';

type BackHeaderProps = {
  RightComponent?: React.ReactNode;
  TitleComponent?: React.ReactNode;
  title?: string;
};

export default function BackHeader({
  RightComponent,
  TitleComponent,
  title,
}: BackHeaderProps) {
  const router = useRouter();

  return (
    <View className='items-center justify-between flex-row py-[18px]'>
      <Button size={'icon'} variant={'ghost'} onPress={() => router.back()}>
        <ArrowLeftIcon />
      </Button>

      {TitleComponent ? (
        <>{TitleComponent}</>
      ) : (
        <ThemedText size={16} variant='medium'>
          {title}
        </ThemedText>
      )}

      {RightComponent ? (
        <>{RightComponent}</>
      ) : (
        <View style={{ width: 35, height: 35 }} />
      )}
    </View>
  );
}
