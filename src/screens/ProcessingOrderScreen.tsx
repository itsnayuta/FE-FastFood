import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";

type ProcessingScreenNavigationProp = StackNavigationProp<RootStackParamList, "ProcessingOrder">;

interface ProcessingScreenProps {
    navigation: ProcessingScreenNavigationProp;
}

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ navigation }) => {
    useEffect(() => {

        const timer = setTimeout(() => {
        navigation.replace("OrderSuccess")
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.text}>Đang xử lý thanh toán...</Text>
        </View>
    );
    };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    text: {
        marginTop: 20,
        fontSize: 16,
        color: "#333",
    },
});

export default ProcessingScreen;
