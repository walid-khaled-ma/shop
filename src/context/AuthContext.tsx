import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../mockData';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isCashier: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('pos_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (username: string, _password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const foundUser = MOCK_USERS.find(u => u.username === username);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('pos_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pos_user');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager' || user?.role === 'admin';
  const isCashier = user?.role === 'cashier';

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      isAdmin,
      isManager,
      isCashier
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
