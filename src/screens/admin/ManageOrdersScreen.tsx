import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Order } from "../../types";
import { getAllOrders } from '../../services/api';
import { getOrdersByMemberId } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ManageOrdersScreen = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
    const fetchOrders = async () => {
        setLoading(true);
        const ordersData = await getAllOrders();
        setOrders(ordersData);
        setLoading(false);
    };
    fetchOrders();
}, []);
    const [user, setUser] = useState<any>({});
    const [memberId, setMemberId] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const userStr = await AsyncStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : {};
            const memberId = user.id || user.memberId;
            if (memberId) {
                const ordersData = await getOrdersByMemberId(memberId);
                setOrders(ordersData);
            }
            setLoading(false);
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return '#FFA500';
            case 'processing':
                return '#4A90E2';
            case 'completed':
                return '#4CAF50';
            case 'cancelled':
                return '#FF3B30';
            default:
                return '#666';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Chờ xử lý';
            case 'processing':
                return 'Đang xử lý';
            case 'completed':
                return 'Hoàn thành';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    const renderOrderItem = ({ item }: any) => (
        <TouchableOpacity style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>{item.orderNumber}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                </View>
            </View>
            
            <View style={styles.orderInfo}>
                <View style={styles.infoRow}>
                    <Ionicons name="person" size={16} color="#666" />
                    <Text style={styles.infoText}>{item.customerName}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="time" size={16} color="#666" />
                    <Text style={styles.infoText}>{item.date}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="cash" size={16} color="#666" />
                    <Text style={styles.totalText}>{item.total}</Text>
                </View>
            </View>

            <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionButton, styles.viewButton]}>
                    <Ionicons name="eye" size={20} color="#4A90E2" />
                    <Text style={styles.actionButtonText}>Chi tiết</Text>
                </TouchableOpacity>
                {item.status === 'pending' && (
                    <TouchableOpacity style={[styles.actionButton, styles.processButton]}>
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                        <Text style={[styles.actionButtonText, { color: '#4CAF50' }]}>Xử lý</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Quản lý đơn hàng</Text>
                <Text style={styles.subtitle}>Tổng số: {orders.length} đơn hàng</Text>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm đơn hàng..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <View style={styles.filterContainer}>
                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="filter" size={20} color="#4A90E2" />
                    <Text style={styles.filterText}>Lọc theo trạng thái</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="calendar" size={20} color="#4A90E2" />
                    <Text style={styles.filterText}>Lọc theo ngày</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
};

export default ManageOrdersScreen;

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
        padding: 16
    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500'
    },
    orderInfo: {
        marginBottom: 16
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    infoText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666'
    },
    totalText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4A90E2'
    },
    actionButtons: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 12
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 12
    },
    viewButton: {
        backgroundColor: '#E8F0FE'
    },
    processButton: {
        backgroundColor: '#E8F5E9'
    },
    actionButtonText: {
        marginLeft: 4,
        color: '#4A90E2',
        fontWeight: '500'
    }
});
