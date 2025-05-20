import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  Linking,
} from 'react-native';
import { processOrder, processPayment } from '../services/api'; // Adjust the import path as necessary
import AsyncStorage from '@react-native-async-storage/async-storage';
type PaymentScreenRouteProp = RouteProp<RootStackParamList, "Payment">;
type PaymentScreenNavigationProp = StackNavigationProp<RootStackParamList, "Payment">;

interface CustomCheckBoxProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
}

const CustomCheckBox: React.FC<CustomCheckBoxProps> = ({ value, onValueChange }) => {
  return (
    <TouchableOpacity 
      style={styles.checkboxContainer} 
      onPress={() => onValueChange(!value)}
    >
      <View style={[styles.checkbox, value && styles.checkboxSelected]}>
        {value && <Text style={styles.checkmark}>✓</Text>}
      </View>
    </TouchableOpacity>
  );
};



const PaymentScreen: React.FC = () => {
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  const route = useRoute<PaymentScreenRouteProp>();
  
  const { foodItems, totalPrice, voucher } = route.params || { foodItems: [], totalPrice: 0, voucher: null };
  
  // State for form inputs
  const [formData, setFormData] = useState({
    houseNumber: '',
    streetName: '',
    ward: '',
    note: '',
    lastName: '',
    firstName: '',
    phoneNumber: '',
    email: '',
  });

  const [selectedMethod, setSelectedMethod] = useState<'cod' | 'vnpay'>('cod');
  const [agreePolicy, setAgreePolicy] = useState(false);
  const shippingFee = 10000; // Shipping Fee
  const voucherDiscount = voucher?.discount || 0;

  const [error, setError] = useState<{ [key: string]: string }>({});


  
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };


  const handlePayment = async () => {
  let newErrors: { [key: string]: string } = {};

  if (!formData.lastName.trim()) newErrors.lastName = "Vui lòng nhập họ.";
  if (!formData.firstName.trim()) newErrors.firstName = "Vui lòng nhập tên.";
  if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Vui lòng nhập số điện thoại.";
  if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email.";
  if (!formData.streetName.trim()) newErrors.streetName = "Vui lòng nhập tên đường.";
  if (!formData.ward.trim()) newErrors.ward = "Vui lòng nhập Phường/Xã.";

  if (Object.keys(newErrors).length > 0) {
    setError(newErrors);
    return;
  }

  setError({});
  const userStr = await AsyncStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};
  const memberId = user.id || user.memberId;

  const orderPayload = {
        createdAt: new Date().toISOString(),
        memberId: memberId,
        note: formData.note,
        status: "PENDING",
      };
  const orderRes = await processOrder(orderPayload);
  const orderId = orderRes.id;
  console.log("Order ID:", orderId);
  const bill = {
    memberId: memberId,
    orderId: orderId,
    paymentMethod: selectedMethod === "cod" ? "CASH" : "VNPAY",
    discount: voucherDiscount,
    totalPayment: totalPrice - voucherDiscount,
    tax: 0,
    paymentStatus: "PENDING", 
    voucher: voucher ? voucher.id : null,
  };
  console.log("Bill data:", bill);
  try {
    const response = await processPayment(bill);
    if (response.status < 200 || response.status >= 300) {
      const errorText = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      Alert.alert("Lỗi", `Lỗi từ server: ${errorText}`);
      return;
    }

    let responseData = response.data;
    if (typeof responseData === 'string') {
      responseData = { paymentUrl: responseData };
    }

    // Navigate to OrderSuccess screen directly
    navigation.navigate("OrderSuccess", {
      orderId: "ORDER" + responseData.id,
      storeName: "FastFood Hà Đông",
      storeAddress: "Gian hàng số 8, Tầng 1, Học viện PTIT, P.Mộ Lao, Q.Hà Đông, Tp Hà Nội",
      storePhone: "1900 1234",
      firstName: formData.firstName,
      lastName: formData.lastName,
      houseNumber: formData.houseNumber,
      streetName: formData.streetName,
      ward: formData.ward,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      totalPayment: totalPrice - voucherDiscount,
      paymentMethod: selectedMethod === "cod" ? "CASH" : "VNPAY",
      note: formData.note,
      orderItems: foodItems,
      subtotal: totalPrice,
      deliveryFee: shippingFee,
      voucher: voucher
    });

    // If VNPAY, open payment URL after navigation
    if (selectedMethod === "vnpay" && responseData.paymentUrl) {
      Linking.openURL(responseData.paymentUrl);
    }
  } catch (error: any) {
  Alert.alert("Lỗi", "Không thể kết nối tới máy chủ!\n" + error?.message);
}
};
  

  const icons = {
    cod: require("../assets/icons/cod_icon.png"),
    vnpay: require("../assets/icons/zalopay_icon.png"),
  };
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Được giao từ: FastFoood Hà Đông</Text>
          <TouchableOpacity style={styles.changeButton}>
            <Text style={styles.changeButtonText}>Thay đổi</Text>
          </TouchableOpacity>
          
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>THÔNG TIN ĐẶT HÀNG</Text>
        </View>

        {/* Delivery Time */}
        <View style={styles.infoBox}>
          <Text style={styles.label}>THỜI GIAN GIAO HÀNG:</Text>
          <Text style={styles.textValue}>Giao Ngay</Text>
        </View>

        {/* Delivery Location */}
        <View style={styles.infoBox}>
          <Text style={styles.label}>ĐƯỢC GIAO TỪ:</Text>
          <Text style={styles.boldText}>FastFood Hà Đông</Text>
          <Text>
            Gian hàng số 8, Tầng 1, Học viện PTIT, P.Mộ Lao, Q.Hà Đông, Tp Hà Nội
          </Text>
        </View>

        {/* Delivery Address */}
        <View style={styles.infoBox}>
          <Text style={styles.label}>ĐỊA CHỈ NHẬN HÀNG:</Text>
          {[
            { key: 'houseNumber', label: 'Số nhà', placeholder: 'Nhập số nhà' },
            { key: 'streetName', label: 'Tên đường*', placeholder: 'Nhập tên đường' },
            { key: 'ward', label: 'Phường/ Xã*', placeholder: 'Nhập phường/xã' },
            { key: 'note', label: 'Ghi chú cho đơn hàng', placeholder: 'Nhập ghi chú (nếu có)' },
          ].map(({ key, label, placeholder}) => (
            <View key={key} style={styles.inputBox}>
              <Text style={styles.label}>{label}</Text>
              <TextInput 
                style={[styles.input, error[key] && styles.inputError]} 
                placeholder={placeholder} 
                value={formData[key as keyof typeof formData]} 
                onChangeText={(value) => handleInputChange(key as keyof typeof formData, value)} 
              />
              {error[key] && <Text style={styles.errorText}>{error[key]}</Text>}
            </View>
          ))}
        </View>

        {/* Recipient Information */}
        <View style={styles.infoBox}>
          <Text style={styles.label}>THÔNG TIN NGƯỜI NHẬN:</Text>
          {[
            { key: 'lastName', label: 'Họ của bạn*', placeholder: 'Nhập họ' },
            { key: 'firstName', label: 'Tên của bạn*', placeholder: 'Nhập tên' },
            { key: 'phoneNumber', label: 'Số điện thoại*', placeholder: 'Nhập số điện thoại', keyboardType: 'phone-pad' },
            { key: 'email', label: 'Email*', placeholder: 'Nhập email', keyboardType: 'email-address' },
          ].map(({ key, label, placeholder, keyboardType }) => (
            <View key={key} style={styles.inputBox}>
              <Text style={styles.label}>{label}</Text>
              <TextInput 
                style={[styles.input, error[key] && styles.inputError]} 
                placeholder={placeholder} 
                keyboardType={keyboardType as any} 
                value={formData[key as keyof typeof formData]} 
                onChangeText={(value) => handleInputChange(key as keyof typeof formData, value)} 
              />
              {error[key] && <Text style={styles.errorText}>{error[key]}</Text>}
            </View>
          ))}
        </View>


        {/* Payment Methods */}
        <View style={styles.infoBox}>
          <Text style={styles.label}>PHƯƠNG THỨC THANH TOÁN:</Text> 
          {[
            { method: 'cod', label: 'Thanh toán khi nhận hàng' },
            { method: 'vnpay', label: 'Thanh toán bằng QR ZaloPay' },
          ].map(({ method, label }) => (
            <TouchableOpacity 
              key={method}
              style={[
                styles.paymentOption, 
                selectedMethod === method && styles.selected
              ]}
              onPress={() => setSelectedMethod(method as 'cod' | 'vnpay')}
            >
              <Text style={[
                styles.paymentText, 
                selectedMethod === method && styles.selectedText
              ]}>
                {label}
              </Text>
              <Image 
                source={icons[method as 'cod' | 'vnpay']} 
                style={styles.icon}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Policy Checkbox */}
        <View style={styles.policyContainer}>
          <CustomCheckBox value={agreePolicy} onValueChange={setAgreePolicy} />
          <Text style={styles.policyText}>
            Tôi đã đọc và đồng ý với các{' '}
            <Text style={styles.linkText}>Chính Sách Hoạt Động</Text> và{' '}
            <Text style={styles.linkText}>Chính Sách Bảo Mật Thông Tin</Text> của KFC Việt Nam.
          </Text>
        </View>

        {/* Payment Button */}
        <TouchableOpacity 
          style={[styles.paymentButton, !agreePolicy && styles.paymentButtonDisabled]} 
          onPress={handlePayment}
          disabled={!agreePolicy}
        >
          <Text style={styles.paymentButtonText}>Thanh toán</Text>
        </TouchableOpacity>

        {/* Order Summary */}
        <View style={styles.infoBox}>
          <Text style={styles.label}>TÓM TẮT ĐƠN HÀNG:</Text>
            {foodItems.length > 0 ? (
              foodItems.map((item, index) => (
                <View key={index} style={styles.foodItem}>
                  <Text style={styles.foodText}>
                    {item.quality}x {item.name}
                  </Text>
                  <Text style={styles.foodPrice}>
                    {(item.price * item.quality).toLocaleString()} VND
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Không có món ăn nào trong giỏ hàng.</Text>
            )}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Phí giao hàng</Text>
            <Text style={styles.summaryText}>{shippingFee.toLocaleString()} VND</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>
              Mã giảm giá {voucher ? `(${voucher.code})` : ''}
            </Text>
            <Text style={[styles.summaryText, voucherDiscount > 0 && styles.discountText]}>
              {voucherDiscount > 0 ? '-' : ''}{voucherDiscount.toLocaleString()} VND
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng thanh toán</Text>
            <Text style={styles.totalPrice}>
              {(totalPrice - voucherDiscount).toLocaleString()} VND
            </Text>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  foodItem: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  totalPrice: { fontWeight: "bold", marginTop: 10, fontSize: 16 },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },

  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },
  foodText: {
    fontSize: 14,
  },
  emptyText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    paddingVertical: 10,
  },
  foodPrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  summaryText: {
    fontSize: 14,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    backgroundColor: "#000",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  changeButton: {
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  changeButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  titleContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  titleText: {
    fontSize: 22,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  infoBox: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  inputBox: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  textValue: {
    fontSize: 16,
    color: "#000",
  },
  boldText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
  },
  selected: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  paymentText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  selectedText: {
    color: "#fff",
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  policyContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 10,
    marginTop: 10,
    marginLeft: 20,
    paddingRight: 15,
  },
  policyText: {
    flex: 1,
    marginLeft: 5,
    fontSize: 14,
    color: "#000",
    lineHeight: 20,
  },
  linkText: {
    color: "blue",
    textDecorationLine: "underline",
  },
  checkboxContainer: {
    marginTop: 3,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
  },
  paymentButton: {
    backgroundColor: "#52ed05", 
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop:20,
  },
  paymentButtonDisabled: {
    backgroundColor: "#ffcc99", 
  },
  paymentButtonText: {
    color: "#fff", // chữ trắng
    fontSize: 16,
    fontWeight: "bold",
  },
  discountText: {
    color: '#E74C3C',
  },
});

export default PaymentScreen;