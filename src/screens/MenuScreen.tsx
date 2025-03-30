import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import MenuTabNavigator from "../navigation/MenuTabNavigator";

const MenuScreen = () => {
    return (
        <View style={styles.container}>
            {/* <Text style={styles.title}>Thực Đơn</Text> */}
            <MenuTabNavigator />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
});

export default MenuScreen;