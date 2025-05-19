import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useNavigation, CommonActions} from '@react-navigation/native';
import type {CompositeNavigationProp} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  LoginScreen: undefined;
  SignupScreen: undefined;
  Menu: undefined;
  MenuMain: {initialTab: string};
};

type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList>,
  BottomTabNavigationProp<RootStackParamList>
>;

const OptionsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [menuFood, setismenufoodclicked] = useState(false);
  const [contactaboutus, setiscontactaboutusclicked] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <View style={{flex: 0, gap: 5, marginBottom: 60}}>
          <Text style={{fontSize: 40, fontWeight: 900}}>BẮT ĐẦU</Text>
          <View style={{flexDirection: 'row', gap: 10}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={{fontWeight: 700}}>Đăng Nhập</Text>
            </TouchableOpacity>
            <Text style={{fontWeight: 700}}>/</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignupScreen')}>
              <Text style={{fontWeight: 700}}>Đăng Ký →</Text>
            </TouchableOpacity>
          </View>
        </View>

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
            <Text style={{fontSize: 18, fontWeight: 900}}>Danh Mục Món Ăn</Text>
            <TouchableOpacity onPress={() => setismenufoodclicked(!menuFood)}>
              <Image
                style={{
                  width: 20,
                  height: 20,
                  transform: menuFood ? [{rotate: '180deg'}] : [],
                }}
                source={require('../assets/icons/down-arrow.png')}></Image>
            </TouchableOpacity>
          </View>

          {menuFood && (
            <View style={{flex: 0, marginTop: 10, gap: 10}}>
              <TouchableOpacity
                onPress={() => {
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
                                params: {initialTab: 'Combo nhóm 1'},
                              },
                            ],
                          },
                        },
                      ],
                    }),
                  );
                }}>
                <Text>Combo 1 người</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text>Combo nhóm</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text>Gà Rán - Gà Quay</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
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
                                params: {initialTab: 'Thức ăn nhẹ'},
                              },
                            ],
                          },
                        },
                      ],
                    }),
                  );
                }}>
                <Text>Thức Ăn Nhẹ</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View
          style={{
            flex: 0,
            paddingBottom: 20,
            borderBottomWidth: 0.5,
            borderColor: 'gray',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 18, fontWeight: 900}}>Đơn Hàng</Text>
            <TouchableOpacity
              onPress={() => setiscontactaboutusclicked(!contactaboutus)}>
              <Image
                style={{
                  width: 20,
                  height: 20,
                  transform: contactaboutus ? [{rotate: '180deg'}] : [],
                }}
                source={require('../assets/icons/down-arrow.png')}></Image>
            </TouchableOpacity>
          </View>

          {contactaboutus && (
            <View style={{flex: 0, marginTop: 10, gap: 10}}>
              <TouchableOpacity>
                <Text>Lịch Sử Đặt Hàng</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text>Theo Dõi Đơn Hàng</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

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
          <Text style={{fontSize: 18, fontWeight: 900}}>Danh Mục Món Ăn</Text>
          <TouchableOpacity onPress={() => setismenufoodclicked(!menuFood)}>
            <Image
              style={{
                width: 20,
                height: 20,
                transform: menuFood ? [{rotate: '180deg'}] : [],
              }}
              source={require('../assets/icons/down-arrow.png')}></Image>
          </TouchableOpacity>
        </View>

        {menuFood && (
          <View style={{flex: 0, marginTop: 10, gap: 10}}>
            <TouchableOpacity
              onPress={() => {
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
                              params: {initialTab: 'Combo nhóm 1'},
                            },
                          ],
                        },
                      },
                    ],
                  }),
                );
              }}>
              <Text>Combo 1 người</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text>Combo nhóm</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Gà Rán - Gà Quay</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
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
                              params: {initialTab: 'Thức ăn nhẹ'},
                            },
                          ],
                        },
                      },
                    ],
                  }),
                );
              }}>
              <Text>Thức Ăn Nhẹ</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
});

export default OptionsScreen;
