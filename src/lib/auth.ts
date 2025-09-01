import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

// Client-side auth utilities
export const auth = {
  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    return await response.json();
  },

  // Sign out
  signOut: async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    });

    if (response.ok) {
      // Clear local storage
      localStorage.removeItem('supabase_auth_token');
      localStorage.removeItem('supabase_refresh_token');
      localStorage.removeItem('admin_user');
    }

    return await response.json();
  },

  // Get current auth status
  getStatus: async () => {
    const token = localStorage.getItem('supabase_auth_token');
    
    if (!token) {
      return { isAuthenticated: false, isAdmin: false };
    }

    const response = await fetch('/api/auth/status', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await response.json();
  },

  // Save auth session to localStorage
  saveSession: (session: AuthSession) => {
    localStorage.setItem('supabase_auth_token', session.access_token);
    localStorage.setItem('supabase_refresh_token', session.refresh_token);
    localStorage.setItem('admin_user', JSON.stringify(session.user));
  },

  // Get saved session from localStorage
  getSavedSession: (): AuthSession | null => {
    const token = localStorage.getItem('supabase_auth_token');
    const refreshToken = localStorage.getItem('supabase_refresh_token');
    const userStr = localStorage.getItem('admin_user');

    if (!token || !refreshToken || !userStr) {
      return null;
    }

    try {
      const user = JSON.parse(userStr);
      return {
        access_token: token,
        refresh_token: refreshToken,
        user,
      };
    } catch {
      return null;
    }
  },

  // Clear saved session
  clearSession: () => {
    localStorage.removeItem('supabase_auth_token');
    localStorage.removeItem('supabase_refresh_token');
    localStorage.removeItem('admin_user');
  },
};

// Authenticated fetch utility for admin API calls
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('supabase_auth_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

// Hook for React components
export const useAuth = () => {
  const checkAuth = async () => {
    try {
      const status = await auth.getStatus();
      return status;
    } catch (error) {
      console.error('Auth check failed:', error);
      return { isAuthenticated: false, isAdmin: false };
    }
  };

  return {
    signIn: auth.signIn,
    signOut: auth.signOut,
    checkAuth,
    getSavedSession: auth.getSavedSession,
    saveSession: auth.saveSession,
    clearSession: auth.clearSession,
  };
};
