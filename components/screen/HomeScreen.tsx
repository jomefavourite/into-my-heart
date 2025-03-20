import { useUser } from '@clerk/clerk-expo';
import { View, ScrollView } from 'react-native';
import Container from '~/components/Container';
import CustomButton from '~/components/CustomButton';
import ThemedText from '~/components/ThemedText';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

export default function HomeScreen() {
  const { isSignedIn, user, isLoaded } = useUser();
  return (
    <ScrollView>
      <Container>
        <View className='flex-row justify-between items-center'>
          {/* Header */}
          <View className='flex-row gap-2 items-center'>
            <Avatar alt="Zach Nugent's Avatar">
              <AvatarImage source={{ uri: user?.imageUrl }} />
              <AvatarFallback>
                <ThemedText>ZN</ThemedText>
              </AvatarFallback>
            </Avatar>
            <View>
              <ThemedText>Welcome</ThemedText>
              <ThemedText>
                {user?.firstName} {user?.lastName}
              </ThemedText>
            </View>
          </View>

          <View>
            <CustomButton size='icon' className='w-fit'>
              Hello
            </CustomButton>
          </View>
        </View>

        {/* Verse of the Day */}
        <View className='py-2'>
          <ThemedText className='text-sm'>Verse of the Day</ThemedText>
          <View className='bg-primary border-none rounded-3xl py-6 px-5 mt-3'>
            <ThemedText className='text-sm text-white dark:text-primary '>
              Card Title
            </ThemedText>
            <ThemedText className='text-white dark:text-primary text-base my-7'>
              For God so loved the world, that he gave his only Son, that
              whoever believes in him should not perish but have eternal life.
            </ThemedText>

            <View className='flex-row justify-between'>
              <CustomButton variant='secondary'>Memorize</CustomButton>
            </View>
          </View>
        </View>

        {/* My verses */}
        <View className='py-2 mt-4'>
          <ThemedText>My Verses</ThemedText>

          <View className='bg-container p-7 rounded-2xl mt-5'>
            <ThemedText className='font-medium text-center max-w-[160px] mx-auto'>
              Start hiding God's Word in your heart
            </ThemedText>
            <CustomButton variant='ghost' className='mt-3'>
              Add verse
            </CustomButton>
          </View>

          <View className='mt-5'>
            <ThemedText className='font-medium'>Verse Suggestions</ThemedText>

            <View className='gap-2'>
              {[1, 2, 3].map((_, index) => (
                <View
                  key={index}
                  className='flex-row bg-container py-3 px-4 rounded-xl'
                >
                  <View>
                    <ThemedText>Genesis 1:1</ThemedText>
                    <ThemedText>
                      In the beginning, God created the heavens and the earth.
                    </ThemedText>
                  </View>
                  <CustomButton variant='ghost' size='icon' className='mt-3'>
                    Add verse
                  </CustomButton>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Container>
    </ScrollView>
  );
}
