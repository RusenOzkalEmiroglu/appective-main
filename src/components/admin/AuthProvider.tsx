'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { signIn: authSignIn, signOut: authSignOut, checkAuth, getSavedSession, saveSession, clearSession } = useAuth();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for saved session first
        const savedSession = getSavedSession();
        if (savedSession) {
          setIsAuthenticated(true);
          setIsAdmin(true);
          setUser(savedSession.user);
          setLoading(false);
          return;
        }

        // Check authentication status
        const status = await checkAuth();
        setIsAuthenticated(status.isAuthenticated);
        setIsAdmin(status.isAdmin);
        setUser(status.user || null);
        
        if (!status.isAuthenticated) {
          clearSession();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUser(null);
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authSignIn(email, password);
      
      if (result.success) {
        saveSession(result.session);
        setIsAuthenticated(true);
        setIsAdmin(true);
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authSignOut();
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUser(null);
      clearSession();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    isAdmin,
    user,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
