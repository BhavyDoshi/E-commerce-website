"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginUser, registerUser } from '@/lib/api';

const AuthContext = createContext(null);
const STORAGE_KEY = 'ecommerce-session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      setToken(parsed.token);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (user && token) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [ready, token, user]);

  async function login(values) {
    const result = await loginUser(values);
    setUser(result.user);
    setToken(result.token);
    return result;
  }

  async function register(values) {
    const result = await registerUser(values);
    setUser(result.user);
    setToken(result.token);
    return result;
  }

  function logout() {
    setUser(null);
    setToken('');
  }

  const value = useMemo(() => ({
    user,
    token,
    ready,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin',
    isAuthenticated: Boolean(user && token),
  }), [ready, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
