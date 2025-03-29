import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    Alert,
    TextInput
} from "react-native";
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList, FoodItem } from '../navigation';
const {width} = Dimensions.get('window');

interface RenderItemProps {
    item: FoodItem;
}

interface CartScreenProps {
    navigation: NavigationProp<RootStackParamList, 'Cart'>;
}

const CartScreen = ({ navigation }: CartScreenProps) => { 

    const [foodItem, setFoodItem] = useState<FoodItem[]>([
        {
            id: 1,
            name: 'Combo Gà Rán 1',
            price: 99000, 
            image: require('../assets/product_logo/combo1.jpg'),
            quality: 1
        },
        {
            id: 2,
            name: 'Combo Gà Rán 2',
            price: 120000, 
            image: require('../assets/product_logo/combo_2.jpg'),
            quality: 1
        },
        {
            id: 3,
            name: 'Combo Gà Rán 3',
            price: 150000, 
            image: require('../assets/product_logo/combo_3.jpg'),
            quality: 1
        },
        {
            id: 4,
            name: 'Combo Gà Rán 2',
            price: 120000, 
            image: require('../assets/product_logo/combo_2.jpg'),
            quality: 1
        },
    ]); 

    const handelPayment = () => {
        navigation.navigate('Payment', {
            foodItems: foodItem,
            totalPrice: gettotalPrice(foodItem)
        });
    };

    const gettotalPrice = (items: FoodItem[]) => {
        let totalprice = 0;
        items.forEach((item) => totalprice += (item.quality * item.price));
        return totalprice;
    };

    const [coupon, setCoupon] = useState("");

    const HandleNumberProducts = (id: number, typeHandle: number) => {
        setFoodItem((prevItem) => {
            const UpdatedItem = prevItem.map((item) => {
                if (item.id === id) {
                    if (typeHandle === 0) return { ...item, quality: item.quality + 1 };
                    else if (typeHandle === 1 && item.quality > 1) return { ...item, quality: item.quality - 1 };
                    else return item;  
                } else {
                    return item;
                }
            });
            return UpdatedItem;
        });
    };

    const HandleDeleteProduct = (id: number) => {
        setFoodItem((prevItem) => {
            const updateItem = prevItem.filter((item) => item.id !== id);
            return updateItem;
        });
    };
    
    const RenderItemProduct = ({ item }: RenderItemProps) => {
        return (
            <View style={style.cardProducts}>
                {/* Display Image, Name Of Product */}
                <View style={style.detailProducts}>
                    <Image resizeMode="contain" style={{width:120,height:120}} source={item.image}></Image>
                    <View style={{flex:1,gap:30}}>
                        <Text style={{fontWeight:'900',marginTop:10,fontSize:18}}>{item.name}</Text>
                        <View style={{flex:1,flexDirection:'row',gap:20}}>
                            <TouchableOpacity onPress={() => Alert.alert('Bạn Đã Nhấn Vào Nút Chỉnh Sửa')}>
                                <Text style={{fontSize:14,fontWeight:'bold',fontStyle:'normal',textDecorationLine:'underline'}}>Chỉnh sửa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => HandleDeleteProduct(item.id)}>
                                <Text style={{fontSize:14,fontWeight:'bold',fontStyle:'normal',textDecorationLine:'underline'}}>Xóa</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={{height:40,borderColor:'gray',flexDirection:'row',justifyContent:'space-between',alignItems:'center',borderTopWidth:1,paddingTop:10}}>
                    <View style={{flexDirection:'row',gap:10,alignItems:"center"}}>
                        <TouchableOpacity onPress={() => HandleNumberProducts(item.id,1)}>
                            <View style={{width:30,height:30,borderWidth:1,borderRadius:20,flex:1,justifyContent:"center",alignItems:"center"}}>
                                <Text style={{fontSize:20,fontWeight:'bold'}}>−</Text>
                            </View>
                        </TouchableOpacity>

                        <Text style={{fontSize:15}}>{item.quality}</Text>

                        <TouchableOpacity onPress={() => HandleNumberProducts(item.id,0)}>
                            <View style={{width:30,height:30,borderWidth:1,borderRadius:20,flex:1,justifyContent:"center",alignItems:"center"}}>
                                <Text style={{fontSize:20,fontWeight:'bold'}}>+</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <Text style={{fontSize:16}}>{(item.price*item.quality).toLocaleString('vi-VN')} VND</Text>
                </View>
            </View>
        );
    };  

    return (
        <ScrollView style={style.container}>
            <Image style={style.logoSize} source={require('../assets/product_logo/kfc-logo.jpg')}></Image>
            <Text style={style.fontTextCart}>GIỎ HÀNG CỦA TÔI</Text>

            {/* Display Image, Name Of Product */}
            <FlatList
                data={foodItem}
                renderItem={RenderItemProduct}
                keyExtractor={(item) => item.id.toString()}
                extraData={foodItem}
                scrollEnabled={false}
            />

            {/*Display Detail Peoduct Payment*/}
            <View style={style.paymentProducts}>
                <Text style={{fontWeight:'900',fontSize:30,marginTop:30}}>{foodItem.length} Món</Text>

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

                <View style={{flexDirection:"row",justifyContent:'space-between',borderColor:'gray',borderTopWidth:1,paddingTop:15}}>
                    <Text>Tổng Đơn Hàng</Text>
                    <Text>{gettotalPrice(foodItem).toLocaleString('vi-VN')}đ</Text>
                </View>

                <View style={{flexDirection:"row",justifyContent:'space-between',paddingTop:15}}>
                    <Text>Phí giao hàng</Text>
                    <Text>10000đ</Text>
                </View>

                <View style={{flexDirection:"row",justifyContent:'space-between',paddingTop:15,marginBottom:30}}>
                    <Text style={{fontSize:20,fontWeight:'900'}}>Tổng Thanh Toán</Text>
                    <Text style={{fontSize:20,fontWeight:'900'}}>{(gettotalPrice(foodItem)+ 10000).toLocaleString('vi-VN')}đ</Text>
                </View>

                <TouchableOpacity onPress={handelPayment} style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'red',borderRadius:10}}>
                    <Text style={{color:'white',fontWeight:'900',fontSize:20}}>Thanh Toán</Text>
                </TouchableOpacity>    
            </View>
        </ScrollView>
    );
};

const style = StyleSheet.create({
    container: {
        flex:1,
        padding:20,
    },
    logoSize: {
        width: 80,
        height:80,
        marginBottom:50
    },
    fontTextCart: {
        fontWeight:'900',
        fontSize:30,
        marginBottom:20
    },
    cardProducts: {
        padding:10,
        width:'auto',
        height:200,
        backgroundColor:'white',
        borderRadius:10,
        gap:10,
        elevation:8,
        marginBottom:20,
    },
    detailProducts: {
        flexDirection:'row',
        gap:15,
    },
    paymentProducts: {
        padding:15,
        width:'auto',
        height:400,
        backgroundColor:'white',
        borderRadius:10,
        gap:10,
        elevation:8,
        marginBottom:20,
    },
    containerpayment: {
        flexDirection: 'row',
        margin: 10,
    },
    input: {
        width:240,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    button: {
        height: 40,
        paddingHorizontal: 15,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginLeft: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default CartScreen;