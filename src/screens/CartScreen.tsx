import React, { useState, useEffect } from "react";
import {
    View, Text, ScrollView, StyleSheet, Image,
    TouchableOpacity, FlatList, Dimensions, TextInput,
    Alert
} from "react-native";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList, CartItem } from '../types'; // Assuming types are defined
import { getCart, removeFromCart, updateQuantity, addCartListener } from "../utils/cart"; // Assuming cart utils are defined
import { useFocusEffect } from '@react-navigation/native';
import { validateVoucher } from '../services/api'; // Assuming API service is defined

const { width } = Dimensions.get('window');

const CartScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [foodItem, setFoodItem] = useState<CartItem[]>(getCart());
    const [coupon, setCoupon] = useState("");
    const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
    const [discountAmount, setDiscountAmount] = useState(0);

    useEffect(() => {
        const unsubscribe = addCartListener(() => {
            setFoodItem([...getCart()]);
        });
        return unsubscribe;
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            setFoodItem([...getCart()]);
        }, [])
    );

    const getTotalPrice = (items: CartItem[]) => {
        return items.reduce((sum, item) => sum + item.price * item.quality, 0);
    };

    const handleApplyVoucher = async () => {
        if (!coupon.trim()) {
            Alert.alert("Thông báo", "Vui lòng nhập mã giảm giá");
            return;
        }
        if (foodItem.length === 0) {
            Alert.alert("Thông báo", "Giỏ hàng trống, không thể áp dụng mã giảm giá.");
            return;
        }

        try {
            const voucher = await validateVoucher(coupon);
            const totalPrice = getTotalPrice(foodItem);

            if (voucher.minOrderAmount && totalPrice < voucher.minOrderAmount) {
                Alert.alert(
                    "Không thể áp dụng",
                    `Đơn hàng tối thiểu phải là ${voucher.minOrderAmount.toLocaleString('vi-VN')}đ để sử dụng voucher này.`
                );
                return;
            }

            let discount = (totalPrice * voucher.discount) / 100;
            if (voucher.maxDiscount && discount > voucher.maxDiscount) {
                discount = voucher.maxDiscount;
            }

            setAppliedVoucher(voucher);
            setDiscountAmount(discount);
            Alert.alert("Thành công", "Áp dụng mã giảm giá thành công!");
        } catch (error: any) {
            if (error.message === 'Voucher expired') {
                Alert.alert("Lỗi", "Mã giảm giá đã hết hạn.");
            } else {
                Alert.alert("Lỗi", "Mã giảm giá không tồn tại");
            }
        }
    };

    const handleRemoveVoucher = () => {
        setAppliedVoucher(null);
        setDiscountAmount(0);
        setCoupon(""); // Clear the input field as well
        Alert.alert("Thông báo", "Đã bỏ áp dụng mã giảm giá.");
    };

    const getFinalTotal = () => {
        const subtotal = getTotalPrice(foodItem);
        // Only add shipping if there are items
        const shippingFee = foodItem.length > 0 ? 10000 : 0;
        return subtotal + shippingFee - discountAmount;
    };

    const handlePayment = () => {
        const finalTotal = getFinalTotal();
        navigation.navigate('Payment', {
            foodItems: foodItem,
            totalPrice: finalTotal,
            voucher: appliedVoucher
                ? { id: appliedVoucher.id, code: appliedVoucher.code, discount: appliedVoucher.discount }
                : undefined,
        });
    };

    const handleQuantityChange = (id: number, type: 'increase' | 'decrease') => {
        setFoodItem(prev =>
            prev.map(item =>
                item.id === id
                ? {
                        ...item,
                        quality:
                            type === 'increase'
                                ? item.quality + 1
                                : item.quality > 1
                                ? item.quality - 1
                                : 1,
                    }
                    : item
            )
        );
        updateQuantity(id, type === 'increase' ? 0 : 1);
    };

    const handleDelete = (id: number) => {
        setFoodItem(prev => prev.filter(item => item.id !== id));
        removeFromCart(id);
    };

    const renderItem = ({ item }: { item: CartItem }) => (
        <View style={style.cardProducts}>
            <View style={style.detailProducts}>
                <Image resizeMode="contain" style={style.foodImage} source={{ uri: item.imageUrl }} />
                <View style={style.foodInfoContainer}>
                    <Text style={style.foodName}>{item.name}</Text>
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                        <Text style={style.link}>Xóa</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={style.itemBottom}>
                <View style={style.counter}>
                    <TouchableOpacity onPress={() => handleQuantityChange(item.id, 'decrease')}>
                        <View style={style.circleBtn}><Text style={style.btnText}>−</Text></View>
                    </TouchableOpacity>
                    <Text style={style.quantityText}>{item.quality}</Text>
                    <TouchableOpacity onPress={() => handleQuantityChange(item.id, 'increase')}>
                        <View style={style.circleBtn}><Text style={style.btnText}>+</Text></View>
                    </TouchableOpacity>
                </View>
                <Text style={style.itemPriceText}>{(item.price * item.quality).toLocaleString('vi-VN')} VND</Text>
            </View>
        </View>
    );

    return (
        <ScrollView style={style.container} contentContainerStyle={style.scrollContentContainer}>
            <Image style={style.logoSize} source={require('../assets/product_logo/kfc-logo.jpg')} />
            <Text style={style.fontTextCart}>GIỎ HÀNG CỦA TÔI</Text>

            {foodItem.length === 0 ? (
                <View style={style.emptyCartContainer}>
                    <Text style={style.emptyCartText}>
                        Giỏ hàng của bạn đang trống.
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Home' as any)}>
                        <Text style={style.browseProductsLink}>Xem sản phẩm</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={foodItem}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                />
            )}

            {foodItem.length > 0 && (
                <View style={style.paymentProducts}>
                    <Text style={style.sectionTitle}>{foodItem.length} Món</Text>

                    <View style={style.containerpayment}>
                        <TextInput
                            style={style.input}
                            placeholder="Mã giảm giá"
                            placeholderTextColor="#aaa"
                            value={coupon}
                            onChangeText={setCoupon}
                            editable={!appliedVoucher}
                        />
                        {!appliedVoucher ? (
                            <TouchableOpacity
                                style={[style.button, foodItem.length === 0 && style.buttonDisabled]}
                                onPress={handleApplyVoucher}
                                disabled={foodItem.length === 0}
                            >
                                <Text style={style.buttonText}>Áp dụng</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={[style.button, style.removeButton]} // Added removeButton style
                                onPress={handleRemoveVoucher}
                            >
                                <Text style={style.buttonText}>Bỏ Voucher</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {appliedVoucher && (
                        <View style={style.voucherInfo}>
                            <Text style={style.voucherText}>
                                Mã giảm giá: {appliedVoucher.code} (-{appliedVoucher.discount}%)
                            </Text>
                            <Text style={style.discountTextInfo}>
                                Giảm: {discountAmount.toLocaleString('vi-VN')}đ
                            </Text>
                        </View>
                    )}

                    <View style={style.priceRow}>
                        <Text style={style.priceLabel}>Tổng Đơn Hàng</Text>
                        <Text style={style.priceValue}>{getTotalPrice(foodItem).toLocaleString('vi-VN')}đ</Text>
                    </View>

                    <View style={style.priceRow}>
                        <Text style={style.priceLabel}>Phí giao hàng</Text>
                        <Text style={style.priceValue}>{foodItem.length > 0 ? '10.000đ' : '0đ'}</Text>
                    </View>

                    {appliedVoucher && discountAmount > 0 && (
                        <View style={style.priceRow}>
                            <Text style={style.priceLabel}>Giảm giá Voucher</Text>
                            <Text style={[style.priceValue, style.discountTextValue]}>
                                -{discountAmount.toLocaleString('vi-VN')}đ
                            </Text>
                        </View>
                    )}

                    <View style={style.totalContainer}>
                        <Text style={style.totalText}>Tổng Thanh Toán</Text>
                        <Text style={style.totalTextValue}>
                            {getFinalTotal().toLocaleString('vi-VN')}đ
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={handlePayment}
                        style={[style.checkoutButton, { opacity: foodItem.length === 0 ? 0.6 : 1 }]}
                        disabled={foodItem.length === 0}
                    >
                        <Text style={style.checkoutText}>Thanh Toán</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa'
    },
    scrollContentContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 30,
    },
    logoSize: {
        width: 70,
        height: 70,
        marginBottom: 25,
        alignSelf: 'center'
    },
    fontTextCart: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 25,
        textAlign: 'center',
        color: '#212529'
    },
    emptyCartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginHorizontal: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    emptyCartText: {
        fontSize: 17,
        color: '#495057',
        marginBottom: 15,
    },
    browseProductsLink: {
        fontSize: 16,
        color: '#E74C3C',
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    cardProducts: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 12,
        elevation: 2,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    detailProducts: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    foodImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 15,
    },
    foodInfoContainer: {
        flex: 1,
        justifyContent: 'center',
        height: 80,
    },
    foodName: {
        fontWeight: '600',
        fontSize: 16,
        color: '#343a40',
        marginBottom: 8,
        flexShrink: 1,
    },
    link: {
        fontSize: 14,
        fontWeight: '500',
        textDecorationLine: 'underline',
        color: '#E74C3C'
    },
    itemBottom: {
        borderTopWidth: 1,
        borderColor: '#e9ecef',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        marginTop: 12,
    },
    counter: {
        flexDirection: 'row',
        gap: 12,
        alignItems: "center"
    },
    circleBtn: {
        width: 30,
        height: 30,
        borderWidth: 1,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        borderColor: '#ced4da'
    },
    btnText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#495057'
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '500',
        minWidth: 20,
        textAlign: 'center',
        color: '#212529'
    },
    itemPriceText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212529'
    },
    paymentProducts: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 12,
        elevation: 2,
        marginTop: 10,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    containerpayment: {
        flexDirection: 'row',
        marginVertical: 15,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 48,
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginRight: 10,
        fontSize: 15,
        backgroundColor: '#fff'
    },
    button: {
        height: 48,
        paddingHorizontal: 20,
        backgroundColor: '#212529',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
    buttonDisabled: {
        backgroundColor: '#adb5bd',
    },
    removeButton: { // Style for the "Remove Voucher" button
        backgroundColor: '#6c757d', // A neutral grey color
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 15,
        color: '#343a40',
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f5',
    },
    priceLabel: {
        fontSize: 15,
        color: '#495057',
    },
    priceValue: {
        fontSize: 15,
        fontWeight: '500',
        color: '#212529',
    },
    voucherInfo: {
        backgroundColor: '#fff3cd',
        padding: 12,
        borderRadius: 8,
        marginVertical: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#ffc107'
    },
    voucherText: {
        fontSize: 14,
        color: '#664d03',
        marginBottom: 4,
    },
    discountTextInfo: {
        color: '#856404',
        fontWeight: '600',
        fontSize: 14,
    },
    discountTextValue: {
        color: '#dc3545',
        fontWeight: '600',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 2,
        borderTopColor: '#E74C3C',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212529',
    },
    totalTextValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E74C3C',
    },
    checkoutButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E74C3C',
        borderRadius: 8,
        paddingVertical: 15,
        marginTop: 20,
        height: 50,
    },
    checkoutText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 17,
    },
});

export default CartScreen;
