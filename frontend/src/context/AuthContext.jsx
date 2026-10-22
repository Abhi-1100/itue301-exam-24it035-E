// src/context/AuthContext.jsx - Global authentication state management
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the AuthContext
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // WHY: Initialize state from localStorage so authentication persists across page refreshes
  const [token, setToken] = useState(() => localStorage.getItem('driveeasy_token') || null);
  const [customer, setCustomer] = useState(() => {
    const savedCustomer = localStorage.getItem('driveeasy_customer');
    return savedCustomer ? JSON.parse(savedCustomer) : null;
  });

  // WHY: Synchronize authentication state to browser localStorage whenever credentials change
  const login = (data) => {
    // data contains { token, customer }
    setToken(data.token);
    setCustomer(data.customer);
    localStorage.setItem('driveeasy_token', data.token);
    localStorage.setItem('driveeasy_customer', JSON.stringify(data.customer));
  };

  const logout = () => {
    // WHY: Clear state and remove stored credentials on explicit logout
    setToken(null);
    setCustomer(null);
    localStorage.removeItem('driveeasy_token');
    localStorage.removeItem('driveeasy_customer');
  };

  const value = {
    token,
    customer,
    isAuthenticated: !!token,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// WHY: Custom hook to safely consume AuthContext with clean syntax: const { token, customer } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
