import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import CustomButton from './CustomButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';

type ProfileScreenProps = {
  navigation: StackNavigationProp<ParamListBase>;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: 'https://unsplash.com/photos/a-man-with-a-necklace-on-his-neck-naS61tXjXG4' }} style={styles.profileImage} />
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>johndoe@example.com</Text>
      </View>
      
      <CustomButton title="Edit Profile" onPress={() => navigation.navigate('UpdateProfileScreen')} primary />
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

export default ProfileScreen;