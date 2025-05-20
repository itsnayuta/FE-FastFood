import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ManageOrdersScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quản lý đơn hàng</Text>
            {/* TODO: Danh sách đơn hàng, trạng thái, chi tiết đơn */}
        </View>
    );
};

export default ManageOrdersScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    title: {
        fontSize: 20,
        marginBottom: 16
    }
});
