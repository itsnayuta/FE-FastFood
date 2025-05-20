import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Animated, Easing } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types";

type ProcessingOrderRouteProp = RouteProp<RootStackParamList, "ProcessingOrder">;
type ProcessingScreenNavigationProp = StackNavigationProp<RootStackParamList, "ProcessingOrder">;

const ProcessingOrderScreen: React.FC = () => {
    const navigation = useNavigation<ProcessingScreenNavigationProp>();
    const route = useRoute<ProcessingOrderRouteProp>();
    const params = route.params || {};
    const spinValue = new Animated.Value(0);

    useEffect(() => {
        // Start spinning animation
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Navigate to OrderSuccess after 3 seconds
        const timer = setTimeout(() => {
            navigation.navigate("OrderSuccess", params);
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
                <ActivityIndicator size="large" color="#E74C3C" />
            </Animated.View>
            <Text style={styles.text}>Đang xử lý đơn hàng của bạn...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    spinner: {
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
});

export default ProcessingOrderScreen;
