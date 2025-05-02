'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkUserSession = async () => {
      try {
        // For now, check localStorage. Later, we'll use Cognito
        const storedUser = localStorage.getItem('weatherDashboardUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  // Mock auth functions until we connect to Cognito
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mocked login - will replace with actual Cognito auth
      const mockUser = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        email
      };
      
      localStorage.setItem('weatherDashboardUser', JSON.stringify(mockUser));
      setUser(mockUser);

    } catch (err: any) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mocked registration - will replace with actual Cognito auth
      const mockUser = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        email,
        name
      };
      
      localStorage.setItem('weatherDashboardUser', JSON.stringify(mockUser));
      setUser(mockUser);
      
    } catch (err: any) {
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // Mocked logout - will replace with actual Cognito auth
      localStorage.removeItem('weatherDashboardUser');
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Failed to logout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock password reset - will implement actual reset later
      console.log(`Password reset requested for ${email}`);
      
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 