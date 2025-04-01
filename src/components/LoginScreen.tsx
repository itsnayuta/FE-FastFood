import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import SocialButton from './SocialButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';

type LoginScreenProps = {
  navigation: StackNavigationProp<ParamListBase>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back,</Text>
        <Text style={styles.subtitle}>Glad to meet you again!, please login to use the app.</Text>
      </View>
      
      <View style={styles.form}>
        <CustomInput
          placeholder="Email"
          iconName="mail-outline"
          keyboardType="email-address"
        />
        
        <CustomInput
          placeholder="Password"
          iconName="lock-closed-outline"
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>
        
        <CustomButton
          title="Sign In"
          onPress={() => {}}
          primary
        />
        
        <View style={styles.orContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>
        
        <SocialButton
          title="Sign In with Google"
          icon="google"
          onPress={() => {}}
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
});

export default LoginScreen;