import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getComboByType, deleteCombo } from "../../services/api";
import { Combo } from "../../types";

type ManageMenuStackParamList = {
    ManageComboScreen: { type: string };
    AddComboScreen: { type: string };
};

type ManageComboScreenRouteProp = RouteProp<
    ManageMenuStackParamList,
    "ManageComboScreen"
>;

type ManageComboScreenNavigationProp = NativeStackNavigationProp<
    ManageMenuStackParamList,
    "ManageComboScreen"
>;

export default function ManageComboScreen() {
    const route = useRoute<ManageComboScreenRouteProp>();
    const navigation = useNavigation<ManageComboScreenNavigationProp>();
    const { type } = route.params;

    const [combos, setCombos] = useState<Combo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        navigation.setOptions({ title: `Combo: ${type}` });
        fetchCombos();
    }, [type, navigation]);

    async function fetchCombos() {
        setLoading(true);
        try {
            const data = await getComboByType(type);
            setCombos(data);
        } catch (error) {
            Alert.alert("Lỗi", "Không thể tải dữ liệu combo");
        } finally {
            setLoading(false);
        }
    }

    const handleAddPress = () => {
        navigation.navigate("AddComboScreen", { type });
    };

    const handleRemovePress = (comboId: number) => {
        Alert.alert(
            "Xác nhận xoá",
            "Bạn có chắc chắn muốn xoá combo này?",
            [
                { text: "Huỷ", style: "cancel" },
                {
                    text: "Xoá",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await deleteCombo(comboId);
                            Alert.alert("Thành công", "Đã xoá combo");
                            fetchCombos();
                        } catch (error) {
                            Alert.alert("Lỗi", "Không thể xoá combo");
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const renderComboItem = ({ item }: { item: Combo }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.cardContent}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.description} numberOfLines={2}>
                    {item.description}
                </Text>
            </View>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemovePress(item.id)}
            >
                <Ionicons name="trash-outline" size={22} color="#ff3b30" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Combo loại: {type}</Text>
            {loading ? (
                <ActivityIndicator
                    size="large"
                    color="#007bff"
                    style={{ marginTop: 30 }}
                />
            ) : combos.length === 0 ? (
                <Text style={styles.noDataText}>Chưa có combo nào cho loại này.</Text>
            ) : (
                <FlatList
                    data={combos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderComboItem}
                    contentContainerStyle={styles.list}
                />
            )}

            <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
                <Ionicons name="add" size={32} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        fontSize: 20,
        fontWeight: "700",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#f9f9f9",
    },
    list: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 16,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        overflow: "hidden",
        position: "relative",
    },
    image: {
        width: 100,
        height: 100,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
    },
    cardContent: {
        flex: 1,
        padding: 12,
        justifyContent: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#222",
        marginBottom: 6,
    },
    description: {
        fontSize: 14,
        color: "#555",
    },
    noDataText: {
        marginTop: 50,
        textAlign: "center",
        fontSize: 16,
        color: "#999",
    },
    addButton: {
        position: "absolute",
        right: 24,
        bottom: 30,
        backgroundColor: "#007bff",
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
        shadowColor: "#007bff",
        shadowOpacity: 0.6,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
    },
    removeButton: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "#fff",
        padding: 6,
        borderRadius: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
    },
});
