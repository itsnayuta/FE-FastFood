import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";



const Header = () => {
    return (
        <View style={styles.container}>
            {/* Logo KFC bên trái */}
            <Image source={require("../assets/kfc_logo.png")} style={styles.logo} resizeMode="contain" />

            {/* Icon tài khoản bên phải */}
            <TouchableOpacity>
                <Image source={require("../assets/avatar_icon.png")} style={styles.avatar} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        paddingVertical: 10,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    logo: {
        width: 50,
        height: 30,
    },
    avatar: {
        width: 30,
        height: 30,
    },
});

export default Header;

