import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import { authStorage } from '../../utils/authStorage';
import CustomButton from '../../components/CustomButton';

type AdminTabParamList = {
    'Admin Home': undefined;
    'Manage Users': undefined;
    'Manage Orders': undefined;
    'Manage Product': undefined;
};

type AdminHomeScreenProps = {
    navigation: BottomTabNavigationProp<AdminTabParamList>;
};

const AdminHomeScreen: React.FC<AdminHomeScreenProps> = ({ navigation }) => {
    const menuItems = [
        {
            title: "Quản lý người dùng",
            icon: "people",
            screen: "Manage Users" as const
        },
        {
            title: "Quản lý đơn hàng",
            icon: "receipt",
            screen: "Manage Orders" as const
        },
        {
            title: "Quản lý sản phẩm",
            icon: "fast-food",
            screen: "Manage Product" as const
        }
    ];

    const handleLogout = async () => {
        try {
            await authStorage.removeTokens();
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                })
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to logout. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Trang chính của Admin</Text>
                <Text style={styles.subtitle}>Quản lý hệ thống</Text>
            </View>
            
            <View style={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={() => navigation.navigate(item.screen)}
                    >
                        <View style={styles.menuIconContainer}>
                            <Ionicons name={item.icon} size={24} color="#4A90E2" />
                        </View>
                        <Text style={styles.menuText}>{item.title}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.logoutContainer}>
                <CustomButton
                    title="Đăng xuất"
                    onPress={handleLogout}
                    primary={false}
                />
            </View>
        </SafeAreaView>
    );
};

export default AdminHomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FA'
    },
    header: {
        padding: 20,
        backgroundColor: '#4A90E2',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8
    },
    subtitle: {
        fontSize: 16,
        color: '#E8F0FE',
        opacity: 0.8
    },
    menuContainer: {
        padding: 16,
        marginTop: 20
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8F0FE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        fontWeight: '500'
    },
    logoutContainer: {
        padding: 16,
        marginTop: 'auto'
    }
});
