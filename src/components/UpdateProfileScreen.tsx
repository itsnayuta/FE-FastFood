import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import CustomButton from './CustomButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { userService, UserProfile } from '../services/userService';

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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [picture, setPicture] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userService.getUserProfile();
      setUser(userData);
      setDisplayName(userData.displayName);
      setEmail(userData.email);
      setPhoneNumber(userData.phoneNumber);
      setPicture(userData.picture);
    } catch (err) {
      setError('Failed to load profile. Please try again.');
      Alert.alert('Error', 'Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 500,
        maxHeight: 500,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert('Error', 'Failed to pick image');
        return;
      }

      if (result.assets && result.assets[0]?.uri) {
        setSaving(true);
        try {
          const pictureUrl = await userService.uploadProfilePicture(result.assets[0].uri);
          setPicture(pictureUrl);
        } catch (err) {
          Alert.alert('Error', 'Failed to upload image. Please try again.');
        } finally {
          setSaving(false);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError(null);
      const updatedUser = await userService.updateUserProfile({
        displayName,
        email,
        phoneNumber,
        picture,
      });

      Alert.alert('Success', 'Profile updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a51c30" />
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Failed to load profile'}</Text>
        <CustomButton title="Retry" onPress={fetchUserProfile} primary />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TouchableOpacity 
        style={styles.imageContainer} 
        onPress={handleImagePick}
        disabled={saving}
      >
        <Image source={{ uri: picture }} style={styles.profileImage} />
        <View style={styles.imageOverlay}>
          <Text style={styles.changePhotoText}>
            {saving ? 'Uploading...' : 'Change Photo'}
          </Text>
        </View>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
        editable={!saving}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!saving}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        editable={!saving}
      />
      <View style={styles.buttonContainer}>
        <CustomButton 
          title={saving ? "Saving..." : "Save"} 
          onPress={handleSave} 
          primary 
          disabled={saving}
        />
        <CustomButton 
          title="Cancel" 
          onPress={() => navigation.goBack()} 
          disabled={saving}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
    marginTop: 24,
  },
});

export default UpdateProfileScreen;