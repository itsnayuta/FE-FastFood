import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import LoginScreen from './components/LoginScreen';
import OnboardingScreen from './components/OnboardingScreen';
import SignupScreen from './components/SignupScreen';
import { ScreenType } from './types';


const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('onboarding');
  
  const navigateTo = (screen: ScreenType): void => {
    setCurrentScreen(screen);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {currentScreen === 'login' && (
        <LoginScreen navigateTo={navigateTo} />
      )}
      {currentScreen === 'onboarding' && (
        <OnboardingScreen navigateTo={navigateTo} />
      )}
      {currentScreen === 'signup' && (
        <SignupScreen navigateTo={navigateTo} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f1e9',
  },
});

export default App;