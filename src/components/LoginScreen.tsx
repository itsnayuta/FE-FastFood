import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import SocialButton from './SocialButton';
import ErrorPopup from './ErrorPopup';
import {StackNavigationProp} from '@react-navigation/stack';
import {ParamListBase, CommonActions} from '@react-navigation/native';
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
  const [errorPopup, setErrorPopup] = useState({visible: false, message: ''});

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
      setEmailError('Email không hợp lệ');
      isValid = false;
    }

    if (!isValidPassword(password)) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      isValid = false;
    }

    if (isValid) {
      setLoading(true);
      try {
        const {user} = await sendIdTokenToBackend(email, password);
        if (user.role === 'ADMIN') {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'AdminRoot' }],
            })
          );
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'MainRoot' }],
            })
          );
        }
      } catch (error: any) {
        setErrorPopup({
          visible: true,
          message: 'Email hoặc mật khẩu không đúng. Vui lòng thử lại',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const idToken = response?.data?.idToken;
      const googleCredential = auth.GoogleAuthProvider.credential(idToken || '');
      const userCredential = await auth().signInWithCredential(googleCredential);
      const firebaseIdToken = await userCredential.user.getIdToken(true);

      const backendData = await sendIdTokenToBackendV2(firebaseIdToken);
      await AsyncStorage.setItem('user', JSON.stringify(backendData.user));
      
      if (backendData.user.role === 'ADMIN') {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'AdminRoot' }],
          })
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'MainRoot' }],
          })
        );
      }
    } catch (error: any) {
      console.error('[GoogleSignIn Error]', error);
      setErrorPopup({
        visible: true,
        message: error.message || 'Không thể đăng nhập bằng Google. Vui lòng thử lại sau',
      });
    } finally {
      setLoading(false);
    }
  };

  const sendIdTokenToBackend = async (email: string, password: string) => {
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

      if (response.data.token) {
        await authStorage.storeTokens(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.user
        );
      }
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setErrorPopup({
            visible: true,
            message: 'Email hoặc mật khẩu không đúng',
          });
        } else if (err.code === 'ECONNABORTED') {
          setErrorPopup({
            visible: true,
            message: 'Máy chủ phản hồi quá lâu. Vui lòng kiểm tra kết nối internet và thử lại',
          });
        } else if (err.response) {
          setErrorPopup({
            visible: true,
            message: `Lỗi máy chủ (${err.response.status}): ${
              err.response.data.message || 'Lỗi không xác định'
            }`,
          });
        } else if (err.request) {
          setErrorPopup({
            visible: true,
            message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet và đảm bảo máy chủ đang hoạt động',
          });
        } else {
          setErrorPopup({
            visible: true,
            message: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại',
          });
        }
      } else {
        console.error('[Backend Error] Unknown:', err);
        setErrorPopup({
          visible: true,
          message: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại',
        });
      }
      throw err;
    } 
  };

  const sendIdTokenToBackendV2 = async (idToken: string) => {
    const apiUrl = `${Config.API_BASE_URL}/auth/oauth`;
    try {
      const response = await axios.post(
        apiUrl,
        {idToken},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        },
      );

      if (response.data.token) {
        await authStorage.storeTokens(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.user
        );
      }
     
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setErrorPopup({
            visible: true,
            message: 'Token xác thực không hợp lệ. Vui lòng thử đăng nhập lại',
          });
        } else if (err.code === 'ECONNABORTED') {
          setErrorPopup({
            visible: true,
            message: 'Máy chủ phản hồi quá lâu. Vui lòng kiểm tra kết nối internet và thử lại',
          });
        } else if (err.response) {
          setErrorPopup({
            visible: true,
            message: `Lỗi máy chủ (${err.response.status}): ${
              err.response.data.message || 'Lỗi không xác định'
            }`,
          });
        } else if (err.request) {
          setErrorPopup({
            visible: true,
            message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet và đảm bảo máy chủ đang hoạt động',
          });
        } else {
          setErrorPopup({
            visible: true,
            message: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại',
          });
        }
      } else {
        console.error('[Backend Error] Unknown:', err);
        setErrorPopup({
          visible: true,
          message: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại',
        });
      }
      throw err;
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

        <View style={styles.orContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>hoặc</Text>
          <View style={styles.divider} />
        </View>

        <SocialButton
          title="Đăng nhập bằng Google"
          icon="google"
          onPress={handleGoogleSignIn}
        />

        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
            <Text style={styles.joinNowText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ErrorPopup
        visible={errorPopup.visible}
        message={errorPopup.message}
        onClose={() => setErrorPopup({visible: false, message: ''})}
      />
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
