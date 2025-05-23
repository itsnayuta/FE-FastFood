import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute } from '@react-navigation/native';

type RouteParams = {
  email: string;
  orderCode: string;
};

const OrderTrackingDetail = () => {
  const route = useRoute<any>(); 
  const { email, orderCode } = route.params as RouteParams;
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const steps = [
    { label: 'Đang chế biến', icon: 'kitchen', key: 'processing' },
    { label: 'Đang giao hàng', icon: 'local-shipping', key: 'shipping' },
    { label: 'Giao thành công', icon: 'check-circle', key: 'delivered' },
  ];

  
  const mockFetchOrderStatus = async (email: string, orderCode: string) => {
   
    await new Promise(resolve => setTimeout(resolve, 1500));

    
    if (!email || !orderCode) {
      throw new Error('Email hoặc mã đơn hàng không hợp lệ.');
    }

    
    const possibleStatuses = ['processing', 'shipping', 'delivered'];
    const randomStatus = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];

   
    if (orderCode.toLowerCase() === 'invalid') {
      throw new Error('Mã đơn hàng không tồn tại.');
    }

    return { status: randomStatus };
  };

  // Fetch order status
  const fetchOrderStatus = async (email: string, orderCode: string) => {
    try {
      setIsLoading(true);
      
      //thay ham mockFetchOrderStatus thành api hàm fecth dữ liệu api của m, tìm kiếm ở db email, orderCode, lấy data từ đó ra
      //cái hàm mock chỉ là giả lập lấy dữ liệu thôi
      const data = await mockFetchOrderStatus(email, orderCode);
      setStatus(data.status);
    } catch (error: any) {
      setErrorMsg(error.message || 'Có lỗi xảy ra khi kiểm tra trạng thái.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch status on component mount
  useEffect(() => {
    fetchOrderStatus(email, orderCode);
  }, [email, orderCode]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Đang tải trạng thái...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Trạng thái đơn hàng</Text>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  // Determine the current step index based on status
  const currentStepIndex = steps.findIndex(step => step.key === status);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trạng thái đơn hàng</Text>
      <View style={styles.trackerContainer}>
        {steps.map((step, index) => {
          const isActive = index <= currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <View key={step.key} style={styles.stepContainer}>
              <View style={styles.step}>
                <Icon
                  name={step.icon}
                  size={30}
                  color={isActive ? '#4CAF50' : '#B0BEC5'}
                />
                <Text style={[styles.stepLabel, isActive && styles.activeLabel]}>
                  {step.label}
                </Text>
              </View>

              {/* Line connector, not shown after the last step */}
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.connector,
                    isCompleted && styles.connectorCompleted,
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    margin: 16,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  trackerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  step: {
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    color: '#B0BEC5',
  },
  activeLabel: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  connector: {
    height: 2,
    backgroundColor: '#B0BEC5',
    width: '100%',
    position: 'absolute',
    top: 15,
    left: '50%',
    zIndex: -1,
  },
  connectorCompleted: {
    backgroundColor: '#4CAF50',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#D80027',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default OrderTrackingDetail;