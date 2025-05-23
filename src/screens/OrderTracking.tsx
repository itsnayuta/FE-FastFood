import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  KeyboardAvoidingView, Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function OrderTracking() {


  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [orderCode, setOrderCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onCheckStatus = () => {
    if (!email.trim() || !orderCode.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (!validateEmail(email)) {
      setErrorMsg('Email không hợp lệ.');
      return;
    }
    setErrorMsg('');

    navigation.navigate('OrderTrackingDetail', { email, orderCode });
  };

  const onChangeEmail = (text: string) => {
    setEmail(text);
    if (errorMsg) setErrorMsg('');
  };

  const onChangeOrderCode = (text: string) => {
    setOrderCode(text);
    if (errorMsg) setErrorMsg('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>KIỂM TRA TRẠNG THÁI ĐƠN HÀNG</Text>

      <Text style={styles.label}>Địa chỉ email của bạn *</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={onChangeEmail}
      />

      <Text style={styles.label}>Mã đơn hàng của bạn *</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập mã đơn hàng"
        value={orderCode}
        onChangeText={onChangeOrderCode}
      />

      <TouchableOpacity style={styles.button} onPress={onCheckStatus}>
        <Text style={styles.buttonText}>Xem trạng thái đơn hàng</Text>
      </TouchableOpacity>

      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 30,
    textAlign: 'center',
    color: '#000',
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    paddingVertical: 8,
    marginBottom: 25,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#D80027',
    borderRadius: 25,
    paddingVertical: 14,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#D80027',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  errorText: {
    color: '#D80027',
    marginTop: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});
