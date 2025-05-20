import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import AsyncStorage from '@react-native-async-storage/async-storage';

type OrderSuccessRouteProp = RouteProp<RootStackParamList, "OrderSuccess">;
type OrderSuccessScreenNavigationProp = StackNavigationProp<RootStackParamList, "OrderSuccess" | "LoginScreen">;

const IconPlaceholder = ({ name, size = 18, color = "#E74C3C" } : {name: string, size?: number, color?: string}) => (
    <View style={{ width: size, height: size, backgroundColor: color, marginRight: 8, borderRadius: size/2, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{color: 'white', fontSize: size * 0.6, fontWeight: 'bold'}}>{name.substring(0,1).toUpperCase()}</Text>
    </View>
);

const OrderSuccessScreen: React.FC = () => {
    const navigation = useNavigation<OrderSuccessScreenNavigationProp>();
    const route = useRoute<OrderSuccessRouteProp>();
    const params = route.params || {};
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            setIsLoggedIn(!!token);
        } catch (error) {
            console.error('Error checking login status:', error);
            setIsLoggedIn(false);
        }
    };

    const handleCreateAccount = () => {
        navigation.navigate('LoginScreen');
    };

    const {
        orderId,
        storeName,
        storeAddress,
        storePhone,
        firstName,
        lastName,
        houseNumber,
        streetName,
        ward,
        customerName: customerNameParam,
        address: addressParam,
        phoneNumber,
        email,
        totalPayment,
        paymentMethod,
        note,
        estimatedDeliveryMin = "30 phút",
        estimatedDeliveryMax = "60 phút",
        orderItems,
        subtotal,
        deliveryFee,
        voucher,
    } = params;

    const [orderDetailsVisible, setOrderDetailsVisible] = useState(true); // Default to true to show details

    // Construct full name and address from new fields if available
    const constructedCustomerName = (firstName && lastName) ? `${lastName} ${firstName}` : customerNameParam || "Khách hàng";
    const constructedAddress = (houseNumber && streetName && ward)
        ? `${houseNumber} ${streetName}, ${ward}`
        : addressParam || "Không có thông tin địa chỉ chi tiết";

    // Use the note from formData if passed, otherwise fallback to existing note
    const displayNote = params.note || note;


    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.headerContainer}>
                <Text style={styles.orderIdText}>Mã đơn hàng của bạn là <Text style={styles.boldText}>{orderId}</Text></Text>
            </View>

            <View style={styles.storeInfoContainer}>
                <View style={styles.infoRow}>
                    <IconPlaceholder name="Store" />
                    <Text style={styles.storeName}>{storeName} - {storePhone}</Text>
                </View>
                <View style={styles.infoRow}>
                    <IconPlaceholder name="Location" />
                    <Text style={styles.infoText}>{storeAddress}</Text>
                </View>
                <View style={styles.infoRow}>
                    <IconPlaceholder name="User" />
                    {/* Display constructed name and phone */}
                    <Text style={styles.infoText}>{constructedCustomerName} - {phoneNumber}</Text>
                </View>
            </View>

            <View style={styles.statusContainer}>
                <View style={styles.statusIndicator}>
                    <View style={[styles.statusDot, styles.activeDot]}><Text style={styles.dotIcon}>📝</Text></View>
                    <View style={styles.statusLine} />
                    <View style={styles.statusDot}><Text style={styles.dotIcon}>🛵</Text></View>
                    <View style={styles.statusLine} />
                    <View style={styles.statusDot}><Text style={styles.dotIcon}>🛍️</Text></View>
                </View>
                <Text style={styles.statusText}>Đơn hàng đang được chuẩn bị</Text>
            </View>

            <View style={styles.deliveryInfoContainer}>
                <Text style={styles.deliveryText}>Dự kiến giao hàng trong khoảng: <Text style={styles.boldText}>{estimatedDeliveryMin} - {estimatedDeliveryMax}</Text></Text>
                <Text style={styles.supportText}>Nếu bạn có thắc mắc về đơn hàng</Text>
                <Text style={styles.supportText}>Vui lòng liên hệ hotline KFC <Text style={styles.boldText}>{storePhone}</Text> để được hỗ trợ</Text>
            </View>

            <TouchableOpacity
                style={styles.orderDetailsToggle}
                onPress={() => setOrderDetailsVisible(!orderDetailsVisible)}
            >
                <Text style={styles.orderDetailsTitle}>CHI TIẾT ĐƠN HÀNG</Text>
                <Text style={styles.arrowIcon}>{orderDetailsVisible ? "▲" : "▼"}</Text>
            </TouchableOpacity>

            {orderDetailsVisible && (
                <View style={styles.orderDetailsContent}>
                    
                    <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
                    <Text style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Họ và tên:</Text>{' '}
                        {constructedCustomerName}
                    </Text>
                    <Text style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Địa chỉ giao hàng:</Text>{' '}
                        {constructedAddress}
                    </Text>
                    <Text style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Số điện thoại:</Text>{' '}
                        {phoneNumber || 'Chưa cập nhật'}
                    </Text>
                    <Text style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Email:</Text>{' '}
                        {email || 'Chưa cập nhật'}
                    </Text>
                    
                    {/* Payment Information */}
                    <View style={styles.paymentSection}>
                        <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
                        <Text style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Tổng đơn hàng:</Text>{' '}
                            <Text style={styles.priceText}>
                                {subtotal?.toLocaleString('vi-VN') || '0'} VND
                            </Text>
                        </Text>
                        <Text style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Phí giao hàng:</Text>{' '}
                            <Text style={styles.priceText}>
                                {deliveryFee?.toLocaleString('vi-VN') || '0'} VND
                            </Text>
                        </Text>
                        <Text style={styles.detailItem}>
                            <Text style={styles.detailLabel}>
                                Mã giảm giá {voucher ? `(${voucher.code})` : ''}:
                            </Text>{' '}
                            <Text style={[styles.priceText, voucher?.discount ? styles.discountText : null]}>
                                {voucher?.discount ? '-' : ''}{voucher?.discount?.toLocaleString('vi-VN') || '0'} VND
                            </Text>
                        </Text>
                        <Text style={[styles.detailItem, styles.totalPayment]}>
                            <Text style={styles.detailLabel}>Tổng thanh toán:</Text>{' '}
                            <Text style={[styles.priceText, styles.totalPriceText]}>
                                {totalPayment?.toLocaleString('vi-VN') || '0'} VND
                            </Text>
                        </Text>
                        <Text style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Phương thức thanh toán:</Text>{' '}
                            {paymentMethod === "CASH" ? "Tiền mặt" : paymentMethod || 'Chưa cập nhật'}
                        </Text>
                    </View>

                    {displayNote && <Text style={styles.detailItem}><Text style={styles.detailLabel}>Ghi chú:</Text> {displayNote}</Text>}
                    <Text style={styles.thankYouMessage}>Cảm ơn bạn đã đặt hàng!</Text>
                </View>
            )}

            {!isLoggedIn && (
                <View style={styles.accountPromptContainer}>
                    <Text style={styles.promptText}>Thêm mật khẩu để thanh toán nhanh hơn vào lần sau bằng tài khoản KFC.</Text>
                    <Text style={styles.promptText}>Đăng ký để nhận những ưu đãi & độc quyền và mới nhất từ KFC bạn nhé!</Text>
                    <TouchableOpacity 
                        style={styles.createAccountButton}
                        onPress={handleCreateAccount}
                    >
                        <Text style={styles.createAccountButtonText}>Tạo Tài Khoản</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: "#F8F8F8",
    },
    scrollViewContent: {
        paddingBottom: 30,
    },
    headerContainer: {
        backgroundColor: "#FFFFFF",
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    orderIdText: {
        fontSize: 16,
        color: "#333333",
    },
    boldText: {
        fontWeight: "bold",
    },
    storeInfoContainer: {
        backgroundColor: "#FFFFFF",
        padding: 20,
        marginTop: 10,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    storeName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#C0392B",
    },
    infoText: {
        fontSize: 14,
        color: "#555555",
        flexShrink: 1,
    },
    statusContainer: {
        backgroundColor: "#FFFFFF",
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: "center",
        marginTop: 10,
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    statusDot: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#E74C3C',
        borderColor: '#C0392B',
        borderWidth: 2,
    },
    dotIcon: {
        fontSize: 18,
    },
    statusLine: {
        height: 2,
        width: 40,
        backgroundColor: '#E0E0E0',
    },
    statusText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#E74C3C",
        marginTop: 10,
    },
    deliveryInfoContainer: {
        backgroundColor: "#FFFFFF",
        padding: 20,
        alignItems: "center",
        marginTop: 10,
    },
    deliveryText: {
        fontSize: 14,
        color: "#333333",
        textAlign: "center",
    },
    supportText: {
        fontSize: 13,
        color: "#555555",
        textAlign: "center",
        marginTop: 5,
    },
    orderDetailsToggle: {
        backgroundColor: "#FFFFFF",
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    orderDetailsTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#C0392B",
    },
    arrowIcon: {
        fontSize: 16,
        color: "#C0392B",
    },
    orderDetailsContent: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#C0392B",
        marginBottom: 10,
    },
    sectionSubtitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#C0392B",
        marginBottom: 5,
    },
    orderItemsSection: {
        marginBottom: 20,
    },
    orderItem: {
        marginBottom: 10,
    },
    orderItemHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    orderItemName: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333333",
    },
    orderItemQuantity: {
        fontSize: 12,
        color: "#555555",
    },
    orderItemOptions: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    orderItemOption: {
        fontSize: 12,
        color: "#555555",
    },
    orderItemPrice: {
        fontSize: 12,
        color: "#555555",
    },
    detailItem: {
        fontSize: 14,
        color: "#333333",
        marginBottom: 8,
        lineHeight: 20,
    },
    detailLabel: {
        fontWeight: '600',
        color: '#444444',
    },
    thankYouMessage: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: "bold",
        color: "#E74C3C",
        textAlign: "center",
    },
    accountPromptContainer: {
        backgroundColor: "#FFFFFF",
        padding: 20,
        marginTop: 10,
        alignItems: "center",
    },
    promptText: {
        fontSize: 13,
        color: "#555555",
        textAlign: "center",
        marginBottom: 10,
        marginHorizontal: 10,
    },
    createAccountButton: {
        backgroundColor: "#E74C3C",
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 25,
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    createAccountButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    paymentSection: {
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    priceText: {
        color: '#333333',
        fontWeight: '500',
    },
    totalPayment: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    totalPriceText: {
        color: '#E74C3C',
        fontWeight: 'bold',
        fontSize: 16,
    },
    discountText: {
        color: '#E74C3C',
    },
});

export default OrderSuccessScreen;
