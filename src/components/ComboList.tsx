import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { getCombos } from "../services/api"; // API lấy danh sách combo
import { Combo } from "../types/index"; // Định nghĩa kiểu Combo    
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

interface ComboListProps {
    route: any;
}

type ComboListNavigationProp = StackNavigationProp<
    { ComboDetails: { combo: Combo } },
    "ComboDetails"
>;

const ComboList: React.FC<ComboListProps> = ({ route }) => {
    const { name } = route.params; // Nhận type từ params
    const [combos, setCombos] = useState<Combo[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<ComboListNavigationProp>();

    useEffect(() => {
        const fetchCombos = async () => {
            try {
                const data = await getCombos(); // Lấy toàn bộ combo
                const filteredCombos = data.filter((combo: Combo) => combo.type === name); // Lọc theo type
                console.log("filter combos: ", filteredCombos);
                setCombos(filteredCombos);
            } catch (error) {
                console.error("Lỗi khi tải combo:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCombos();
    }, [name]);

    const handleAddToCart = (combo: Combo) => {
        console.log("Thêm vào giỏ hàng:", combo.name);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#e4002b" style={styles.loading} />;
    }

    return (
        <View style={styles.container}>
            {combos.length === 0 ? (
                <Text style={styles.noComboText}>Không có combo nào</Text>
            ) : (
                <FlatList
                    data={combos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("ComboDetails", { combo: item })}
                        >
                            <View style={styles.comboCard}>
                                {/* Ảnh combo bên trái */}
                                <Image source={{ uri: item.imageUrl }} style={styles.comboImage} />

                                {/* Thông tin combo bên phải */}
                                <View style={styles.comboInfo}>
                                    <Text style={styles.comboName}>{item.name}</Text>
                                    <Text style={styles.comboPrice}>{item.price}₫</Text>
                                    <Text style={styles.comboDescription}>
                                        {item.description || "Mô tả combo..."}
                                    </Text>

                                    {/* Nút "Thêm" */}
                                    <TouchableOpacity
                                        style={styles.addToCartButton}
                                        onPress={() => handleAddToCart(item)}
                                    >
                                        <Text style={styles.addToCartText}>Thêm</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: "#fff" },
    loading: { flex: 1, justifyContent: "center", alignItems: "center" },
    noComboText: { textAlign: "center", fontSize: 18, marginTop: 20 },

    comboCard: {
        flexDirection: "row",
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 10,
        alignItems: "center"
    },
    comboImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 10
    },
    comboInfo: {
        flex: 1,
        justifyContent: "space-between"
    },
    comboName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5
    },
    comboPrice: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 5
    },
    comboDescription: {
        fontSize: 12,
        color: "#666",
        marginBottom: 10
    },

    addToCartButton: {
        backgroundColor: "#ddd",
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignSelf: "flex-end"
    },
    addToCartText: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 14
    },
});

export default ComboList;
