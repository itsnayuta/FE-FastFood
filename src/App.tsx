import React, { FC } from "react";
import MainNavigator from "./navigation/MainNavigator";
import { NavigationContainer } from "@react-navigation/native";



const App: React.FC = () => {

    return (
        <NavigationContainer>
            <MainNavigator />
        </NavigationContainer>
        
    );

}

export default App