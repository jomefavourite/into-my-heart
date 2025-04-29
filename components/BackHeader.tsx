import ThemedText from '~/components/ThemedText';
import ArrowLeftIcon from '~/assets/icons/ArrowLeftIcon';
import { Href, useRouter } from 'expo-router';
import { Button } from './ui/button';
import { Platform, View } from 'react-native';
import Breadcrumb from './ui/Breadcrumb';

type BreadcrumbItem = {
  label: string;
  href?: Href;
};

type BackHeaderProps = {
  RightComponent?: React.ReactNode;
  TitleComponent?: React.ReactNode;
  title?: string;
  items: BreadcrumbItem[];
};

export default function BackHeader({
  RightComponent,
  TitleComponent,
  title,
  items,
}: BackHeaderProps) {
  const router = useRouter();

  if (Platform.OS === 'web') {
    return <Breadcrumb items={items} />;
  }

  return (
    <View className='items-center justify-between flex-row p-[18px]'>
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
