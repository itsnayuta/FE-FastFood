import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
const CartScreen = () => {
    const navigation = useNavigation();

    const handleCheckout = () => {
        // Chuyển sang màn hình thanh toán
        navigation.navigate("Payment" as never);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cart Screen</Text>
            
            <TouchableOpacity 
                style={styles.checkoutButton} 
                onPress={handleCheckout}
            >
                <Text style={styles.checkoutButtonText}>Thanh Toán</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        fontWeight: "bold",
    },
    checkoutButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        elevation: 3,
    },
    checkoutButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});

export default CartScreen;