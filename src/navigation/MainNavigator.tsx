import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Header from "../components/Header";
import HomeScreen from "../screens/HomeScreen";
import BottomTab from "../components/BottomTab";
import PromoScreen from "../screens/Promo";
import MenuScreen from "../screens/MenuScreen";
import CartScreen from "../screens/CartScreen";
import OptionsScreen from "../screens/OptionsScreen";




const Tab = createBottomTabNavigator();

const MainNavigator = () => {
    return (
        <>
            <Header />
            <Tab.Navigator tabBar={(props) => <BottomTab {...props} />}>
                <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Tab.Screen name="Menu" component={MenuScreen} options={{ headerShown: false }} />
                <Tab.Screen name="Promo" component={PromoScreen} options={{ headerShown: false }} />
                <Tab.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
                <Tab.Screen name="Options" component={OptionsScreen} options={{ headerShown: false }} />
            </Tab.Navigator>
        </>
    );
};

export default MainNavigator;
