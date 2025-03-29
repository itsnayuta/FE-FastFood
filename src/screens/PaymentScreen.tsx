import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface CustomCheckBoxProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
}
type PaymentScreenRouteProp = RouteProp<RootStackParamList, "Payment">;

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
  const navigation = useNavigation();

  const route = useRoute<PaymentScreenRouteProp>();
  const { foodItems, totalPrice } = route.params || { foodItems: [], totalPrice: 0 };


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

  const [selectedMethod, setSelectedMethod] = useState<'cod' | 'zalopay'>('cod');
  const [agreePolicy, setAgreePolicy] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = () => {
    console.log('Payment initiated', { formData, selectedMethod, foodItems, totalPrice });
  };

  const icons = {
    cod: require("../assets/icons/cod_icon.png"),
    zalopay: require("../assets/icons/zalopay_icon.png"),
  };
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Được giao từ: KFC BIG C HỒ GƯƠM</Text>
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
          <Text style={styles.boldText}>KFC BIG C HỒ GƯƠM</Text>
          <Text>
            Gian hàng số 8, Tầng 1, TTTM Hồ Gươm Plaza, P.Mộ Lao, Q.Hà Đông, Tp Hà Nội 12110
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
          ].map(({ key, label, placeholder }) => (
            <View key={key} style={styles.inputBox}>
              <Text style={styles.label}>{label}</Text>
              <TextInput 
                style={styles.input} 
                placeholder={placeholder} 
                value={formData[key as keyof typeof formData]} 
                onChangeText={(value) => handleInputChange(key as keyof typeof formData, value)} 
              />
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
                style={styles.input} 
                placeholder={placeholder} 
                keyboardType={keyboardType as any} 
                value={formData[key as keyof typeof formData]} 
                onChangeText={(value) => handleInputChange(key as keyof typeof formData, value)} 
              />
            </View>
          ))}
        </View>

        {/* Payment Methods */}
        <View style={styles.infoBox}>
          <Text style={styles.label}>PHƯƠNG THỨC THANH TOÁN:</Text> 
          {[
            { method: 'cod', label: 'Thanh toán khi nhận hàng' },
            { method: 'zalopay', label: 'Thanh toán bằng QR ZaloPay' },
          ].map(({ method, label }) => (
            <TouchableOpacity 
              key={method}
              style={[
                styles.paymentOption, 
                selectedMethod === method && styles.selected
              ]}
              onPress={() => setSelectedMethod(method as 'cod' | 'zalopay')}
            >
              <Text style={[
                styles.paymentText, 
                selectedMethod === method && styles.selectedText
              ]}>
                {label}
              </Text>
              <Image 
                source={icons[method as 'cod' | 'zalopay']} 
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
          style={styles.paymentButton} 
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
                <Text>{item.name} x {item.quality}</Text>
                <Text>{item.price * item.quality} VND</Text>
              </View>
            ))
          ) : (
            <Text>Không có món ăn nào trong giỏ hàng.</Text>
          )}
          <Text style={styles.totalPrice}>Tổng tiền: {totalPrice} VND</Text>
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
    backgroundColor: "green", 
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop:20,
  },
  paymentButtonText: {
    color: "#fff", // chữ trắng
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PaymentScreen;