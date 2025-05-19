import React from "react";
import { View, StyleSheet } from "react-native";
import MenuTabNavigator from "../navigation/MenuTabNavigator";

const MenuScreen = ({ route }: any) => {
  const initialTab = route.params?.initialTab || null;

  return (
    <View style={styles.container}>
      <MenuTabNavigator initialTab={initialTab} />
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});