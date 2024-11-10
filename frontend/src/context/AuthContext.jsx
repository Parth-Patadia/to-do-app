import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const user = localStorage.getItem('user');
        if (user) {
            setUser(JSON.parse(user));
        }
        setLoading(false);
    }, []);

    const register = async (userData) => {
        try {
            const response = await api.post('/users/register', userData);
            // Don't automatically log in after registration
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const login = async (userData) => {
        try {
            const response = await api.post('/users/login', userData);
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                localStorage.setItem('token', response.data.token);
                setUser(response.data);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            register,
            login,
            logout
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);