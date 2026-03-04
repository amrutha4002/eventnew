import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                const parsed = JSON.parse(userInfo);
                try {
                    // Set token early for the interceptor
                    setUser(parsed);
                    // Fetch fresh profile data to see if admin approved organizer status
                    const { data } = await api.get('/auth/me');
                    const freshUser = { ...parsed, ...data };
                    setUser(freshUser);
                    localStorage.setItem('userInfo', JSON.stringify(freshUser));
                } catch (error) {
                    console.error('Failed to fetch fresh user profile', error);
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed',
            };
        }
    };

    const register = async (
        name,
        email,
        password,
        role,
        organizationName,
        registrationTaxId,
        website,
        contactEmail,
        contactPhone
    ) => {
        try {
            const payload = { name, email, password, role };
            if (role === 'organizer') {
                payload.organizationName = organizationName;
                payload.registrationTaxId = registrationTaxId;
                payload.website = website;
                payload.contactEmail = contactEmail;
                payload.contactPhone = contactPhone;
            }
            const { data } = await api.post('/auth/register', payload);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed',
            };
        }
    };

    // Allow a logged‑in user to request organizer verification later
    const requestOrganizerVerification = async (
        organizationName,
        registrationTaxId,
        website,
        contactEmail,
        contactPhone
    ) => {
        try {
            const { data } = await api.post('/auth/organizer-request', {
                organizationName,
                registrationTaxId,
                website,
                contactEmail,
                contactPhone,
            });
            // update stored user data
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message ||
                    'Request failed',
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, requestOrganizerVerification }}>
            {children}
        </AuthContext.Provider>
    );
};
