'use client';

import React, { createContext, useContext, useState } from 'react';
import { User } from '@/types';

export type UserRole = 'customer' | 'admin';

interface ExtendedUser extends User {
  role: UserRole;
  password?: string; // stored hashed in real app; here just plain for demo
}

interface AuthContextType {
  user: ExtendedUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  authModalAction: 'signin' | 'signup';
  openAuthModal: (callback?: () => void, initialAction?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => Promise<{ success: boolean; error?: string }>;
  quickDemoLogin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Fixed Admin Credentials ───────────────────────────────────────────────
const ADMIN_CREDENTIALS = {
  email: 'admin@beshopable.com',
  password: 'Admin@123',
};

const ADMIN_USER: ExtendedUser = {
  id: 'admin_001',
  name: 'Store Admin',
  email: 'admin@beshopable.com',
  phone: '0300 1129959',
  memberSince: '2024',
  role: 'admin',
};

const DEMO_USER: ExtendedUser = {
  id: 'usr_demo_vip_2026',
  name: 'Muhammad Usman',
  email: 'usman.customer@beshopable.com',
  phone: '0300 1129959',
  avatar:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  memberSince: '2026',
  role: 'customer',
};

const STORAGE_KEY = 'beshopable_user';
const ACCOUNTS_KEY = 'beshopable_accounts';

function getAccounts(): Record<string, ExtendedUser & { password: string }> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAccounts(accounts: Record<string, ExtendedUser & { password: string }>) {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {/* ignore */}
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUser | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? (JSON.parse(stored) as ExtendedUser) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalAction, setAuthModalAction] = useState<'signin' | 'signup'>('signin');
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  const openAuthModal = (
    callback?: () => void,
    initialAction: 'signin' | 'signup' = 'signin'
  ) => {
    setPendingCallback(callback ? () => callback : null);
    setAuthModalAction(initialAction);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingCallback(null);
  };

  const executePending = () => {
    if (pendingCallback) {
      setTimeout(() => {
        try {
          pendingCallback();
        } catch (err) {
          console.error('Pending callback error:', err);
        }
        setPendingCallback(null);
      }, 150);
    }
  };

  const persistUser = (u: ExtendedUser) => {
    setUser(u);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    }
  };

  // ── LOGIN ────────────────────────────────────────────────────────────────
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const trimEmail = email.trim().toLowerCase();
    const trimPass = password.trim();

    if (!trimEmail || !trimPass) {
      return { success: false, error: 'Please enter your email and password.' };
    }

    // 1. Check admin credentials
    if (
      trimEmail === ADMIN_CREDENTIALS.email.toLowerCase() &&
      trimPass === ADMIN_CREDENTIALS.password
    ) {
      persistUser(ADMIN_USER);
      setIsAuthModalOpen(false);
      executePending();
      return { success: true };
    }

    // 2. Check registered accounts
    const accounts = getAccounts();
    const account = accounts[trimEmail];
    if (!account) {
      return { success: false, error: 'No account found with this email. Please register first.' };
    }
    if (account.password !== trimPass) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    persistUser(account);
    setIsAuthModalOpen(false);
    executePending();
    return { success: true };
  };

  // ── REGISTER ─────────────────────────────────────────────────────────────
  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const trimName = name.trim();
    const trimEmail = email.trim().toLowerCase();
    const trimPass = password.trim();

    if (!trimName) return { success: false, error: 'Full name is required.' };
    if (!trimEmail || !/\S+@\S+\.\S+/.test(trimEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!trimPass || trimPass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
    if (trimEmail === ADMIN_CREDENTIALS.email.toLowerCase()) {
      return { success: false, error: 'This email is reserved. Please use a different email.' };
    }

    const accounts = getAccounts();
    if (accounts[trimEmail]) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    const newUser: ExtendedUser & { password: string } = {
      id: `usr_${Date.now()}`,
      name: trimName,
      email: trimEmail,
      phone: phone?.trim() || '',
      memberSince: String(new Date().getFullYear()),
      role: 'customer',
      password: trimPass,
    };

    accounts[trimEmail] = newUser;
    saveAccounts(accounts);

    persistUser(newUser);
    setIsAuthModalOpen(false);
    executePending();
    return { success: true };
  };

  const quickDemoLogin = () => {
    persistUser(DEMO_USER);
    setIsAuthModalOpen(false);
    executePending();
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
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
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
