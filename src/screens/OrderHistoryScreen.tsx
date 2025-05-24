import React from 'react';
import { StyleSheet, View } from 'react-native';
import OrderHistory from '../components/OrderHistory';
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';

type OrderHistoryScreenProps = {
  navigation: StackNavigationProp<ParamListBase>;
};

const OrderHistoryScreen: React.FC<OrderHistoryScreenProps> = ({ navigation }) => {
  const handleOrderPress = (orderId: string) => {
    navigation.navigate('OrderDetails', { orderId });
  };

  return (
    <View style={styles.container}>
      <OrderHistory onOrderPress={handleOrderPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

export default OrderHistoryScreen; 