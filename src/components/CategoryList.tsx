import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    TextInput
} from "react-native";
import { getProductsByCategoryId } from "../services/api";
import { Product } from "../types/index";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { addToCart } from "../utils/cart";
interface CategoryListProps {
    route: any;
}

type CategoryListNavigationProp = StackNavigationProp<
    { ProductDetails: { product: Product } },
    "ProductDetails"
>;

const CategoryList: React.FC<CategoryListProps> = ({ route }) => {
    const { id: categoryId } = route.params;
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigation = useNavigation<CategoryListNavigationProp>();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProductsByCategoryId(categoryId);
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId]);

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        console.log("Thêm vào giỏ hàng:", product.name);
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#e4002b" style={styles.loading} />;
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChangeText={(text) => setSearchTerm(text)}
            />

            {filteredProducts.length === 0 ? (
                <Text style={styles.noProductText}>Không có sản phẩm nào</Text>
            ) : (
                <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("ProductDetails", { product: item })}
                        >
                            <View style={styles.productCard}>
                                <Image source={{ uri: item.imageUrl }} style={styles.productImage} />

                                <View style={styles.productInfo}>
                                    <Text style={styles.productName}>{item.name}</Text>
                                    <Text style={styles.productPrice}>{item.price}₫</Text>
                                    <Text style={styles.productDescription}>
                                        {item.description || "Mô tả sản phẩm..."}
                                    </Text>

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
    noProductText: { textAlign: "center", fontSize: 18, marginTop: 20 },

    searchInput: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10
    },

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
    productInfo: {
        flex: 1,
        justifyContent: "space-between"
    },
    productName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5
    },
    productPrice: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 5
    },
    productDescription: {
        fontSize: 12,
        color: "#666",
        marginBottom: 10
    },
    addToCartButton: {
        backgroundColor: "#e4002b", // 🔴 Đỏ
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignSelf: "flex-end"
    },
    addToCartText: {
        color: "#fff", // Trắng
        fontWeight: "bold",
        fontSize: 14
    },
});

export default CategoryList;
