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
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import ComboDetails from "../screens/ComboDetailsScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); // Khai báo Stack Navigator

// Tạo Stack Navigator cho MenuScreen
const MenuStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MenuMain" component={MenuScreen} />
            <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
            <Stack.Screen name="ComboDetails" component={ComboDetails} />
        </Stack.Navigator>
    );
};

import PaymentScreen from "../screens/PaymentScreen";
import ProcessingOrderScreen from "../screens/ProcessingOrderScreen";
import OrderSuccessScreen from "../screens/OrderSuccessScreen";

// Điều hướng giữa CartScreen và PaymentScreen
const CartStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CartMain" component={CartScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="ProcessingOrder" component={ProcessingOrderScreen} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
        </Stack.Navigator>
    );
};

const MainNavigator = () => {
    return (
        <>
            <Header />
            <Tab.Navigator tabBar={(props) => <BottomTab {...props} />}>
                <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Tab.Screen name="Menu" component={MenuStackNavigator} options={{ headerShown: false }} />
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
                                    routes: [{ name: 'CartMain' }]
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

export default MainNavigator;
