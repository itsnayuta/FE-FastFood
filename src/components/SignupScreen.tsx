import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import SocialButton from './SocialButton';
import ErrorPopup from './ErrorPopup';
import {StackNavigationProp} from '@react-navigation/stack';
import {ParamListBase} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import axios from 'axios';
import { authStorage } from '../utils/authStorage';

type SignupScreenProps = {
  navigation: StackNavigationProp<ParamListBase>;
};

const SignupScreen: React.FC<SignupScreenProps> = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [errorPopup, setErrorPopup] = useState({visible: false, message: ''});

  // ✅ Validate fields before submission
  const validateForm = () => {
    let newErrors: {[key: string]: string} = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = 'Invalid email format';

    if (!mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^\d+$/.test(mobile)) newErrors.mobile = 'Invalid mobile number';

    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendIdTokenToBackend = async (name?: string, phoneNumber?: string, password?: string) => {
    const apiUrl = `${Config.API_BASE_URL}/auth/signup`;
    try {
      const response = await axios.post(
        apiUrl,
        {name, phoneNumber, password},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        },
      );
      console.log('[Auth] Received response:', response.data);
      await authStorage.storeTokens(
        response.data.accessToken,
        response.data.refreshToken,
        response.data.user
      );
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setErrorPopup({
          visible: true,
          message: err.response?.data?.message || 'Không thể kết nối với máy chủ. Vui lòng thử lại sau.',
        });
      }
      throw err;
    }
  };

  // ✅ Handle Sign Up
  const handleSignup = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const {user} = await sendIdTokenToBackend(name, email, password);
        if (user.role === 'ADMIN') {
          navigation.navigate('AdminRoot');
        } else {
          navigation.navigate('MainRoot');
        }
      } catch (error: any) {
        console.error('[Signup Error]', error);
        let errorMessage = 'Không thể tạo tài khoản';

        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'Email này đã được đăng ký. Vui lòng thử đăng nhập.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Địa chỉ email không hợp lệ.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn.';
            break;
          default:
            errorMessage = error.message;
        }

        setErrorPopup({
          visible: true,
          message: errorMessage,
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

      console.log('[GoogleSignIn] Checking Play Services...');
      await GoogleSignin.hasPlayServices();
      console.log('[GoogleSignIn] Initiating sign-in...');
      const response = await GoogleSignin.signIn();
      const idToken = response?.data?.idToken;
      if (!idToken) {
        throw new Error('Không thể lấy token từ Google Sign In');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      const firebaseIdToken = await userCredential.user.getIdToken(true);

      await sendIdTokenToBackend(firebaseIdToken);
      navigation.navigate('Home');
    } catch (error: any) {
      console.error('[GoogleSignIn Error]', error);
      setErrorPopup({
        visible: true,
        message: error.message || 'Không thể đăng nhập bằng Google. Vui lòng thử lại sau.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tạo tài khoản,</Text>
        <Text style={styles.subtitle}>
          Vui lòng nhập đầy đủ thông tin bên dưới và chúng tôi sẽ tạo tài khoản cho bạn
        </Text>
      </View>

      <View style={styles.form}>
        <CustomInput
          placeholder="Name"
          iconName="person-outline"
          value={name}
          onChangeText={setName}
        />
        {errors.name ? (
          <Text style={styles.errorText}>{errors.name}</Text>
        ) : null}

        <CustomInput
          placeholder="Email address"
          iconName="mail-outline"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        {errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}

        <CustomInput
          placeholder="Mobile number"
          iconName="call-outline"
          keyboardType="phone-pad"
          countryCode="+01"
          value={mobile}
          onChangeText={setMobile}
        />
        
        {errors.mobile ? (
          <Text style={styles.errorText}>{errors.mobile}</Text>
        ) : null}

        <CustomInput
          placeholder="Password"
          iconName="lock-closed-outline"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}

        <Text style={styles.termsText}>
          Bằng cách đăng ký, bạn đồng ý với{' '}
          <Text style={styles.termsLink}>Điều khoản sử dụng và Chính sách bảo mật</Text>
        </Text>

        <CustomButton title="Đăng ký" onPress={handleSignup} primary />

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
          <Text style={styles.bottomText}>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signInText}>Đăng nhập</Text>
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
  termsText: {
    color: '#666',
    fontSize: 12,
    marginVertical: 16,
  },
  termsLink: {
    color: '#a51c30',
    fontWeight: 'bold',
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
  signInText: {
    color: '#a51c30',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 10,
  },
});

export default SignupScreen;
