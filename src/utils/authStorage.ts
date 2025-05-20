import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = '@auth_access_token';
const REFRESH_TOKEN_KEY = '@auth_refresh_token';
const USER_KEY = '@auth_user';

export type AuthUser = {
  uid: string;
  name: string;
  email: string;
  role: string;
};

// Nếu trước đây bạn dùng firebase để lưu user, token,... thì có thể comment lại phần đó bên dưới

export const authStorage = {
  async storeTokens(accessToken: string, refreshToken: string, user: AuthUser): Promise<void> {
    try {
      // Nếu trước đây bạn dùng firebase để lưu token, user thì comment hoặc xóa đoạn này
      /*
      // firebase lưu token user sample (comment lại)
      await firebase.auth().currentUser.getIdToken(true);
      */

      await AsyncStorage.multiSet([
        [ACCESS_TOKEN_KEY, accessToken],
        [REFRESH_TOKEN_KEY, refreshToken],
        [USER_KEY, JSON.stringify(user)]
      ]);
      console.log('[Auth Storage] Tokens and user data stored successfully');
    } catch (error) {
      console.error('[Auth Storage] Failed to save tokens:', error);
    }
  },

  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('[Auth Storage] Failed to get access token:', error);
      return null;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('[Auth Storage] Failed to get refresh token:', error);
      return null;
    }
  },

  async getUser(): Promise<AuthUser | null> {
    try {
      const userStr = await AsyncStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('[Auth Storage] Failed to get user data:', error);
      return null;
    }
  },

  async removeTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
      console.log('[Auth Storage] Auth data removed successfully');
    } catch (error) {
      console.error('[Auth Storage] Failed to remove auth data:', error);
    }
  }
};
