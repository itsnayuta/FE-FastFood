import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../components/LoginScreen';
import SignupScreen from '../components/SignupScreen';
import MainNavigator from './MainNavigator';
import AdminNavigator from './AdminNavigator';
import type { RootParamList } from '../types';
import { authStorage } from '../utils/authStorage';

const Stack = createNativeStackNavigator<RootParamList & { Login: undefined; SignupScreen: undefined }>();
type RootRouteName = keyof RootParamList | 'Login' | 'SignupScreen';

const RootNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<RootRouteName | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkUserRole = async () => {
      const user = await authStorage.getUser();
      if (user) {
        setIsAuthenticated(true);
        if (user.role === 'ADMIN') {
          setInitialRoute('AdminRoot');
        } else {
          setInitialRoute('MainRoot');
        }
      } else {
        setIsAuthenticated(false);
        setInitialRoute('Login');
      }
    };

    checkUserRole();
  }, []);

  if (!initialRoute) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={initialRoute as RootRouteName}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="MainRoot" component={MainNavigator} />
        <Stack.Screen name="AdminRoot" component={AdminNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
