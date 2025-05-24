import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { CommonActions } from "@react-navigation/native";

import Header from "../components/Header";
import HomeScreen from "../screens/HomeScreen";
import BottomTab from "../components/BottomTab";
import PromoScreen from "../screens/Promo";
import MenuScreen from "../screens/MenuScreen";
import CartScreen from "../screens/CartScreen";
import OptionsScreen from "../screens/OptionsScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import ComboDetails from "../screens/ComboDetailsScreen";
import PaymentScreen from "../screens/PaymentScreen";
import OrderSuccessScreen from "../screens/OrderSuccessScreen";
import LoginScreen from "../components/LoginScreen";
import SignupScreen from "../components/SignupScreen";
import ProfileScreen from "../components/ProfileScreen";
import UpdateProfileScreen from "../components/UpdateProfileScreen";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack for Menu Navigation
const MenuStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MenuMain" component={MenuScreen} />
            <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
            <Stack.Screen name="ComboDetails" component={ComboDetails} />
        </Stack.Navigator>
    );
};

// Stack for Cart Navigation
const CartStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CartMain" component={CartScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
        </Stack.Navigator>
    );
};

// Stack for Profile & Authentication
const OptionsStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="OptionsMain" component={OptionsScreen} />
            <Stack.Screen 
                name="ProfileScreen" 
                component={ProfileScreen} 
            />
            <Stack.Screen 
                name="UpdateProfileScreen" 
                component={UpdateProfileScreen} 
            />
            <Stack.Screen 
                name="LoginScreen" 
                component={LoginScreen} 
            />
            <Stack.Screen 
                name="SignupScreen" 
                component={SignupScreen} 
            />
            <Stack.Screen 
                name="OrderHistory" 
                component={OrderHistoryScreen} 
            />
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
            
                <Tab.Screen
                    name="Cart"
                    component={CartStack}
                    options={{ headerShown: false }}
                    listeners={({ navigation }) => ({
                        tabPress: (e) => {
                            e.preventDefault();
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: "CartMain" }],
                                })
                            );
                        },
                    })}
                />
                <Tab.Screen
                    name="Options"
                    component={OptionsStack}
                    options={{ headerShown: false }}
                />
            </Tab.Navigator>
        </>
    );
};

export default MainNavigator;
