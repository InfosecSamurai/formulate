// Subscription context for managing premium subscriptions
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import { useAuth } from './auth-context';

// Types
interface Subscription {
  id: string;
  planType: string;
  status: string;
  currentPeriodEnd: string | null;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;
  createCheckout: (planType: 'monthly' | 'yearly') => Promise<string | null>;
  getCurrentSubscription: () => Promise<void>;
  clearError: () => void;
}

// Create context
const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Provider component
export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Load subscription on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getCurrentSubscription();
    }
  }, [isAuthenticated]);

  // Create checkout session
  const createCheckout = async (planType: 'monthly' | 'yearly') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.createCheckoutSession(planType);
      
      if (response.success && response.data?.checkoutUrl) {
        setLoading(false);
        return response.data.checkoutUrl;
      } else {
        setError(response.error?.message || 'Failed to create checkout session');
        setLoading(false);
        return null;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
      return null;
    }
  };

  // Get current subscription
  const getCurrentSubscription = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getCurrentSubscription();
      
      if (response.success) {
        setSubscription(response.data?.subscription || null);
        setLoading(false);
      } else {
        setError(response.error?.message || 'Failed to fetch subscription');
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        loading,
        error,
        createCheckout,
        getCurrentSubscription,
        clearError,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

// Custom hook to use subscription context
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
