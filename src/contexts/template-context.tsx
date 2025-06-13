// Template context for managing letter templates
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import apiClient from '@/lib/api-client';

// Types
interface Template {
  id: string;
  name: string;
  templateText: string;
  isPremium: boolean;
  category: string | null;
}

interface TemplateListItem {
  id: string;
  name: string;
  isPremium: boolean;
  category: string | null;
}

interface TemplateContextType {
  templates: TemplateListItem[];
  currentTemplate: Template | null;
  loading: boolean;
  error: string | null;
  getTemplates: () => Promise<void>;
  getTemplate: (id: string) => Promise<Template | null>;
  clearError: () => void;
}

// Create context
const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

// Provider component
export const TemplateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [templates, setTemplates] = useState<TemplateListItem[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load templates on mount
  useEffect(() => {
    getTemplates();
  }, []);

  // Get templates
  const getTemplates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getTemplates();
      
      if (response.success && response.data?.templates) {
        setTemplates(response.data.templates);
        setLoading(false);
      } else {
        setError(response.error?.message || 'Failed to fetch templates');
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  // Get template
  const getTemplate = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getTemplate(id);
      
      if (response.success && response.data?.template) {
        setCurrentTemplate(response.data.template);
        setLoading(false);
        return response.data.template;
      } else {
        setError(response.error?.message || 'Failed to fetch template');
        setLoading(false);
        return null;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
      return null;
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <TemplateContext.Provider
      value={{
        templates,
        currentTemplate,
        loading,
        error,
        getTemplates,
        getTemplate,
        clearError,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

// Custom hook to use template context
export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
};
