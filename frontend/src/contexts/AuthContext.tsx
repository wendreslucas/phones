import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  selectedLojaId: string | null;
  setSelectedLojaId: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLojaId, setSelectedLojaId] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData as User);
          if (userData.lojas.length > 0) {
            setSelectedLojaId(userData.lojas[0].id);
          }
        } catch (error) {
          localStorage.removeItem('auth_token');
        }
      }
      setIsLoading(false);
    };
    
    // For demo purposes, auto-login
    const autoLogin = async () => {
      try {
        const userData = await authApi.getCurrentUser();
        setUser(userData as User);
        if (userData.lojas.length > 0) {
          setSelectedLojaId(userData.lojas[0].id);
        }
      } catch (error) {
        console.error('Auto-login failed:', error);
      }
      setIsLoading(false);
    };
    
    autoLogin();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(email, password);
      localStorage.setItem('auth_token', response.token);
      setUser(response.user as User);
      if (response.user.lojas.length > 0) {
        setSelectedLojaId(response.user.lojas[0].id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setSelectedLojaId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        selectedLojaId,
        setSelectedLojaId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
