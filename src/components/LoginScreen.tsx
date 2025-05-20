import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { authStorage } from '../utils/authStorage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootParamList } from '../types/index';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList & { Login: undefined }>>();

  const handleEmailPasswordLogin = async () => {
    try {
      const response = await fetch('http://192.168.1.9:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const { accessToken, refreshToken, user } = data;

      if (!accessToken || !refreshToken || !user) {
        throw new Error('Invalid response from server');
      }

      await authStorage.storeTokens(accessToken, refreshToken, user);

      if (user.role === 'ADMIN') {
        navigation.navigate('AdminRoot');
      } else {
        navigation.navigate('MainRoot');
      }

    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login failed', 'Invalid credentials or server error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Enter your email"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Enter your password"
      />

      <Button title="Login" onPress={handleEmailPasswordLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 50
  },
  label: {
    marginBottom: 4,
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12
  }
});

export default LoginScreen;
