import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Alert,
    Image
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import api from '../../utils/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    categoryId: number;
    size: string;
}

type ManageProductStackParamList = {
    ManageProductMain: undefined;
    AddProduct: undefined;
    EditProduct: { product: Product };
};

type EditProductScreenRouteProp = RouteProp<ManageProductStackParamList, 'EditProduct'>;
type EditProductScreenNavigationProp = StackNavigationProp<ManageProductStackParamList>;

const EditProductScreen = () => {
    const navigation = useNavigation<EditProductScreenNavigationProp>();
    const route = useRoute<EditProductScreenRouteProp>();
    const { product } = route.params;

    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [price, setPrice] = useState(product.price.toString());
    const [imageUrl, setImageUrl] = useState(product.imageUrl);
    const [categoryId, setCategoryId] = useState(product.categoryId);
    const [size, setSize] = useState(product.size);
    const [loading, setLoading] = useState(false);

    const handleUpdateProduct = async () => {
        if (!name || !description || !price || !imageUrl || !categoryId || !size) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            const productData = {
                name,
                description,
                price: parseFloat(price),
                imageUrl,
                categoryId: parseInt(categoryId),
                size
            };

            await api.put(`/admin/products/${product.id}`, productData);
            Alert.alert('Success', 'Product updated successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Error updating product:', error);
            Alert.alert('Error', 'Failed to update product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.title}>Edit Product</Text>
            </View>

            <ScrollView style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Product Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter product name"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter product description"
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Price</Text>
                    <TextInput
                        style={styles.input}
                        value={price}
                        onChangeText={setPrice}
                        placeholder="Enter price"
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Image URL</Text>
                    <TextInput
                        style={styles.input}
                        value={imageUrl}
                        onChangeText={setImageUrl}
                        placeholder="Enter image URL"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Category ID</Text>
                    <TextInput
                        style={styles.input}
                        value={categoryId}
                        onChangeText={setCategoryId}
                        placeholder="Enter category ID"
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Size</Text>
                    <TextInput
                        style={styles.input}
                        value={size}
                        onChangeText={setSize}
                        placeholder="Enter size (e.g., S, M, L)"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.updateButton, loading && styles.disabledButton]}
                    onPress={handleUpdateProduct}
                    disabled={loading}
                >
                    <Text style={styles.updateButtonText}>
                        {loading ? 'Updating...' : 'Update Product'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FA'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#4A90E2',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    backButton: {
        marginRight: 16
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
    form: {
        flex: 1,
        padding: 20
    },
    inputGroup: {
        marginBottom: 20
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#333',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top'
    },
    updateButton: {
        backgroundColor: '#4A90E2',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40
    },
    disabledButton: {
        opacity: 0.7
    },
    updateButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold'
    }
});

export default EditProductScreen; 