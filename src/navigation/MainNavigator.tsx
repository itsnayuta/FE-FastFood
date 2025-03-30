import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack"; // 🔹 Thêm Stack Navigator
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

const MainNavigator = () => {
    return (
        <>
            <Header />
            <Tab.Navigator tabBar={(props) => <BottomTab {...props} />}>
                <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Tab.Screen name="Menu" component={MenuStackNavigator} options={{ headerShown: false }} />
                <Tab.Screen name="Promo" component={PromoScreen} options={{ headerShown: false }} />
                <Tab.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
                <Tab.Screen name="Options" component={OptionsScreen} options={{ headerShown: false }} />
            </Tab.Navigator>
        </>
    );
};

export default MainNavigator;