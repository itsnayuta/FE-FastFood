import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import CustomButton from './CustomButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase, useFocusEffect, CommonActions } from '@react-navigation/native';
import OrderHistory from './OrderHistory';
import { userService, UserProfile } from '../services/userService';
import { orderService, Order } from '../services/orderService';
import Config from 'react-native-config';
import api from '../utils/api';
import { authStorage } from '../utils/authStorage';

type ProfileScreenProps = {
  navigation: StackNavigationProp<ParamListBase>;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    totalReviews: 0,
    totalFavorites: 0
  });

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const userData = await userService.getUserProfile();
  
      if (userData.picture?.startsWith("/uploads/")) {
        const filename = userData.picture.replace("/uploads/", "");
        userData.picture = `${Config.API_BASE_URL}/uploads/${filename}`;
      }
  
      setUser(userData);
    } catch (err) {
      setError('Failed to load profile. Please try again.');
      Alert.alert('Error', 'Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderStats = async () => {
    try {
      const orders = await orderService.getUserOrders();
      setOrderStats({
        totalOrders: orders.length,
        totalReviews: orders.filter(order => order.status === 'completed').length,
        totalFavorites: 0 // TODO: Implement favorites feature
      });
    } catch (err) {
      console.error('Error fetching order stats:', err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserProfile();
      fetchOrderStats();
    }, [])
  );

  const handleOrderPress = (orderId: string) => {
    navigation.navigate('OrderDetails', { orderId });
  };

  const handleLogout = async () => {
    try {
      await authStorage.removeTokens();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        })
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image source={{ uri: user.picture }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.displayName}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user.role}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{orderStats.totalOrders}</Text>
            <Text style={styles.statLabel}>Đơn hàng</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{orderStats.totalReviews}</Text>
            <Text style={styles.statLabel}>Đánh giá</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{orderStats.totalFavorites}</Text>
            <Text style={styles.statLabel}>Yêu thích</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <CustomButton
            title="Cập nhật thông tin"
            onPress={() => navigation.navigate('UpdateProfileScreen')}
            primary
          />
          <CustomButton
            title="Cài đặt"
            onPress={() => { }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Đơn hàng gần đây</Text>
          <TouchableOpacity onPress={() => navigation.navigate('OrderHistory')}>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <OrderHistory onOrderPress={handleOrderPress} />
      </View>

      <View style={styles.logoutContainer}>
        <CustomButton
          title="Đăng xuất"
          onPress={handleLogout}
          primary={false}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 12,
    color: '#a51c30',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e0e0e0',
  },
  actionButtons: {
    gap: 12,
  },
  section: {
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#a51c30',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  logoutContainer: {
    padding: 24,
    paddingTop: 0,
  },
});

export default ProfileScreen;