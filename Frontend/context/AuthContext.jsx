"use client";
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '@/lib/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setError(null);
      const { data } = await api.get('/api/v1/user/profile');
      if (data?.success) setUser(data.user);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const login = async (payload) => {
    setError(null);
    const { data } = await api.post('/api/v1/user/login', payload);
    await fetchProfile();
    return data;
  };

  const register = async (payload) => {
    setError(null);
    const { data } = await api.post('/api/v1/user/register', payload);
    return data;
  };

  const logout = async () => {
    await api.get('/api/v1/user/logout');
    setUser(null);
  };

  const value = { user, loading, error, login, register, logout, fetchProfile };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
