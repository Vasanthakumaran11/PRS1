import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [customer, setCustomer] = useState(JSON.parse(localStorage.getItem('customer')) || null);

    const login = (userData) => {
        setToken(userData.token);
        setCustomer(userData.customer);
        localStorage.setItem('token', userData.token);
        localStorage.setItem('customer', JSON.stringify(userData.customer));
    };

    const logout = () => {
        setToken(null);
        setCustomer(null);
        localStorage.removeItem('token');
        localStorage.removeItem('customer');
    };

    return (
        <AuthContext.Provider value={{ token, customer, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
