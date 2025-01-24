import React, { createContext, useContext, useState, useEffect } from 'react';

import { getToken, deleteToken, saveToken } from '../utils/secureStore';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null);

    useEffect(() => {
        (async () => {
            const token = await getToken();
            setAuthToken(token);
        })();
    }, []);

    const login = (token) => {
        saveToken(token);
        setAuthToken(token);
    };

    const logout = () => {
        deleteToken();
        setAuthToken(null);
    };

    return (
        <AuthContext.Provider value={{ authToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};