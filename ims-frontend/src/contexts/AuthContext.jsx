import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/profile');
      setUser(res.data.user);
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    const res = await api.post('/auth/login', data);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const changePassword = async (data) => {
    return await api.post('/auth/change-password', data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
