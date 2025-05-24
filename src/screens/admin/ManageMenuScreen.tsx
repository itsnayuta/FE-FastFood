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
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { getCategories } from "../../services/api";

type Category = {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
};

type ManageMenuStackParamList = {
    ManageMenu: undefined;
    ManageProductMain: { categoryId: number };
};

const { width } = Dimensions.get("window");

type ManageMenuScreenNavigationProp = StackNavigationProp<ManageMenuStackParamList>;

export default function ManageMenuScreen() {
    const navigation = useNavigation<ManageMenuScreenNavigationProp>();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getCategories();
            setCategories(data);
        };
        fetchCategories();
    }, []);

    console.log("Categories:", categories);
    const renderItem = ({ item }: { item: Category }) => {
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("ManageProductMain", { categoryId: item.id })}
            >
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                <Text style={styles.subtitle}>{item.name}</Text>
                <Text style={styles.tag}>Danh mục</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>QUẢN LÝ MENU</Text>
            <FlatList
                data={categories}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.menu}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        fontSize: 18,
        fontWeight: "bold",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#f5f5f5",
    },
    menu: {
        padding: 8,
    },
    card: {
        flex: 1,
        margin: 8,
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        overflow: "hidden",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
    },
    image: {
        width: "100%",
        height: 120,
        resizeMode: "cover",
    },
    subtitle: {
        textAlign: "center",
        paddingVertical: 6,
        fontSize: 16,
        fontWeight: "600",
    },
    tag: {
        textAlign: "center",
        color: "#666",
        fontSize: 13,
        paddingBottom: 8,
    },
});
