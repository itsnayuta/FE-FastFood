import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ManageProductScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quản lý sản phẩm</Text>
            {/* TODO: Danh sách sản phẩm, chỉnh sửa, thêm/xóa sản phẩm */}
        </View>
    );
};

export default ManageProductScreen;

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
