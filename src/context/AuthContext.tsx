'use client';

import React, { createContext, useContext, useState } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalAction: 'signin' | 'signup';
  openAuthModal: (callback?: () => void, initialAction?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  quickDemoLogin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: 'usr_demo_vip_2026',
  name: 'Muhammad Usman',
  email: 'usman.customer@beshopable.com',
  phone: '0300 1129959',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  memberSince: '2026',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('beshopable_user');
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalAction, setAuthModalAction] = useState<'signin' | 'signup'>('signin');
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  const openAuthModal = (callback?: () => void, initialAction: 'signin' | 'signup' = 'signin') => {
    if (callback) {
      setPendingCallback(() => callback);
    } else {
      setPendingCallback(null);
    }
    setAuthModalAction(initialAction);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingCallback(null);
  };

  const executePending = () => {
    if (pendingCallback) {
      // Execute queued action (e.g. addToCart)
      setTimeout(() => {
        try {
          pendingCallback();
        } catch (err) {
          console.error('Error executing auth action callback:', err);
        }
        setPendingCallback(null);
      }, 100);
    }
  };

  const login = async (email: string): Promise<boolean> => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0] || 'Customer',
      email,
      phone: '0300 1129959',
      memberSince: '2026',
    };
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('beshopable_user', JSON.stringify(newUser));
    }
    setIsAuthModalOpen(false);
    executePending();
    return true;
  };

  const register = async (name: string, email: string, _password: string, phone?: string): Promise<boolean> => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name.trim() || 'Valued Customer',
      email,
      phone: phone || '0300 1129959',
      memberSince: '2026',
    };
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('beshopable_user', JSON.stringify(newUser));
    }
    setIsAuthModalOpen(false);
    executePending();
    return true;
  };

  const quickDemoLogin = () => {
    setUser(DEMO_USER);
    if (typeof window !== 'undefined') {
      localStorage.setItem('beshopable_user', JSON.stringify(DEMO_USER));
    }
    setIsAuthModalOpen(false);
    executePending();
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('beshopable_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authModalAction,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        quickDemoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
