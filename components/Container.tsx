import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Container = ({
  children,
}: {
  children: React.ReactNode;
}): React.PropsWithChildren<React.ReactNode> => {
  return <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>;
};

export default Container;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 18,
  },
});
