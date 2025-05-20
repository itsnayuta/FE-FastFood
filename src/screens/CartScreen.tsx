import React, { useState, useEffect } from "react"; // Add useEffect
import {
    View, Text, ScrollView, StyleSheet, Image,
    TouchableOpacity, FlatList, Dimensions, TextInput
} from "react-native";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList, CartItem } from '../types';
import { getCart, removeFromCart, updateQuantity, addCartListener } from "../utils/cart";
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const CartScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [foodItem, setFoodItem] = useState<CartItem[]>(getCart());
    const [coupon, setCoupon] = useState("");

    // Update foodItem when cart changes
    useEffect(() => {
        const unsubscribe = addCartListener(() => {
            setFoodItem([...getCart()]); // Update foodItem with a new array reference
        });
        return unsubscribe; // Cleanup on unmount
    }, []);

    // Đồng bộ giỏ hàng 
    useFocusEffect(
        React.useCallback(() => {
            setFoodItem([...getCart()]); 
        }, [])
    );

    // Tính tổng giá
    const getTotalPrice = (items: CartItem[]) => {
        return items.reduce((sum, item) => sum + item.price * item.quality, 0);
    };

    // Chuyển đến màn hình thanh toán
    const handlePayment = () => {
        const totalPrice = getTotalPrice(foodItem) + 10000;
        navigation.navigate('Payment', {
            foodItems: foodItem,
            totalPrice
        });
    };

    // Cập nhật số lượng sản phẩm
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

    // Xóa sản phẩm khỏi giỏ hàng
    const handleDelete = (id: number) => {
        setFoodItem(prev => prev.filter(item => item.id !== id));
        removeFromCart(id);
    };

    // Render từng mục trong giỏ hàng
    const renderItem = ({ item }: { item: CartItem }) => (
        <View style={style.cardProducts}>
            <View style={style.detailProducts}>
                <Image resizeMode="contain" style={{ width: 120, height: 120 }} source={{ uri: item.imageUrl }} />
                <View style={{ flex: 1, gap: 30 }}>
                    <Text style={{ fontWeight: '900', marginTop: 10, fontSize: 18 }}>{item.name}</Text>
                    <View style={{ flexDirection: 'row', gap: 20 }}>
                        <TouchableOpacity onPress={() => handleDelete(item.id)}>
                            <Text style={style.link}>Xóa</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={style.itemBottom}>
                <View style={style.counter}>
                    <TouchableOpacity onPress={() => handleQuantityChange(item.id, 'decrease')}>
                        <View style={style.circleBtn}><Text style={style.btnText}>−</Text></View>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 15 }}>{item.quality}</Text>
                    <TouchableOpacity onPress={() => handleQuantityChange(item.id, 'increase')}>
                        <View style={style.circleBtn}><Text style={style.btnText}>+</Text></View>
                    </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 16 }}>{(item.price * item.quality).toLocaleString('vi-VN')} VND</Text>
            </View>
        </View>
    );

    return (
        <ScrollView style={style.container}>
            <Image style={style.logoSize} source={require('../assets/product_logo/kfc-logo.jpg')} />
            <Text style={style.fontTextCart}>GIỎ HÀNG CỦA TÔI</Text>

            {foodItem.length === 0 ? (
                <Text style={{ fontSize: 16, textAlign: 'center', marginVertical: 20 }}>
                    Giỏ hàng của bạn đang trống
                </Text>
            ) : (
                <FlatList
                    data={foodItem}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                />
            )}

            <View style={style.paymentProducts}>
                <Text style={style.sectionTitle}>{foodItem.length} Món</Text>

                <View style={style.containerpayment}>
                    <TextInput
                        style={style.input}
                        placeholder="Mã giảm giá"
                        placeholderTextColor="#aaa"
                        value={coupon}
                        onChangeText={setCoupon}
                    />
                    <TouchableOpacity style={style.button}>
                        <Text style={style.buttonText}>Áp dụng</Text>
                    </TouchableOpacity>
                </View>

                <View style={style.priceRow}>
                    <Text>Tổng Đơn Hàng</Text>
                    <Text>{getTotalPrice(foodItem).toLocaleString('vi-VN')}đ</Text>
                </View>

                <View style={style.priceRow}>
                    <Text>Phí giao hàng</Text>
                    <Text>10.000đ</Text>
                </View>

                <View style={[style.priceRow, { marginBottom: 30 }]}>
                    <Text style={style.totalText}>Tổng Thanh Toán</Text>
                    <Text style={style.totalText}>
                        {(getTotalPrice(foodItem) + 10000).toLocaleString('vi-VN')}đ
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={handlePayment}
                    style={[style.checkoutButton, { opacity: foodItem.length === 0 ? 0.5 : 1 }]}
                    disabled={foodItem.length === 0}
                >
                    <Text style={style.checkoutText}>Thanh Toán</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const style = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    logoSize: { width: 80, height: 80, marginBottom: 50 },
    fontTextCart: { fontWeight: '900', fontSize: 30, marginBottom: 20 },
    cardProducts: {
        padding: 10, height: 200, backgroundColor: 'white', borderRadius: 10,
        gap: 10, elevation: 8, marginBottom: 20
    },
    detailProducts: { flexDirection: 'row', gap: 15 },
    link: { fontSize: 14, fontWeight: 'bold', textDecorationLine: 'underline' },
    itemBottom: {
        height: 40, borderTopWidth: 1, borderColor: 'gray',
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', paddingTop: 10
    },
    counter: { flexDirection: 'row', gap: 10, alignItems: "center" },
    circleBtn: {
        width: 30, height: 30, borderWidth: 1, borderRadius: 20,
        justifyContent: "center", alignItems: "center"
    },
    btnText: { fontSize: 20, fontWeight: 'bold' },
    paymentProducts: {
        padding: 15, height: 400, backgroundColor: 'white',
        borderRadius: 10, gap: 10, elevation: 8, marginBottom: 20
    },
    containerpayment: { flexDirection: 'row', margin: 10 },
    input: {
        width: 240, height: 40, borderWidth: 1, borderColor: '#ccc',
        borderRadius: 5, paddingHorizontal: 10
    },
    button: {
        height: 40, paddingHorizontal: 15, backgroundColor: 'black',
        justifyContent: 'center', alignItems: 'center',
        borderRadius: 5, marginLeft: 10
    },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    sectionTitle: { fontWeight: '900', fontSize: 30, marginTop: 30 },
    priceRow: {
        flexDirection: "row", justifyContent: 'space-between',
        borderColor: 'gray', paddingTop: 15
    },
    totalText: { fontSize: 20, fontWeight: '900' },
    checkoutButton: {
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'red', borderRadius: 10, paddingVertical: 15
    },
    checkoutText: { color: 'white', fontWeight: '900', fontSize: 20 }
});

export default CartScreen;