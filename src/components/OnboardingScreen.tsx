// components/OnboardingScreen.tsx
import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import CustomButton from './CustomButton';

interface OnboardingScreenProps {
  navigateTo: (screen: 'login' | 'onboarding' | 'signup') => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigateTo }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={{ uri: 'https://www.kfc.com/assets/icons/kfc-logo.svg' }}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            "Well, it's finger lickin' <Text style={styles.good}>good</Text>"
          </Text>
          
          <Text style={styles.description}>
            Don't know what to eat? Take a picture, we'll suggest things to cook with your ingredients
          </Text>
        </View>
        
        <View style={styles.pagination}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        
        <CustomButton
          title="Get start"
          onPress={() => navigateTo('login')}
          primary
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 30,
    margin: 10,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  message: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  good: {
    color: '#a51c30',
  },
  description: {
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#a51c30',
    width: 16,
  },
});

export default OnboardingScreen;