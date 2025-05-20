import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, SafeAreaView, Image, Alert } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import api from "../../utils/api";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

const ManageProductScreen = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchAllProducts = async () => {
        try {
          setLoading(true);
          setError(null);
      
          const productData = await api.get('/admin/get-all-products');
          setProducts(productData.data);
        } catch (err) {
        //   setError("Failed to load profile. Please try again.");
          Alert.alert('Error', 'Failed to load products. Please try again.');
        } finally {
            console.log('products', products);
          setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchAllProducts();
      }, []);

    const renderProductItem = ({ item }: { item: Product }) => (
        <View style={styles.productCard}>
            <View style={styles.productImageContainer}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.productImage}
                    // defaultSource={require('../../../assets/placeholder.png')}
                />
                <View style={styles.categoryTag}>
                    <Text style={styles.categoryText}>{item.description}</Text>
                </View>
            </View>
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
                    <Ionicons name="pencil" size={20} color="#4A90E2" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
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

            <View style={styles.filterContainer}>
                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="filter" size={20} color="#4A90E2" />
                    <Text style={styles.filterText}>Lọc</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="options" size={20} color="#4A90E2" />
                    <Text style={styles.filterText}>Sắp xếp</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={products}
                renderItem={renderProductItem}
                keyExtractor={item => item.name}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
            />

            <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ManageProductScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FA'
    },
    header: {
        padding: 20,
        backgroundColor: '#4A90E2',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8
    },
    subtitle: {
        fontSize: 16,
        color: '#E8F0FE',
        opacity: 0.8
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        margin: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    searchIcon: {
        marginRight: 8
    },
    searchInput: {
        flex: 1,
        height: 48,
        fontSize: 16,
        color: '#333'
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 16
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    filterText: {
        marginLeft: 4,
        color: '#4A90E2',
        fontWeight: '500'
    },
    listContainer: {
        padding: 8
    },
    productCard: {
        flex: 1,
        margin: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    productImageContainer: {
        position: 'relative'
    },
    productImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover'
    },
    categoryTag: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(74, 144, 226, 0.9)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12
    },
    categoryText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500'
    },
    productInfo: {
        padding: 12
    },
    productName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4
    },
    productPrice: {
        fontSize: 14,
        color: '#4A90E2',
        fontWeight: 'bold'
    },
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
    editButton: {
        backgroundColor: '#E8F0FE'
    },
    deleteButton: {
        backgroundColor: '#FFE5E5'
    },
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
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
});
