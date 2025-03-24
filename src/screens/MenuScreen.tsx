import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const MenuScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Menu Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default MenuScreen;