import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import { getProductInComboByComboId, getProductById } from "../services/api";
import { Product, ProductInCombo } from "../types";

interface ComboDetailsProps {
    route: any;
}

const ComboDetails: React.FC<ComboDetailsProps> = ({ route }) => {
    const { combo } = route.params;
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productInCombos: ProductInCombo[] = await getProductInComboByComboId(combo.id);
                const productDetails = await Promise.all(
                    productInCombos.map(async (item) => {
                        const product = await getProductById(item.id);
                        return { ...product, quantity: item.quantity };
                    })
                );
                setProducts(productDetails);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm trong combo:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [combo.id]);

    const handleAddComboToCart = () => {
        // 🛒 Thêm tất cả sản phẩm vào giỏ hàng
        Alert.alert("Thành công", `Đã thêm combo "${combo.name}" vào giỏ hàng!`);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#e4002b" style={styles.loading} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{combo.name}</Text>
            {products.length === 0 ? (
                <Text style={styles.noProductText}>Không có sản phẩm nào trong combo</Text>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.productCard}>
                            <Image source={require("../assets/food_image/food_image.png")} style={styles.productImage} />
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{item.name}</Text>
                                <Text style={styles.productPrice}>{item.price}₫</Text>
                                <Text style={styles.productQuantity}>Số lượng: {item.quantity}</Text>
                            </View>
                        </View>
                    )}
                    ListFooterComponent={
                        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddComboToCart}>
                            <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
                        </TouchableOpacity>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: "#fff" },
    loading: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
    noProductText: { textAlign: "center", fontSize: 18, marginTop: 20 },
    productCard: {
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
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 10
    },
    productInfo: { flex: 1 },
    productName: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
    productPrice: { fontSize: 14, fontWeight: "bold", color: "#000", marginBottom: 5 },
    productQuantity: { fontSize: 12, color: "#666" },
    addToCartButton: {
        backgroundColor: "#e4002b",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 20,
    },
    addToCartText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default ComboDetails;
