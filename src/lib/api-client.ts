// API client for making requests to the backend
import { env } from '@/config/env';

// Types
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: RequestMethod;
  headers?: Record<string, string>;
  body?: any;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    errors?: Array<{ path: string; message: string }>;
  };
}

// API client class
class ApiClient {
  private token: string | null = null;
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api';
    // Try to get token from localStorage if in browser environment
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Make API request
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      method: options.method || 'GET',
      headers,
      credentials: 'same-origin',
    };

    // Add body for non-GET requests
    if (options.body && options.method !== 'GET') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      return data as ApiResponse<T>;
    } catch (error) {
      console.error('API request error:', error);
      return {
        success: false,
        error: {
          message: 'Network error',
          code: 'NETWORK_ERROR',
        },
      };
    }
  }

  // Auth endpoints
  async register(email: string, password: string, fullName: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: { email, password, fullName },
    });
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  async sendMagicLink(email: string) {
    return this.request('/auth/magic-link', {
      method: 'POST',
      body: { email },
    });
  }

  async verifyMagicLink(token: string) {
    return this.request(`/auth/verify?token=${token}`);
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Letter endpoints
  async createLetter(letterData: {
    letterType: string;
    senderName: string;
    recipientName: string;
    date: string;
    situationDetails: string;
    includeAddress?: boolean;
  }) {
    return this.request('/letters', {
      method: 'POST',
      body: letterData,
    });
  }

  async getLetters(page = 1, limit = 10) {
    return this.request(`/letters?page=${page}&limit=${limit}`);
  }

  async getLetter(id: string) {
    return this.request(`/letters/${id}`);
  }

  async updateLetter(id: string, letterData: {
    letterType: string;
    senderName: string;
    recipientName: string;
    date: string;
    situationDetails: string;
    includeAddress?: boolean;
  }) {
    return this.request(`/letters/${id}`, {
      method: 'PUT',
      body: letterData,
    });
  }

  async deleteLetter(id: string) {
    return this.request(`/letters/${id}`, {
      method: 'DELETE',
    });
  }

  // Get PDF download URL
  getPdfDownloadUrl(id: string) {
    return `${this.baseUrl}/letters/${id}/pdf`;
  }

  // Template endpoints
  async getTemplates() {
    return this.request('/templates');
  }

  async getTemplate(id: string) {
    return this.request(`/templates/${id}`);
  }

  // Subscription endpoints
  async createCheckoutSession(planType: 'monthly' | 'yearly') {
    return this.request('/subscriptions/create-checkout', {
      method: 'POST',
      body: { planType },
    });
  }

  async getCurrentSubscription() {
    return this.request('/subscriptions/current');
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
