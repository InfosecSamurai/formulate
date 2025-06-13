// Authentication context for managing user state
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '@/lib/api-client';

// Types
interface User {
  id: string;
  email: string;
  fullName: string | null;
  isPremium: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, fullName: string) => Promise<boolean>;
  sendMagicLink: (email: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiClient.getCurrentUser();
        if (response.success && response.data?.user) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.login(email, password);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        apiClient.setToken(response.data.token);
        setLoading(false);
        return true;
      } else {
        setError(response.error?.message || 'Login failed');
        setLoading(false);
        return false;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
      return false;
    }
  };

  // Register function
  const register = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.register(email, password, fullName);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        apiClient.setToken(response.data.token);
        setLoading(false);
        return true;
      } else {
        setError(response.error?.message || 'Registration failed');
        setLoading(false);
        return false;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
      return false;
    }
  };

  // Send magic link function
  const sendMagicLink = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.sendMagicLink(email);
      
      if (response.success) {
        setLoading(false);
        return true;
      } else {
        setError(response.error?.message || 'Failed to send magic link');
        setLoading(false);
        return false;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    apiClient.clearToken();
    setUser(null);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        sendMagicLink,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
