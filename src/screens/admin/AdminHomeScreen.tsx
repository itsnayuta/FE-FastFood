import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AdminHomeScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

const AdminHomeScreen: React.FC<AdminHomeScreenProps> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Trang chính của Admin</Text>
            <Button title="Quản lý người dùng" onPress={() => navigation.navigate("ManageUsers")} />
            <Button title="Quản lý đơn hàng" onPress={() => navigation.navigate("ManageOrders")} />
            <Button title="Quản lý sản phẩm" onPress={() => navigation.navigate("ManageProduct")} />
        </View>
    );
};

export default AdminHomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: "center"
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
        textAlign: "center"
    }
});
