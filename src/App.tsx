import React, { FC } from "react";
import RootNavigator from "./navigation/RootNavigator";
import { clearAuthData } from './clearAuth';

import { useEffect } from 'react';

const App: React.FC = () => {
    useEffect(() => {
        clearAuthData();
    }, []);
    return (
        <RootNavigator />
    );

}

export default App