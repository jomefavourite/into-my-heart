import { View, Text } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Container = ({
  children,
}: {
  children: React.ReactNode;
}): React.PropsWithChildren<React.ReactNode> => {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

export default Container;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    justifyContent: 'space-between',
  },
});
