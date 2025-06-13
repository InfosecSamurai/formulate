// Letter context for managing letter state
import React, { createContext, useContext, useState, ReactNode } from 'react';
import apiClient from '@/lib/api-client';

// Types
interface Letter {
  id: string;
  letterType: string;
  senderName: string;
  recipientName: string;
  date: string;
  situationDetails: string;
  includeAddress: boolean;
  content: string;
  createdAt: string;
  pdfPath?: string;
}

interface LetterListItem {
  id: string;
  letterType: string;
  senderName: string;
  recipientName: string;
  date: string;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface LetterContextType {
  letters: LetterListItem[];
  currentLetter: Letter | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  createLetter: (letterData: Omit<Letter, 'id' | 'content' | 'createdAt'>) => Promise<Letter | null>;
  getLetters: (page?: number, limit?: number) => Promise<void>;
  getLetter: (id: string) => Promise<Letter | null>;
  updateLetter: (id: string, letterData: Omit<Letter, 'id' | 'content' | 'createdAt'>) => Promise<Letter | null>;
  deleteLetter: (id: string) => Promise<boolean>;
  getPdfUrl: (id: string) => string;
  clearError: () => void;
}

// Create context
const LetterContext = createContext<LetterContextType | undefined>(undefined);

// Provider component
export const LetterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [letters, setLetters] = useState<LetterListItem[]>([]);
  const [currentLetter, setCurrentLetter] = useState<Letter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  // Create letter
  const createLetter = async (letterData: Omit<Letter, 'id' | 'content' | 'createdAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.createLetter(letterData);
      
      if (response.success && response.data?.letter) {
        setCurrentLetter(response.data.letter);
        setLoading(false);
        return response.data.letter;
      } else {
        setError(response.error?.message || 'Failed to create letter');
        setLoading(false);
        return null;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
      return null;
    }
  };

  // Get letters
  const getLetters = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getLetters(page, limit);
      
      if (response.success && response.data) {
        setLetters(response.data.letters);
        setPagination(response.data.pagination);
        setLoading(false);
      } else {
        setError(response.error?.message || 'Failed to fetch letters');
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  // Get letter
  const getLetter = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getLetter(id);
      
      if (response.success && response.data?.letter) {
        setCurrentLetter(response.data.letter);
        setLoading(false);
        return response.data.letter;
      } else {
        setError(response.error?.message || 'Failed to fetch letter');
        setLoading(false);
        return null;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
      return null;
    }
  };

  // Update letter
  const updateLetter = async (id: string, letterData: Omit<Letter, 'id' | 'content' | 'createdAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.updateLetter(id, letterData);
      
      if (response.success && response.data?.letter) {
        setCurrentLetter(response.data.letter);
        setLoading(false);
        return response.data.letter;
      } else {
        setError(response.error?.message || 'Failed to update letter');
        setLoading(false);
        return null;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
      return null;
    }
  };

  // Delete letter
  const deleteLetter = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.deleteLetter(id);
      
      if (response.success) {
        // Remove from letters list if present
        setLetters(letters.filter(letter => letter.id !== id));
        if (currentLetter?.id === id) {
          setCurrentLetter(null);
        }
        setLoading(false);
        return true;
      } else {
        setError(response.error?.message || 'Failed to delete letter');
        setLoading(false);
        return false;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
      return false;
    }
  };

  // Get PDF URL
  const getPdfUrl = (id: string) => {
    return apiClient.getPdfDownloadUrl(id);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <LetterContext.Provider
      value={{
        letters,
        currentLetter,
        loading,
        error,
        pagination,
        createLetter,
        getLetters,
        getLetter,
        updateLetter,
        deleteLetter,
        getPdfUrl,
        clearError,
      }}
    >
      {children}
    </LetterContext.Provider>
  );
};

// Custom hook to use letter context
export const useLetter = () => {
  const context = useContext(LetterContext);
  if (context === undefined) {
    throw new Error('useLetter must be used within a LetterProvider');
  }
  return context;
};
