import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import SocialButton from './SocialButton';

interface SignupScreenProps {
  navigateTo: (screen: 'login' | 'onboarding' | 'signup') => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigateTo }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create an account,</Text>
        <Text style={styles.subtitle}>Please type full information bellow and we can create your account</Text>
      </View>
      
      <View style={styles.form}>
        <CustomInput
          placeholder="Name"
          iconName="person-outline"
        />
        
        <CustomInput
          placeholder="Email address"
          iconName="mail-outline"
          keyboardType="email-address"
        />
        
        <CustomInput
          placeholder="Mobile number"
          iconName="call-outline"
          keyboardType="phone-pad"
          countryCode="+01"
        />
        
        <CustomInput
          placeholder="Password"
          iconName="lock-closed-outline"
          secureTextEntry
        />
        
        <Text style={styles.termsText}>
          By signing up you agree to our{' '}
          <Text style={styles.termsLink}>Term of use and privacy notice</Text>
        </Text>
        
        <CustomButton
          title="Join Now"
          onPress={() => {}}
          primary
        />
        
        <View style={styles.orContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>
        
        <SocialButton
          title="Join with Google"
          icon="google"
          onPress={() => {}}
        />
        
        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigateTo('login')}>
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
    borderRadius: 30,
    margin: 10,
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
});

export default SignupScreen;