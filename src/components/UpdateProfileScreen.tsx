import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import SocialButton from './SocialButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';

type ProfileScreenProps = {
  navigation: StackNavigationProp<ParamListBase>;
};

const UpdateProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>
      
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
          By updating your profile, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of use and privacy notice</Text>
        </Text>
        
        <CustomButton
          title="Save Changes"
          onPress={() => navigation.goBack()}
          primary
        />
        
        <View style={styles.orContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>
        
        <SocialButton
          title="Update with Google"
          icon="google"
          onPress={() => {}}
        />
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
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  form: {
    flex: 1,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
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
});

export default UpdateProfileScreen;