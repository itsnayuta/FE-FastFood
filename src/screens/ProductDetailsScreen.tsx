import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

interface ProductDetailProps {
    route: any;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ route }) => {
    const { product } = route.params;

    // Hàm xử lý khi bấm nút "Thêm vào giỏ hàng"
    const handleAddToCart = () => {
        console.log("Đã thêm vào giỏ hàng:", product.name);

    };

    return (
        <View style={styles.container}>
            {/* Ảnh sản phẩm */}
            <Image source={require("../assets/food_image/food_image.png")} style={styles.productImage} />

            {/* Thông tin sản phẩm */}
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>{product.price}₫</Text>
            <Text style={styles.productDescription}>{product.description}</Text>

            {/* Nút "Thêm vào giỏ hàng" */}
            <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff", alignItems: "center" },
    productImage: { width: 200, height: 200, borderRadius: 10, marginBottom: 10 },
    productName: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    productPrice: { fontSize: 18, fontWeight: "bold", color: "#e4002b", marginBottom: 10 },
    productDescription: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 20 },

    addToCartButton: {
        backgroundColor: "#e4002b",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    addToCartText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default ProductDetail;
