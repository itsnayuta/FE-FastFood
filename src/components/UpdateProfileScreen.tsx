import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import CustomButton from './CustomButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';

// Mock initial user data (replace with real data as needed)
const initialUser = {
  displayName: 'John Doe',
  email: 'johndoe@example.com',
  phoneNumber: '+1 234 567 890',
  picture: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
};

type UpdateProfileScreenProps = {
  navigation: StackNavigationProp<ParamListBase>;
};

const UpdateProfileScreen: React.FC<UpdateProfileScreenProps> = ({ navigation }) => {
  const [displayName, setDisplayName] = useState(initialUser.displayName);
  const [email, setEmail] = useState(initialUser.email);
  const [phoneNumber, setPhoneNumber] = useState(initialUser.phoneNumber);
  const [picture, setPicture] = useState(initialUser.picture);

  const handleImagePick = () => {
    launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 500,
      maxHeight: 500,
    }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Error', 'Failed to pick image');
      } else if (response.assets && response.assets[0]?.uri) {
        setPicture(response.assets[0].uri);
      }
    });
  };

  const handleSave = () => {
    // TODO: Integrate with backend
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TouchableOpacity style={styles.imageContainer} onPress={handleImagePick}>
        <Image source={{ uri: picture }} style={styles.profileImage} />
        <View style={styles.imageOverlay}>
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </View>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <CustomButton title="Save" onPress={handleSave} primary />
      <CustomButton title="Cancel" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  changePhotoText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
});

export default UpdateProfileScreen;