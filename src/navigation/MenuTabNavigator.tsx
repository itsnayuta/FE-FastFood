import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getCategories, getCombos } from '../services/api';
import ComboList from '../components/ComboList';
import CategoryList from '../components/CategoryList';

const Tab = createMaterialTopTabNavigator();

const MenuTabNavigator = () => {
    const [tabs, setTabs] = useState<{ id: number; name: string; type: "combo" | "category" }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const combos = await getCombos();
                const categories = await getCategories();

                const comboTabs = combos.map((combo: any) => ({
                    id: combo.id,
                    name: combo.type,  // Lưu tên của combo
                    type: "combo"
                }));

                const categoryTabs = categories.map((category: any) => ({
                    id: category.id,
                    name: category.name, // Lưu tên của category
                    type: "category"
                }));

                setTabs([...comboTabs, ...categoryTabs]);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#e4002b" />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (tabs.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text>No menu available</Text>
            </View>
        );
    }

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: styles.tabBarStyle,
                tabBarIndicatorStyle: styles.tabBarIndicatorStyle,
                tabBarLabelStyle: styles.tabBarLabelStyle,
                tabBarActiveTintColor: "#e4002b",
                tabBarInactiveTintColor: "#000",
                tabBarPressColor: "transparent",
                tabBarScrollEnabled: true,
                tabBarItemStyle: { width: 'auto' }
            }}
        >
            {tabs.map((tab) => (
                <Tab.Screen
                    key={tab.id}
                    name={tab.name}
                    component={tab.type === "combo" ? ComboList : CategoryList}
                    initialParams={{ id: tab.id, type: tab.type, name: tab.name }}
                />
            ))}
        </Tab.Navigator>
    );
};

export default MenuTabNavigator;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBarStyle: {
        backgroundColor: '#fff',
    },
    tabBarIndicatorStyle: {
        backgroundColor: '#e4002b',
        height: 3,
    },
    tabBarLabelStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'none',
        alignSelf: 'center',
        flexWrap: 'nowrap',
    },
});
