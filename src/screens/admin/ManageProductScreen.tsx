import React, { useEffect, useState } from "react";
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
import { MenuTab, getMenuTabs } from "../../services/getMenuTabs";

const { width } = Dimensions.get("window");

export default function ManageProductsScreen() {
    const [categories, setCategories] = useState<MenuTab[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const tabs = await getMenuTabs();
            const filtered = tabs.filter(
                (tab) => !tab.name.toLowerCase().includes("combo")
            );
            setCategories(filtered);
        };
        fetchCategories();
    }, []);

    const renderItem = ({ item }: any) => (
        <TouchableOpacity style={styles.card} onPress={() => { }}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={styles.subtitle}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>QUẢN LÝ DANH MỤC MÓN ĂN</Text>
            <FlatList
                data={categories}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
                numColumns={2}
                contentContainerStyle={styles.menu}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
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
