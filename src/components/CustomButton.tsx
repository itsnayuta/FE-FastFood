// components/CustomButton.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  primary?: boolean;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ 
  title, 
  onPress, 
  primary = false,
  disabled = false
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container, 
        primary ? styles.primaryContainer : styles.secondaryContainer,
        disabled && styles.disabledContainer
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.text, 
        primary ? styles.primaryText : styles.secondaryText,
        disabled && styles.disabledText
      ]}>
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
  disabledContainer: {
    backgroundColor: '#ccc',
    borderColor: '#ccc',
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
  disabledText: {
    color: '#888',
  }
});

export default CustomButton;