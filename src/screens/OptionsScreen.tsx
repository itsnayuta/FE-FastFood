import React, { useState } from "react";
import { View, Text, StyleSheet,Image,TouchableOpacity } from "react-native";
import * as Animatable from 'react-native-animatable';
const OptionsScreen = () => {



    const [menuFood,setismenufoodclicked] = useState(false);
    const [contactaboutus, setiscontactaboutusclicked] = useState(false)



    return (

        <>
        
        
        <View style={styles.container}>
            <View style={{flex:0,gap:5,marginBottom:60}}>
                <Text style={{fontSize:40,fontWeight:900}}>BẮT ĐẦU</Text>
                <TouchableOpacity>
                    <Text style={{fontWeight:700}}>Đăng Nhập / Đăng Ký →</Text>
                </TouchableOpacity>
            </View>

            <View style ={{flex:0,paddingBottom:20,borderBottomWidth:0.5,borderColor:'gray',marginBottom:30}}>

                <View style={{flexDirection:"row", justifyContent:'space-between',alignItems:"center"}}>
                    <Text style={{fontSize:18,fontWeight:900}}>Danh Mục Món Ăn</Text>
                    <TouchableOpacity onPress={() => setismenufoodclicked(!menuFood)}>
                        <Image style={{width:20,height:20,transform : menuFood ? [{rotate:'180deg'}]:[]}} source={require('../assets/icons/down-arrow.png')}></Image>
                    </TouchableOpacity>
                </View>


                {menuFood && (

                    
                        <View style={{flex:0,marginTop:10,gap:10}}>
                            <TouchableOpacity>
                                <Text>Ưu Đãi</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text>Món Mới</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text>Combo 1 người</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text>Combo nhóm</Text>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <Text>Gà Rán - Gà Quay</Text>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <Text>Thức Ăn Nhẹ</Text>
                            </TouchableOpacity>

                        </View>
                
                )}

                
            </View>



            <View style ={{flex:0,paddingBottom:20,borderBottomWidth:0.5,borderColor:'gray'}}>

                <View style={{flexDirection:"row", justifyContent:'space-between',alignItems:"center"}}>
                    <Text style={{fontSize:18,fontWeight:900}}>Đơn Hàng</Text>
                    <TouchableOpacity onPress={() => setiscontactaboutusclicked(!contactaboutus)}>
                        <Image style={{width:20,height:20,transform : contactaboutus ? [{rotate:'180deg'}]:[]}} source={require('../assets/icons/down-arrow.png')}></Image>
                    </TouchableOpacity>
                </View>


                {contactaboutus && (

                    
                        <View style={{flex:0,marginTop:10,gap:10}}>
                            
                            <TouchableOpacity>
                                <Text>Lịch Sử Đặt Hàng</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text>Theo Dõi Đơn Hàng</Text>
                            </TouchableOpacity>

                        </View>
                
                )}

                
            </View>


            

        </View>

        <View style={{ flex:1,justifyContent:'center',alignItems:"center",backgroundColor: 'black', padding: 10,gap:30 }}>
                <Text style={{ color: "white", fontSize: 20, fontWeight: '700' ,marginTop:50}}>KẾT NỐI VỚI CHÚNG TÔI QUA</Text>

                <View style={{flex:0,flexDirection:"row",gap:20}}>

                    <TouchableOpacity style={{flex:0,justifyContent:'center',alignItems:"center",width:40,height:40,padding:5,borderWidth:1,borderColor:'white',borderRadius:50}}>
                        <Image style={{tintColor:'white',width:25,height:25}} source={require('../assets/icons/facebook.png')}></Image>
                    </TouchableOpacity>

                    <TouchableOpacity style={{flex:0,justifyContent:'center',alignItems:"center",width:40,height:40,padding:5,borderWidth:1,borderColor:'white',borderRadius:50}}>
                        <Image style={{tintColor:'white',width:25,height:25}} source={require('../assets/icons/instagram.png')}></Image>
                    </TouchableOpacity>


                    <TouchableOpacity style={{flex:0,justifyContent:'center',alignItems:"center",width:40,height:40,padding:5,borderWidth:1,borderColor:'white',borderRadius:50}}>
                        <Image style={{tintColor:'white',width:25,height:25}} source={require('../assets/icons/twitter.png')}></Image>
                    </TouchableOpacity>


                    

                  

                </View>
        </View>


        </>
    );
};

const styles = StyleSheet.create({
    container: {

        backgroundColor:'white',
        flex: 0,
        gap:20,
        padding:20,
    },
});

export default OptionsScreen;