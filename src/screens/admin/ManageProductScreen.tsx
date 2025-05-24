import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Alert,
    ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import api from "../../utils/api";
import { Product } from "../../types";
import { getProductsByCategoryId } from "../../services/api";

type ManageProductStackParamList = {
    ManageProductMain: { categoryId?: number };
    AddProduct: { categoryId?: number };
    EditProduct: { product: Product };
};

type NavigationProp = StackNavigationProp<ManageProductStackParamList>;

const ManageProductScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute();
    const isFocused = useIsFocused();

    const { categoryId } = (route.params as { categoryId?: number }) || {};

    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        if (typeof categoryId !== "number") {
            setProducts([]);
            return;
        }

        setLoading(true);
        try {
            const data = await getProductsByCategoryId(categoryId);
            setProducts(data);
        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchProducts();
        }
    }, [isFocused, categoryId]);

    const handleAddPress = () => {
        navigation.navigate("AddProduct", { categoryId });
        // Không gọi fetchProducts ở đây vì sẽ tự động load lại khi focus lại màn hình
    };

    const handleEditPress = (product: Product) => {
        navigation.navigate("EditProduct", { product });
        // Không gọi fetchProducts ở đây vì sẽ tự động load lại khi focus lại màn hình
    };

    const handleDeleteProduct = (productId: number) => {
        Alert.alert(
            "Xác nhận xoá",
            "Bạn có chắc chắn muốn xoá sản phẩm này?",
            [
                { text: "Huỷ", style: "cancel" },
                {
                    text: "Xoá",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await api.delete(`/admin/products/${productId}`);
                            Alert.alert("Thành công", "Đã xoá sản phẩm");
                            fetchProducts(); // load lại danh sách sau khi xoá thành công
                        } catch (error) {
                            Alert.alert("Lỗi", "Không thể xoá sản phẩm.");
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderProductItem = ({ item }: { item: Product }) => (
        <View style={styles.productCard}>
            <View style={styles.productImageContainer}>
                <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
                <View style={styles.categoryTag}>
                    <Text style={styles.categoryText}>{item.description}</Text>
                </View>
            </View>
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditPress(item)}
                >
                    <Ionicons name="pencil" size={20} color="#4A90E2" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteProduct(item.id)}
                >
                    <Ionicons name="trash" size={20} color="#FF3B30" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Quản lý sản phẩm</Text>
                <Text style={styles.subtitle}>Tổng số: {products.length} sản phẩm</Text>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={filteredProducts}
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.listContainer}
                />
            )}

            <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
                <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ManageProductScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F6FA' },
    header: {
        padding: 20,
        backgroundColor: '#4A90E2',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#E8F0FE', opacity: 0.8 },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        margin: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, height: 48, fontSize: 16, color: '#333' },
    listContainer: { padding: 8 },
    productCard: {
        flex: 1,
        margin: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    productImageContainer: { position: 'relative' },
    productImage: { width: '100%', height: 150, resizeMode: 'cover' },
    categoryTag: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(74, 144, 226, 0.9)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12
    },
    categoryText: { color: '#FFFFFF', fontSize: 12, fontWeight: '500' },
    productInfo: { padding: 12 },
    productName: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 4 },
    productPrice: { fontSize: 14, color: '#4A90E2', fontWeight: 'bold' },
    actionButtons: {
        flexDirection: 'row',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0'
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8
    },
    editButton: { backgroundColor: '#E8F0FE' },
    deleteButton: { backgroundColor: '#FFE5E5' },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#4A90E2',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
});
