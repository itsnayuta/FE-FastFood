import api from '../utils/api';


export interface UserProfile {
  id: number;
  firebaseUid: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  picture: string;
  role: string;
}

export const userService = {
  getUserProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get('/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  updateUserProfile: async (userData: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const response = await api.put('/user', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  uploadProfilePicture: async (imageUri: string): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile-picture.jpg',
      });

      const response = await api.post('/user/upload-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.pictureUrl;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  },
}; 