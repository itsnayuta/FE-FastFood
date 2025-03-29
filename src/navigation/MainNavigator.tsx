import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { CommonActions } from "@react-navigation/native";
import { NavigationContainer } from '@react-navigation/native';


import Header from "../components/Header";
import HomeScreen from "../screens/HomeScreen";
import BottomTab from "../components/BottomTab";
import PromoScreen from "../screens/Promo";
import MenuScreen from "../screens/MenuScreen";
import CartScreen from "../screens/CartScreen";
import OptionsScreen from "../screens/OptionsScreen";
import PaymentScreen from "../screens/PaymentScreen"; 
import ChangeAddressScreen from "../screens/ChangeAddressScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainNavigator = () => {
    return (
        <>
            <Header />
            <Tab.Navigator tabBar={(props) => <BottomTab {...props} />}>
                <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Tab.Screen name="Menu" component={MenuScreen} options={{ headerShown: false }} />
                <Tab.Screen name="Promo" component={PromoScreen} options={{ headerShown: false }} />
                <Tab.Screen 
                    name="Cart" 
                    component={CartStack} 
                    options={{ headerShown: false }}
                    listeners={({ navigation }) => ({
                        tabPress: (e) => {
                            e.preventDefault(); // Ngăn chặn hành vi mặc định
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [
                                        { 
                                            name: 'Cart', 
                                            state: {
                                                routes: [{ name: 'CartMain' }]
                                            }
                                        }
                                    ]
                                })
                            );
                        },
                    })}
                />
                <Tab.Screen 
                    name="Options" 
                    component={OptionsScreen}
                    options={{ headerShown: false }}
                />
            </Tab.Navigator>
        </>
    );
};

// Điều hướng giữa CartScreen và PaymentScreen
const CartStack = () => {
    return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="CartMain" component={CartScreen} />
                <Stack.Screen name="Payment" component={PaymentScreen} />
            </Stack.Navigator>
    )
};
export default MainNavigator;