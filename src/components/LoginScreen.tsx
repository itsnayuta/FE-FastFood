import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import SocialButton from './SocialButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Config from "react-native-config";

type LoginScreenProps = {
  navigation: StackNavigationProp<ParamListBase>;
};

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
const isValidPassword = (password: string) => password.length >= 6;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
        webClientId: Config.WEB_CLIENT_ID, 
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
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        const idToken = await userCredential.user.getIdToken();

        console.log('Email Login -> Firebase ID Token:', idToken);
        await sendIdTokenToBackend(idToken);

        Alert.alert('Success', 'Logged in successfully!');
      } catch (error: any) {
        console.error('[EmailLogin Error]', error);
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log('[GoogleSignIn] Checking Play Services...');
      await GoogleSignin.hasPlayServices();

      console.log('[GoogleSignIn] Initiating sign-in...');
      const userInfo = await GoogleSignin.signIn();

      console.log('[GoogleSignIn] User Info:', userInfo);

      const idToken = userInfo?.data?.idToken;
      // const googleCredential = auth.GoogleAuthProvider.credential(idToken || "");

      // const userCredential = await auth().signInWithCredential(googleCredential);
      // const firebaseIdToken = await userCredential.user.getIdToken();

      // console.log('[GoogleSignIn] Firebase ID Token:', firebaseIdToken);
      // await sendIdTokenToBackend(firebaseIdToken);
      await sendIdTokenToBackend(idToken || '');


      Alert.alert('Success', 'Logged in with Google successfully!');
    } catch (error: any) {
      console.error('[GoogleSignIn Error]', error);
      if (error.code === 'auth/account-exists-with-different-credential') {
        Alert.alert('Account Exists', 'Try logging in with a different method.');
      } else {
        Alert.alert('Google Sign-In Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const sendIdTokenToBackend = async (idToken: string) => {
    try {
      const response = await fetch(`${Config.API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to authenticate with backend');
      }
    } catch (err: any) {
      console.error('Failed to send ID token to backend:', err);
      Alert.alert('Backend Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back,</Text>
        <Text style={styles.subtitle}>Glad to meet you again! Please login to use the app.</Text>
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
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        <CustomButton
          title={loading ? 'Signing in...' : 'Sign In'}
          onPress={handleEmailPasswordLogin}
          primary
          disabled={loading}
        />

        <View style={styles.orContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>

        <SocialButton
          title="Sign In with Google"
          icon="google"
          onPress={handleGoogleSignIn}
        />

        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
            <Text style={styles.joinNowText}>Join Now</Text>
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
