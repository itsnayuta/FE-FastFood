import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

// Mock order data - replace with real data from your backend
const mockOrders = [
  {
    id: '1',
    date: '2024-03-20',
    total: 29.99,
    status: 'Delivered',
    items: [
      { name: 'Classic Burger', quantity: 2, price: 9.99 },
      { name: 'French Fries', quantity: 1, price: 4.99 },
    ],
  },
  {
    id: '2',
    date: '2024-03-15',
    total: 45.50,
    status: 'Delivered',
    items: [
      { name: 'Chicken Combo', quantity: 1, price: 15.99 },
      { name: 'Coca Cola', quantity: 2, price: 2.99 },
      { name: 'Ice Cream', quantity: 1, price: 3.99 },
    ],
  },
];

type OrderHistoryProps = {
  onOrderPress?: (orderId: string) => void;
};

const OrderHistory: React.FC<OrderHistoryProps> = ({ onOrderPress }) => {
  const renderOrderItem = ({ item }: { item: typeof mockOrders[0] }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => onOrderPress?.(item.id)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderDate}>Order #{item.id}</Text>
        <Text style={styles.orderStatus}>{item.status}</Text>
      </View>
      
      <View style={styles.orderItems}>
        {item.items.map((product, index) => (
          <View key={index} style={styles.productItem}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productQuantity}>x{product.quantity}</Text>
            <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>Total: ${item.total.toFixed(2)}</Text>
        <Text style={styles.orderDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      <FlatList
        data={mockOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderStatus: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  orderItems: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    paddingVertical: 12,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  productQuantity: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 8,
  },
  productPrice: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default OrderHistory; 