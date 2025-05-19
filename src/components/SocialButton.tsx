// components/SocialButton.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Image, View } from 'react-native';

interface SocialButtonProps {
  title: string;
  icon: 'google' | 'facebook' | 'apple';
  onPress: () => void;
  disabled?: boolean;
}

const SocialButton: React.FC<SocialButtonProps> = ({ 
  title, 
  icon, 
  onPress,
  disabled = false 
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        disabled && styles.disabledContainer
      ]} 
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.iconContainer}>
        {icon === 'google' && (
          <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
            style={[styles.icon, disabled && styles.disabledIcon]}
            resizeMode="contain"
          />
        )}
      </View>
      <Text style={[styles.text, disabled && styles.disabledText]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  disabledContainer: {
    backgroundColor: '#f5f5f5',
    borderColor: '#eee',
  },
  iconContainer: {
    position: 'absolute',
    left: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
  disabledIcon: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  disabledText: {
    color: '#888',
  }
});

export default SocialButton;