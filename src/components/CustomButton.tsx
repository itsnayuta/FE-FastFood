// components/CustomButton.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  primary?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, primary = false }) => {
  return (
    <TouchableOpacity
      style={[styles.container, primary ? styles.primaryContainer : styles.secondaryContainer]}
      onPress={onPress}
    >
      <Text style={[styles.text, primary ? styles.primaryText : styles.secondaryText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryContainer: {
    backgroundColor: '#a51c30',
  },
  secondaryContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: '#333',
  },
});

export default CustomButton;