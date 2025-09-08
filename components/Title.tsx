import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TitleProps {
  text: string;
  textClassName?: string;
}

const Title: React.FC<TitleProps> = ({ 
  text, 
  textClassName = ""
}) => {
  return (
      <View className='py-3 w-full'>
        <Text style={styles.text}>{text}</Text>
      </View>
  );
};

export default Title;

const styles = StyleSheet.create({
    text: {
        fontSize: 22,
        fontWeight: 600,
        lineHeight: 26,
        letterSpacing: -0.44,
    }
})
