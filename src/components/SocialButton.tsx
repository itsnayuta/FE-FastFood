// components/SocialButton.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Image, View } from 'react-native';

interface SocialButtonProps {
  title: string;
  icon: 'google' | 'facebook' | 'apple';
  onPress: () => void;
}

const SocialButton: React.FC<SocialButtonProps> = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        {icon === 'google' && (
          <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
            style={styles.icon}
            resizeMode="contain"
          />
        )}
      </View>
      <Text style={styles.text}>{title}</Text>
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
  iconContainer: {
    position: 'absolute',
    left: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default SocialButton;