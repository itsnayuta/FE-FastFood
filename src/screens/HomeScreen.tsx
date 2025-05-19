import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native"; // Thêm CommonActions

const { width } = Dimensions.get("window");

const bannerImages = [
  'https://static.kfcvietnam.com.vn/images/content/home/carousel/lg/Zestival.webp?v=3JN7k3',
  'https://static.kfcvietnam.com.vn/images/content/home/carousel/lg/Party.webp?v=3JN7k3',
  'https://static.kfcvietnam.com.vn/images/content/home/carousel/lg/GWP.webp?v=3JN7k3',
];

const menuItems = [
  {
    id: "3",
    title: "",
    subtitle: "Combo 1 Người",
    image: 'https://static.kfcvietnam.com.vn/images/items/lg/D-CHICKEN-1.jpg?v=3JN7k3',
    tabName: "Combo 1 người",
  },
  {
    id: "4",
    title: "",
    subtitle: "Combo Nhóm",
    image: 'https://static.kfcvietnam.com.vn/images/items/lg/DBUCKET1.jpg?v=3JN7k3',
    tabName: "Combo nhóm",
  },
  {
    id: "5",
    title: "",
    subtitle: "Gà Rán - Gà Quay",
    image: 'https://static.kfcvietnam.com.vn/images/items/lg/2-GA-XOT.jpg?v=3JN7k3',
    tabName: "Gà rán - Gà quay",
  },
  {
    id: "6",
    title: "",
    subtitle: "Burger - Cơm - Mì Ý",
    image: 'https://static.kfcvietnam.com.vn/images/items/lg/Burger-Zinger.jpg?v=3JN7k3',
    tabName: "Burger - Cơm - Mì ý",
  },
  {
    id: "7",
    title: "",
    subtitle: "Thức Ăn Nhẹ",
    image: 'https://static.kfcvietnam.com.vn/images/category/lg/MON%20AN%20NHE.jpg?v=3JN7k3',
    tabName: "Thức ăn nhẹ",
  },
  {
    id: "8",
    title: "",
    subtitle: "Thức Uống Và Tráng Miệng",
    image: 'https://static.kfcvietnam.com.vn/images/category/lg/TRANG%20MIENG.jpg?v=3JN7k3',
    tabName: "Thức uống và tráng miệng",
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();

  const renderBanner = ({ item }: any) => (
    <Image source={{ uri: item }} style={styles.bannerImage} />
  );

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: "Menu",
                state: {
                  routes: [
                    {
                      name: "MenuMain",
                      params: { initialTab: item.tabName },
                    },
                  ],
                },
              },
            ],
          })
        );
      }}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={bannerImages}
        renderItem={renderBanner}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.bannerContainer}
      />

      <Text style={styles.header}>DANH MỤC MÓN ĂN</Text>

      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.menu}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  bannerContainer: { maxHeight: 200 },
  bannerImage: {
    width: width,
    height: 200,
    resizeMode: "cover",
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  menu: {
    padding: 8,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 120,
  },
  subtitle: {
    textAlign: "center",
    padding: 8,
    fontWeight: "600",
  },
});