import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    SafeAreaView,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { getAllProducts, createComboWithProducts } from "../../services/api";
import Ionicons from "react-native-vector-icons/Ionicons";

type ManageMenuStackParamList = {
    AddComboScreen: { type: string };
};

type AddComboScreenRouteProp = RouteProp<ManageMenuStackParamList, "AddComboScreen">;

type Product = {
    id: number;
    name: string;
};

type SelectedProduct = {
    productId: number;
    quantity: number;
};

export default function AddComboScreen() {
    const route = useRoute<AddComboScreenRouteProp>();
    const navigation = useNavigation();
    const { type } = route.params;

    // Form state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [servingSize, setServingSize] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        navigation.setOptions({ title: "Thêm Combo" });
        fetchProducts();
    }, [navigation]);

    async function fetchProducts() {
        setLoading(true);
        try {
            const allProducts = await getAllProducts();
            setProducts(allProducts);
        } catch (error) {
            Alert.alert("Lỗi", "Không tải được danh sách sản phẩm");
        } finally {
            setLoading(false);
        }
    }

    function toggleSelectProduct(productId: number) {
        const exists = selectedProducts.find((p) => p.productId === productId);
        if (exists) {
            // Bỏ chọn sản phẩm
            setSelectedProducts(selectedProducts.filter((p) => p.productId !== productId));
        } else {
            // Thêm sản phẩm mới với quantity mặc định 1
            setSelectedProducts([...selectedProducts, { productId, quantity: 1 }]);
        }
    }

    function updateQuantity(productId: number, quantityStr: string) {
        const quantity = parseInt(quantityStr);
        if (isNaN(quantity) || quantity < 1) return; // Không cho nhập <1 hoặc không phải số

        setSelectedProducts((prev) =>
            prev.map((p) => (p.productId === productId ? { ...p, quantity } : p))
        );
    }

    function isSelected(productId: number) {
        return selectedProducts.some((p) => p.productId === productId);
    }

    async function handleSave() {
        // Validate dữ liệu cơ bản
        if (!name.trim()) {
            Alert.alert("Lỗi", "Tên combo không được để trống");
            return;
        }
        if (!price || isNaN(Number(price)) || Number(price) <= 0) {
            Alert.alert("Lỗi", "Giá combo phải là số lớn hơn 0");
            return;
        }
        if (discount && (isNaN(Number(discount)) || Number(discount) < 0)) {
            Alert.alert("Lỗi", "Giảm giá phải là số không âm");
            return;
        }
        if (selectedProducts.length === 0) {
            Alert.alert("Lỗi", "Bạn phải chọn ít nhất một sản phẩm");
            return;
        }

        const comboData = {
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            discount: discount ? Number(discount) : 0,
            imageUrl: imageUrl.trim(),
            servingSize: servingSize.trim(),
            type,
            products: selectedProducts.map((p) => ({
                productId: p.productId,
                quantity: p.quantity,
            })),
        };

        setLoading(true);
        try {
            console.log("Combo Data:", comboData);
            // Gọi API để tạo combo mới
            await createComboWithProducts(comboData);
            Alert.alert("Thành công", "Đã tạo combo mới", [
                {
                    text: "OK",
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            Alert.alert("Lỗi", "Không thể tạo combo mới");
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView keyboardShouldPersistTaps="handled" style={styles.form}>
                <Text style={styles.label}>Tên combo *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập tên combo"
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>Mô tả</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Nhập mô tả"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={3}
                />

                <Text style={styles.label}>Giá (VNĐ) *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập giá"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                />

                <Text style={styles.label}>Giảm giá (%)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập phần trăm giảm giá"
                    keyboardType="numeric"
                    value={discount}
                    onChangeText={setDiscount}
                />

                <Text style={styles.label}>Ảnh URL</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập URL ảnh"
                    value={imageUrl}
                    onChangeText={setImageUrl}
                />

                <Text style={styles.label}>Số người ăn / serving size</Text>
                <TextInput
                    style={styles.input}
                    placeholder="VD: 1 người"
                    value={servingSize}
                    onChangeText={setServingSize}
                />

                <Text style={styles.label}>Loại combo</Text>
                <Text style={styles.staticText}>{type}</Text>

                <Text style={[styles.label, { marginTop: 24 }]}>Chọn sản phẩm trong combo *</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#007bff" />
                ) : products.length === 0 ? (
                    <Text>Không có sản phẩm nào.</Text>
                ) : (
                    products.map((product) => {
                        const selected = isSelected(product.id);
                        const selectedQuantity = selectedProducts.find(
                            (p) => p.productId === product.id
                        )?.quantity;

                        return (
                            <View key={product.id} style={styles.productItem}>
                                <TouchableOpacity
                                    style={[styles.checkbox, selected && styles.checkboxSelected]}
                                    onPress={() => toggleSelectProduct(product.id)}
                                >
                                    {selected && <Ionicons name="checkmark" size={18} color="#fff" />}
                                </TouchableOpacity>
                                <Text style={styles.productName}>{product.name}</Text>
                                {selected && (
                                    <TextInput
                                        style={styles.quantityInput}
                                        keyboardType="numeric"
                                        value={selectedQuantity?.toString()}
                                        onChangeText={(text) => updateQuantity(product.id, text)}
                                        maxLength={3}
                                    />
                                )}
                            </View>
                        );
                    })
                )}

                <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Lưu Combo</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    form: {
        padding: 20,
    },
    label: {
        fontWeight: "600",
        marginBottom: 6,
        fontSize: 15,
    },
    staticText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#555",
        paddingVertical: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 16,
    },
    textArea: {
        minHeight: 60,
        textAlignVertical: "top",
    },
    productItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },
    checkbox: {
        width: 26,
        height: 26,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: "#007bff",
        marginRight: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    checkboxSelected: {
        backgroundColor: "#007bff",
        borderColor: "#007bff",
    },
    productName: {
        flex: 1,
        fontSize: 16,
        color: "#222",
    },
    quantityInput: {
        width: 56,
        borderWidth: 1,
        borderColor: "#007bff",
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 6,
        fontSize: 16,
        textAlign: "center",
    },
    saveButton: {
        marginTop: 36,
        backgroundColor: "#007bff",
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
        marginBottom: 50,
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 18,
    },
});
