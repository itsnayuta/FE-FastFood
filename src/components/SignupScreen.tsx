import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import SocialButton from './SocialButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';

type SignupScreenProps = {
  navigation: StackNavigationProp<ParamListBase>;
};

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // ✅ Validate fields before submission
  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Invalid email format';

    if (!mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^\d+$/.test(mobile)) newErrors.mobile = 'Invalid mobile number';

    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle Sign Up
  const handleSignup = () => {
    if (validateForm()) {
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('LoginScreen');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create an account,</Text>
        <Text style={styles.subtitle}>Please type full information below and we will create your account</Text>
      </View>

      <View style={styles.form}>
        <CustomInput
          placeholder="Name"
          iconName="person-outline"
          value={name}
          onChangeText={setName}
        />
        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

        <CustomInput
          placeholder="Email address"
          iconName="mail-outline"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        <CustomInput
          placeholder="Mobile number"
          iconName="call-outline"
          keyboardType="phone-pad"
          countryCode="+01"
          value={mobile}
          onChangeText={setMobile}
        />
        {errors.mobile ? <Text style={styles.errorText}>{errors.mobile}</Text> : null}

        <CustomInput
          placeholder="Password"
          iconName="lock-closed-outline"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

        <Text style={styles.termsText}>
          By signing up you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Use and Privacy Notice</Text>
        </Text>

        <CustomButton title="Join Now" onPress={handleSignup} primary />

        <View style={styles.orContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>

        <SocialButton title="Join with Google" icon="google" onPress={() => {}} />

        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.signInText}>Sign In</Text>
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