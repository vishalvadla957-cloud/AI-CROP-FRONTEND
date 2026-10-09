import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUser, setAuthData, clearAuthData, authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser());
  const [token, setToken] = useState(getToken());
  const [toasts, setToasts] = useState([]);

  // Toast notification dispatcher
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const login = async (username, password) => {
    try {
      const data = await authApi.login({ username, password });
      const userData = {
        userId: data.userId,
        username: data.username,
        fullName: data.fullName,
        role: data.role,
        state: data.state,
        district: data.district
      };
      setAuthData(data.token, userData);
      setToken(data.token);
      setUser(userData);
      showToast(`Welcome back, ${data.fullName || data.username}!`, 'success');
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      return { success: false, error: err.message };
    }
  };

  const register = async (formData) => {
    try {
      const data = await authApi.register(formData);
      const userData = {
        userId: data.userId,
        username: data.username,
        fullName: data.fullName,
        role: data.role,
        state: data.state,
        district: data.district
      };
      setAuthData(data.token, userData);
      setToken(data.token);
      setUser(userData);
      showToast('Registration successful! Welcome to KrishiMitra.', 'success');
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    clearAuthData();
    setToken(null);
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        showToast,
        toasts
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
