import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../components/LoginScreen';
import MainNavigator from './MainNavigator';
import AdminNavigator from './AdminNavigator';
import type { RootParamList } from '../types';

const Stack = createNativeStackNavigator<RootParamList & { Login: undefined }>();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainRoot" component={MainNavigator} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AdminRoot" component={AdminNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
