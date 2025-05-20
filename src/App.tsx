import React, { FC } from "react";
import MainNavigator from "./navigation/MainNavigator";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigation/RootNavigator";



const App: React.FC = () => {

    return (
        <RootNavigator />
    );

}

export default App