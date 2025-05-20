import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ManageUsersScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quản lý người dùng</Text>
            {/* TODO: Danh sách người dùng, nút chặn, chỉnh sửa, xóa, v.v. */}
        </View>
    );
};

export default ManageUsersScreen;

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
