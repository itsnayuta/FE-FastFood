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
    Image,
    ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import api from '../../utils/api';
import { useNavigation, useRoute } from '@react-navigation/native';

const AddProductScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { categoryId } = (route.params as { categoryId?: number }) || {};
    console.log('Category ID:', categoryId);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [size, setSize] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddProduct = async () => {
        if (!name || !description || !price || !imageUrl || !categoryId || !size) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
            return;
        }

        try {
            setLoading(true);
            const productData = {
                name,
                description,
                price: parseFloat(price),
                imageUrl,
                categoryId: categoryId,
                size,
            };
            console.log('Product Data:', productData);

            await api.post('/admin/products', productData);
            Alert.alert('Thành công', 'Đã thêm sản phẩm');
            navigation.goBack();
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            Alert.alert('Lỗi', 'Không thể thêm sản phẩm. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.form}>
                <Text style={styles.label}>Tên sản phẩm</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} />

                <Text style={styles.label}>Mô tả</Text>
                <TextInput style={styles.input} value={description} onChangeText={setDescription} />

                <Text style={styles.label}>Giá</Text>
                <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

                <Text style={styles.label}>Hình ảnh (URL)</Text>
                <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} />

                <Text style={styles.label}>Kích thước</Text>
                <TextInput style={styles.input} value={size} onChangeText={setSize} />

                {loading ? (
                    <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 20 }} />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
                        <Text style={styles.buttonText}>Thêm sản phẩm</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F6FA' },
    form: { padding: 20 },
    label: { fontSize: 16, fontWeight: '500', marginTop: 16 },
    input: {
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#FFF',
        marginTop: 8,
    },
    button: {
        marginTop: 24,
        backgroundColor: '#4A90E2',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default AddProductScreen;
