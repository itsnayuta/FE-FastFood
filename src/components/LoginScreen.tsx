import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import SocialButton from './SocialButton';
import {StackNavigationProp} from '@react-navigation/stack';
import {ParamListBase} from '@react-navigation/native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Config from 'react-native-config';
import axios from 'axios';
import { authStorage } from '../utils/authStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginScreenProps = {
  navigation: StackNavigationProp<ParamListBase>;
};

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
const isValidPassword = (password: string) => password.length >= 6;

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize Google Sign-In
    GoogleSignin.configure({
      webClientId: Config.WEB_CLIENT_ID,
      offlineAccess: true,
    });
  }, []);

  const handleEmailPasswordLogin = async () => {
    setEmailError('');
    setPasswordError('');
    let isValid = true;

    if (!isValidEmail(email)) {
      setEmailError('Invalid email address');
      isValid = false;
    }

    if (!isValidPassword(password)) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    if (isValid) {
      setLoading(true);
      try {
        
        const {user}= await sendIdTokenToBackend(email, password);
        Alert.alert('Success', 'Logged in successfully!');
        if(user.role === 'ADMIN') {
        navigation.navigate('AdminRoot');
        }else{
          navigation.navigate('MainRoot');
        }
      } catch (error: any) {
        console.error('[Auth Error]', error);
        let errorMessage = 'Authentication failed';
        
        switch (error.code) {
          case 'auth/email-already-in-use':
            // If account exists, try to sign in instead
            try {
              const existingUser = await auth().signInWithCredential(
                auth.EmailAuthProvider.credential(email, password)
              );
              const idToken = await existingUser.user.getIdToken();
              await sendIdTokenToBackend(idToken, password);
              Alert.alert('Success', 'Logged in successfully!');
              navigation.navigate('Home'); // Navigate to home screen
              return;
            } catch (signInError: any) {
              errorMessage = 'Invalid email or password';
            }
            break;
          case 'auth/invalid-email':
            errorMessage = 'The email address is invalid.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Email/password accounts are not enabled. Please contact support.';
            break;
          case 'auth/weak-password':
            errorMessage = 'The password is too weak. Please use a stronger password.';
            break;
          default:
            errorMessage = error.message;
        }
        Alert.alert('Error', errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.signOut(); // Clear any existing session
      
      console.log('[GoogleSignIn] Checking Play Services...');
      await GoogleSignin.hasPlayServices();      console.log('[GoogleSignIn] Initiating sign-in...');
      const response = await GoogleSignin.signIn();
      const idToken = response?.data?.idToken;
      if (!idToken) {
        throw new Error('Failed to get ID token from Google Sign In');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      const firebaseIdToken = await userCredential.user.getIdToken(true);

      await sendIdTokenToBackend(firebaseIdToken);
      await AsyncStorage.setItem('user', JSON.stringify(userCredential.user));
      const backendData = await sendIdTokenToBackend(firebaseIdToken);
      await AsyncStorage.setItem('user', JSON.stringify(backendData.user));
      Alert.alert('Success', 'Logged in with Google successfully!');
      navigation.navigate('Home'); // Navigate to home screen
    } catch (error: any) {
      console.error('[GoogleSignIn Error]', error);
      Alert.alert(
        'Sign In Error',
        error.message || 'Failed to sign in with Google'
      );
    } finally {
      setLoading(false);
    }
  };

  const sendIdTokenToBackend = async (idToken: string, password?: string) => {
    const apiUrl = `${Config.API_BASE_URL}/auth/login`;
    try {
      const response = await axios.post(
        apiUrl,
        {email, password},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        },
      );

      console.log('[Backend Response] Status:', response.status);
      console.log('[Backend Response] Data:', response.data);

      if (response.data.token) {
        console.log('[Auth] Received backend token');
      }
      await authStorage.storeTokens(
              response.data.accessToken,
              response.data.refreshToken,
              response.data.user
            );

      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error('[Backend Error] Status:', err.response?.status);
        console.error('[Backend Error] Data:', JSON.stringify(err.response?.data, null, 2));
        console.error('[Backend Error] Message:', err.message);

        // More specific error handling for 401
        if (err.response?.status === 401) {
          console.error('[Auth Error] Invalid token. Token details:');
          console.error('Token length:', idToken.length);
          console.error('Token format:', idToken.split('.').length === 3 ? 'Valid JWT format' : 'Invalid JWT format');
          Alert.alert(
            'Authentication Error',
            'Invalid authentication token. Please try signing in again.',
          );
        } else if (err.code === 'ECONNABORTED') {
          Alert.alert(
            'Connection Timeout',
            'The server is taking too long to respond. Please check your internet connection and try again.',
          );
        } else if (err.response) {
          Alert.alert(
            'Backend Error',
            `Server Error (${err.response.status}): ${
              err.response.data.message || 'Unknown error'
            }`,
          );
        } else if (err.request) {
          Alert.alert(
            'Network Error',
            'Could not connect to the server. Please check your internet connection and make sure the backend server is running.',
          );
        } else {
          Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        }
      } else {
        console.error('[Backend Error] Unknown:', err);
        Alert.alert('Unexpected Error', 'Something went wrong. Please try again.');
      }
      throw err;
    }finally {
      console.log('[Backend Request] Finished', apiUrl);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chào mừng bạn quay trở lại,</Text>
        <Text style={styles.subtitle}>
          Rất vui vì được gặp lại bạn! Hãy đăng nhập để sử dụng app.
        </Text>
      </View>

      <View style={styles.form}>
        <CustomInput
          placeholder="Email"
          iconName="mail-outline"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <CustomInput
          placeholder="Password"
          iconName="lock-closed-outline"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        {/* <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
        </TouchableOpacity> */}

        <CustomButton
          title={loading ? 'Đăng nhập...' : 'Đăng nhập'}
          onPress={handleEmailPasswordLogin}
          primary
          disabled={loading}
        />

        {/* <View style={styles.orContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>hoặc</Text>
          <View style={styles.divider} />
        </View> */}

        {/* <SocialButton
          title="Đăng nhập bằng Google"
          icon="google"
          onPress={handleGoogleSignIn}
        /> */}

        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
            <Text style={styles.joinNowText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'white',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    flex: 1,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginVertical: 16,
  },
  forgotPasswordText: {
    color: '#666',
    fontSize: 14,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orText: {
    marginHorizontal: 10,
    color: '#666',
  },
  bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  bottomText: {
    color: '#666',
  },
  joinNowText: {
    color: '#a51c30',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});

export default LoginScreen;