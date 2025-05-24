
import React, { FC } from "react";
import RootNavigator from "./navigation/RootNavigator";
import { useEffect } from 'react';

const App: React.FC = () => {
    useEffect(() => {
        // clearAuthData(); // Removed because './clearAuth' does not exist
    }, []);
    return (
        <RootNavigator />
    );

}

export default App