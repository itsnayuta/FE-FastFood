import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';

const AddProductScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [size, setSize] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddProduct = async () => {
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

            await api.post('/admin/products', productData);
            Alert.alert('Success', 'Product added successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Error adding product:', error);
            Alert.alert('Error', 'Failed to add product. Please try again.');
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
                <Text style={styles.title}>Add New Product</Text>
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
                    style={[styles.addButton, loading && styles.disabledButton]}
                    onPress={handleAddProduct}
                    disabled={loading}
                >
                    <Text style={styles.addButtonText}>
                        {loading ? 'Adding...' : 'Add Product'}
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
    addButton: {
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
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold'
    }
});

export default AddProductScreen; 