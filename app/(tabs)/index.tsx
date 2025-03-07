import { Image, StyleSheet, Platform, Text, View } from 'react-native';
import Container from '~/components/Container';

export default function HomeScreen() {
  return (
    <Container>
      <View style={styles.titleContainer}>
        <Text>Welcome!</Text>
      </View>
      <Text className='text-center text-red-500 text-2xl'>Hello</Text>
      <View style={styles.stepContainer}>
        <Text>Step 1: Try it</Text>
        <Text>
          Edit <Text>app/(tabs)/index.tsx</Text> to see changes. Press{' '}
          <Text>
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </Text>{' '}
          to open developer tools.
        </Text>
      </View>
      <View style={styles.stepContainer}>
        <Text>Step 2: Explore</Text>
        <Text>
          Tap the Explore tab to learn more about what's included in this
          starter app.
        </Text>
      </View>
      <View style={styles.stepContainer}>
        <Text>Step 3: Get a fresh start</Text>
        <Text>
          When you're ready, run <Text>npm run reset-project</Text> to get a
          fresh <Text>app</Text> directory. This will move the current{' '}
          <Text>app</Text> to <Text>app-example</Text>.
        </Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
