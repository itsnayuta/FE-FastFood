import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useNavigation, CommonActions} from '@react-navigation/native';
import type {CompositeNavigationProp} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {StackNavigationProp} from '@react-navigation/stack';
import { authStorage } from '../utils/authStorage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
});

type RootStackParamList = {
  LoginScreen: undefined;
  SignupScreen: undefined;
  Menu: undefined;
  MenuMain: {initialTab: string};
  ProfileScreen: undefined;
  OrderHistory: undefined;
  OrderDetails: {orderId: string};
  UpdateProfileScreen: undefined;
};

type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList>,
  BottomTabNavigationProp<RootStackParamList>
>;

const renderCollapsibleSection = ({
  title,
  isExpanded,
  setIsExpanded,
  items,
}: {
  title: string;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  items: { label: string; onPress: () => void }[];
}) => (
  <View
    style={{
      flex: 0,
      paddingBottom: 20,
      borderBottomWidth: 0.5,
      borderColor: 'gray',
      marginBottom: 30,
    }}>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Text style={{ fontSize: 18, fontWeight: '900' }}>{title}</Text>
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
        <Image
          style={{
            width: 20,
            height: 20,
            transform: isExpanded ? [{ rotate: '180deg' }] : [],
          }}
          source={require('../assets/icons/down-arrow.png')}
        />
      </TouchableOpacity>
    </View>

    {isExpanded && (
      <View style={{ flex: 0, marginTop: 10, gap: 10 }}>
        {items.map((item, index) => (
          <TouchableOpacity key={index} onPress={item.onPress}>
            <Text>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>
);

const OptionsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [menuFood, setismenufoodclicked] = useState(false);
  const [contactaboutus, setiscontactaboutusclicked] = useState(false);
  const [userProfile, setUserProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await authStorage.getAccessToken();
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
    }
  };

  return (
    <View style={styles.container}>
      {!isLoggedIn && (
        <View style={{ flex: 0, gap: 5, marginBottom: 60 }}>
          <Text style={{ fontSize: 40, fontWeight: '900' }}>BẮT ĐẦU</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={{ fontWeight: '700' }}>Đăng Nhập</Text>
            </TouchableOpacity>
            <Text style={{ fontWeight: '700' }}>/</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
              <Text style={{ fontWeight: '700' }}>Đăng Ký →</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {renderCollapsibleSection({
        title: 'Danh Mục Món Ăn',
        isExpanded: menuFood,
        setIsExpanded: setismenufoodclicked,
        items: [
          {
            label: 'Combo 1 người',
            onPress: () =>
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Menu',
                      state: {
                        routes: [
                          {
                            name: 'MenuMain',
                            params: { initialTab: 'Combo nhóm 1' },
                          },
                        ],
                      },
                    },
                  ],
                })
              ),
          },
          { 
            label: 'Combo nhóm', 
            onPress: () =>
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Menu',
                      state: {
                        routes: [
                          {
                            name: 'MenuMain',
                            params: { initialTab: 'Combo nhóm' },
                          },
                        ],
                      },
                    },
                  ],
                })
              ),
          },
          { 
            label: 'Gà Rán - Gà Quay', 
            onPress: () =>
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Menu',
                      state: {
                        routes: [
                          {
                            name: 'MenuMain',
                            params: { initialTab: 'Gà rán - Gà quay' },
                          },
                        ],
                      },
                    },
                  ],
                })
              ),
          },
          {
            label: 'Thức Ăn Nhẹ',
            onPress: () =>
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Menu',
                      state: {
                        routes: [
                          {
                            name: 'MenuMain',
                            params: { initialTab: 'Thức ăn nhẹ' },
                          },
                        ],
                      },
                    },
                  ],
                })
              ),
          },
        ],
      })}

      {renderCollapsibleSection({
        title: 'Đơn Hàng',
        isExpanded: contactaboutus,
        setIsExpanded: setiscontactaboutusclicked,
        items: [
          { 
            label: 'Lịch Sử Đặt Hàng', 
            onPress: () => navigation.navigate('OrderHistory')
          },
          { 
            label: 'Theo Dõi Đơn Hàng', 
            onPress: () => navigation.navigate('OrderHistory')
          },
        ],
      })}

      {isLoggedIn && renderCollapsibleSection({
        title: 'Tài Khoản',
        isExpanded: userProfile,
        setIsExpanded: setUserProfile,
        items: [
          { 
            label: 'Thông Tin Cá Nhân', 
            onPress: () => navigation.navigate('ProfileScreen')
          },
          { 
            label: 'Cập Nhật Thông Tin', 
            onPress: () => navigation.navigate('UpdateProfileScreen')
          },
        ],
      })}
    </View>
  );
};

export default OptionsScreen;
