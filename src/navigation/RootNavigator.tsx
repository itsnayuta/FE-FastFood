import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../components/LoginScreen';
import MainNavigator from './MainNavigator';
import AdminNavigator from './AdminNavigator';
import type { RootParamList } from '../types';
import { authStorage } from '../utils/authStorage';

const Stack = createNativeStackNavigator<RootParamList & { Login: undefined }>();
type RootRouteName = keyof RootParamList | 'Login';

const RootNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<RootRouteName | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      const user = await authStorage.getUser();
      if (user && user.role === 'ADMIN') {
        setInitialRoute('AdminRoot');
      } else {
        setInitialRoute('MainRoot');
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
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="MainRoot" component={MainNavigator} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AdminRoot" component={AdminNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
