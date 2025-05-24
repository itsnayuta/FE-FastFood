// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { getOrdersByMemberId } from '../services/api';

// type ProductItem = {
//   name: string;
//   quantity: number;
//   price: number;
// };

// export type Order = {
//   id: string;
//   status: string;
//   date: string;
//   items: ProductItem[];
//   total: number;
// };



// type OrderHistoryProps = {
//   memberId: number;
//   onOrderPress?: (orderId: string) => void;
// };

// const OrderHistory: React.FC<OrderHistoryProps> = ({ memberId, onOrderPress }) => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchOrders();
//   }, [memberId]);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const userOrders = await getOrdersByMemberId(memberId);

//       if (!Array.isArray(userOrders)) {
//         throw new Error('Dữ liệu trả về không phải mảng');
//       }
//       userOrders.forEach(order => {
//         if (!Array.isArray(order.items)) {
//           order.items = [];
//         }
//       });

//       setOrders(userOrders);
//     } catch (err) {
//       setError('Không tải được đơn hàng. Vui lòng thử lại.');
//       console.error('Error fetching orders:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'pending': return '#FFA500';
//       case 'processing': return '#4A90E2';
//       case 'completed': return '#4CAF50';
//       case 'cancelled': return '#FF3B30';
//       default: return '#666';
//     }
//   };

//   const getStatusText = (status: string) => {
//     switch (status) {
//       case 'pending': return 'Chờ xử lý';
//       case 'processing': return 'Đang xử lý';
//       case 'completed': return 'Hoàn thành';
//       case 'cancelled': return 'Đã hủy';
//       default: return status;
//     }
//   };

//   const renderOrderItem = ({ item }: { item: Order }) => (
//     <TouchableOpacity style={styles.orderCard} onPress={() => onOrderPress?.(item.id)}>
//       <View style={styles.orderHeader}>
//         <Text style={styles.orderDate}>Order #{item.id}</Text>
//         <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
//           {getStatusText(item.status)}
//         </Text>
//       </View>

//       <View style={styles.orderItems}>
//         {item.items.map((product, index) => (
//           <View key={index} style={styles.productItem}>
//             <Text style={styles.productName}>{product.name}</Text>
//             <Text style={styles.productQuantity}>x{product.quantity}</Text>
//             <Text style={styles.productPrice}>{product.price.toLocaleString('vi-VN')}đ</Text>
//           </View>
//         ))}
//       </View>

//       <View style={styles.orderFooter}>
//         <Text style={styles.orderTotal}>Tổng: {item.total.toLocaleString('vi-VN')}đ</Text>
//         <Text style={styles.orderDate}>{new Date(item.date).toLocaleDateString('vi-VN')}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#a51c30" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
//           <Text style={styles.retryButtonText}>Thử lại</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={orders}
//         renderItem={renderOrderItem}
//         keyExtractor={(item) => item.id}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={orders.length === 0 ? styles.emptyContainer : styles.listContainer}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
//           </View>
//         }
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
//   errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
//   errorText: { fontSize: 16, color: '#666', marginBottom: 16, textAlign: 'center' },
//   retryButton: { backgroundColor: '#a51c30', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
//   retryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
//   emptyContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
//   emptyText: { fontSize: 16, color: '#666', textAlign: 'center' },
//   listContainer: { padding: 16 },
//   orderCard: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
//   orderDate: { fontSize: 14, color: '#666' },
//   orderStatus: { fontSize: 14, fontWeight: '600' },
//   orderItems: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f0f0f0', paddingVertical: 12 },
//   productItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
//   productName: { flex: 1, fontSize: 14, color: '#333' },
//   productQuantity: { fontSize: 14, color: '#666', marginHorizontal: 8 },
//   productPrice: { fontSize: 14, color: '#333', fontWeight: '600' },
//   orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
//   orderTotal: { fontSize: 16, fontWeight: 'bold', color: '#333' },
// });

// export default OrderHistory;
