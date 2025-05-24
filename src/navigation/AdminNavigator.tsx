import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from 'react-native-vector-icons/Ionicons';

// Các màn hình admin
import AdminHomeScreen from "../screens/admin/AdminHomeScreen";
import ManageUsersScreen from "../screens/admin/ManageUsersScreen";
import ManageOrdersScreen from "../screens/admin/ManageOrdersScreen";
import ManageProductScreen from "../screens/admin/ManageProductScreen";
import AddProductScreen from "../screens/admin/AddProductScreen";
import EditProductScreen from "../screens/admin/EditProductScreen";
import ManageMenuScreen from "../screens/admin/ManageMenuScreen";
import ManageComboScreen from "../screens/admin/ManageComboScreen";
import AddComboScreen from "../screens/admin/AddComboScreen";

// Tạo stack cho từng tab admin
const AdminHomeStack = createStackNavigator();
const ManageUsersStack = createStackNavigator();
const ManageOrdersStack = createStackNavigator();
const ManageProductStack = createStackNavigator();

// Stack con cho tab AdminHome
const AdminHomeStackNavigator = () => (
    <AdminHomeStack.Navigator screenOptions={{ headerShown: false }}>
        <AdminHomeStack.Screen name="AdminHomeMain" component={AdminHomeScreen} />
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
const ManageMenuStackNavigator = () => (
    <ManageProductStack.Navigator screenOptions={{ headerShown: false }}>
        <ManageProductStack.Screen name="ManageMenu" component={ManageMenuScreen} />
        <ManageProductStack.Screen name="ManageProductMain" component={ManageProductScreen} />
        <ManageProductStack.Screen name="AddProduct" component={AddProductScreen} />
        <ManageProductStack.Screen name="EditProduct" component={EditProductScreen} />
        <ManageProductStack.Screen name="ManageComboScreen" component={ManageComboScreen} />
        <ManageProductStack.Screen name="AddComboScreen" component={AddComboScreen} />
    </ManageProductStack.Navigator>
);

// Tạo Bottom Tab Navigator cho Admin
const Tab = createBottomTabNavigator();

const AdminNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: string;

                    switch (route.name) {
                        case 'Admin Home':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'Manage Users':
                            iconName = focused ? 'people' : 'people-outline';
                            break;
                        case 'Manage Orders':
                            iconName = focused ? 'receipt' : 'receipt-outline';
                            break;
                        case 'Manage Product':
                            iconName = focused ? 'fast-food' : 'fast-food-outline';
                            break;
                        default:
                            iconName = 'help-circle-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#4A90E2',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500'
                }
            })}
        >
            <Tab.Screen
                name="Admin Home"
                component={AdminHomeStackNavigator}
                options={{
                    title: 'Trang chủ'
                }}
            />
            <Tab.Screen
                name="Manage Users"
                component={ManageUsersStackNavigator}
                options={{
                    title: 'Người dùng'
                }}
            />
            <Tab.Screen
                name="Manage Orders"
                component={ManageOrdersStackNavigator}
                options={{
                    title: 'Đơn hàng'
                }}
            />
            <Tab.Screen
                name="Manage Product"
                component={ManageMenuStackNavigator}
                options={{
                    title: 'Menu'
                }}
            />
        </Tab.Navigator>
    );
};

export default AdminNavigator;
