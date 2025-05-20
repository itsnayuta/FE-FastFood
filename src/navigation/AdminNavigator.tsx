import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

// Các màn hình admin
import AdminHomeScreen from "../screens/admin/AdminHomeScreen";
import ManageUsersScreen from "../screens/admin/ManageUsersScreen";
import ManageOrdersScreen from "../screens/admin/ManageOrdersScreen";
import ManageProductScreen from "../screens/admin/ManageProductScreen";
import BottomTab from "../components/BottomTab";

// Tạo stack cho từng tab admin
const AdminHomeStack = createStackNavigator();
const ManageUsersStack = createStackNavigator();
const ManageOrdersStack = createStackNavigator();
const ManageProductStack = createStackNavigator();

// Stack con cho tab AdminHome
const AdminHomeStackNavigator = () => (
    <AdminHomeStack.Navigator screenOptions={{ headerShown: false }}>
        <AdminHomeStack.Screen name="AdminHomeMain" component={AdminHomeScreen} />
        {/* Nếu cần màn hình con khác cho tab này, thêm ở đây */}
    </AdminHomeStack.Navigator>
);

// Stack con cho tab ManageUsers
const ManageUsersStackNavigator = () => (
    <ManageUsersStack.Navigator screenOptions={{ headerShown: false }}>
        <ManageUsersStack.Screen name="ManageUsersMain" component={ManageUsersScreen} />
    </ManageUsersStack.Navigator>
);

// Stack con cho tab ManageOrders
const ManageOrdersStackNavigator = () => (
    <ManageOrdersStack.Navigator screenOptions={{ headerShown: false }}>
        <ManageOrdersStack.Screen name="ManageOrdersMain" component={ManageOrdersScreen} />
    </ManageOrdersStack.Navigator>
);

// Stack con cho tab ManageProduct
const ManageProductStackNavigator = () => (
    <ManageProductStack.Navigator screenOptions={{ headerShown: false }}>
        <ManageProductStack.Screen name="ManageProductMain" component={ManageProductScreen} />
    </ManageProductStack.Navigator>
);

// Tạo Bottom Tab Navigator cho Admin
const Tab = createBottomTabNavigator();

const AdminNavigator = () => {
    return (
        <>
            {/* Nếu bạn có Header component riêng cho admin thì để ở đây */}
            {/* <AdminHeader /> */}
            <Tab.Navigator
                tabBar={(props) => <BottomTab {...props} />} // Dùng component tab bar giống MainNavigator nếu bạn có
                screenOptions={{ headerShown: true }} // ẩn header của tab navigator
            >
                <Tab.Screen name="Admin Home" component={AdminHomeStackNavigator} />
                <Tab.Screen name="Manage Users" component={ManageUsersStackNavigator} />
                <Tab.Screen name="Manage Orders" component={ManageOrdersStackNavigator} />
                <Tab.Screen name="Manage Product" component={ManageProductStackNavigator} />
            </Tab.Navigator>
        </>
    );
};

export default AdminNavigator;
