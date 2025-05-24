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
import { getCategories, getCombos } from "../../services/api";
import { Category, Combo } from "../../types";

type ManageMenuStackParamList = {
    ManageMenu: undefined;
    ManageProductMain: { categoryId: number };
    ManageComboScreen: { type: string };
};

const { width } = Dimensions.get("window");

type ManageMenuScreenNavigationProp = StackNavigationProp<
    ManageMenuStackParamList,
    "ManageMenu"
>;

type ComboTab = {
    name: string;
    data: Combo[];
    type: "combo";
    imageUrl: string;
};

export default function ManageMenuScreen() {
    const navigation = useNavigation<ManageMenuScreenNavigationProp>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [comboTypes, setComboTypes] = useState<ComboTab[]>([]);
    const [selectedType, setSelectedType] = useState<string>("");

    useEffect(() => {
        async function fetchData() {
            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData);

                const combosData: Combo[] = await getCombos();
                const comboTabs = Object.values(
                    combosData.reduce((groups: Record<string, any>, combo: any) => {
                        if (!groups[combo.type]) {
                            groups[combo.type] = {
                                name: combo.type,
                                data: [],
                                type: 'combo',
                                imageUrl: combo.imageUrl,
                            };
                        }
                        groups[combo.type].data.push(combo);
                        return groups;
                    }, {})
                );

                setComboTypes(comboTabs);
                if (comboTabs.length > 0) {
                    setSelectedType(comboTabs[0].name);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }

        fetchData();
    }, []);

    const renderCategoryItem = ({ item }: { item: Category }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("ManageProductMain", { categoryId: item.id })}
        >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={styles.subtitle}>{item.name}</Text>
            <Text style={styles.tag}>Danh mục</Text>
        </TouchableOpacity>
    );

    const renderComboTabs = () => (
        <FlatList
            data={comboTypes}
            horizontal
            keyExtractor={(item) => item.name}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8 }}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={[
                        styles.card,
                        { width: 140, marginHorizontal: 8 },
                        selectedType === item.name && styles.selectedCard,
                    ]}
                    onPress={() => {
                        setSelectedType(item.name);
                        navigation.navigate("ManageComboScreen", { type: item.name });
                    }}
                >
                    <Image source={{ uri: item.imageUrl }} style={[styles.image, { height: 100 }]} />
                    <Text style={styles.subtitle}>{item.name}</Text>
                    <Text style={styles.tag}>Combo</Text>
                </TouchableOpacity>
            )}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>QUẢN LÝ MENU</Text>

            <FlatList
                ListHeaderComponent={<Text style={styles.sectionTitle}>Danh mục</Text>}
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.menu}
                ListFooterComponent={
                    <>
                        <Text style={styles.sectionTitle}>Combo</Text>
                        {renderComboTabs()}
                    </>
                }
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 8,
    },
    menu: {
        paddingHorizontal: 8,
        paddingBottom: 16,
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
        maxWidth: (width - 48) / 2, // để 2 cột vừa đủ khoảng cách
        alignItems: "center",
    },
    selectedCard: {
        borderColor: "#007bff",
        borderWidth: 2,
    },
    image: {
        width: "100%",
        height: 120,
        resizeMode: "cover",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
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
    tabRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
});
