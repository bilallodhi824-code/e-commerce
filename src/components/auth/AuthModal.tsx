'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalAction, login, register, quickDemoLogin } =
    useAuth();
  const [tab, setTab] = useState<'signin' | 'signup'>(authModalAction);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Sync tab when modal opens
  React.useEffect(() => {
    queueMicrotask(() => {
      setTab(authModalAction);
      setError('');
      setSuccess('');
    });
  }, [authModalAction, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setError('');
    setSuccess('');
  };

  const handleTabSwitch = (newTab: 'signin' | 'signup') => {
    setTab(newTab);
    resetFields();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (tab === 'signin') {
        const result = await login(email, password);
        if (!result.success) {
          setError(result.error || 'Sign in failed. Please try again.');
        }
      } else {
        const result = await register(name, email, password, phone);
        if (!result.success) {
          setError(result.error || 'Registration failed. Please try again.');
        } else {
          setSuccess('Account created successfully! Welcome aboard.');
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-md bg-[#080c10] border border-[#16222c] rounded-3xl p-6 sm:p-8 shadow-2xl text-white overflow-hidden ring-1 ring-teal-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glows */}
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-5">
          <div className="inline-flex items-center space-x-1.5 bg-teal-500/15 text-teal-300 border border-teal-500/30 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3 text-teal-400" />
            <span>Customer Authentication</span>
          </div>
          <h3 className="text-2xl font-black tracking-tight text-white font-sans">
            {tab === 'signin' ? 'Sign In to Your Account' : 'Create Customer Account'}
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            {tab === 'signin'
              ? 'Sign in to place orders, track deliveries, and access your dashboard.'
              : 'Create a free account to start shopping with nationwide COD.'}
          </p>
        </div>

        {/* Quick Demo Login */}
        <button
          type="button"
          onClick={quickDemoLogin}
          className="w-full mb-4 py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 hover:from-teal-500 hover:to-cyan-500 text-white text-xs font-black flex items-center justify-center space-x-2 shadow-lg shadow-teal-950/50 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300 fill-current" />
          <span>Quick 1-Click Demo Login</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

        <div className="flex items-center space-x-3 my-3">
          <div className="flex-1 h-px bg-[#1e2b37]" />
          <span className="text-[11px] font-bold text-slate-500 uppercase">Or use Email</span>
          <div className="flex-1 h-px bg-[#1e2b37]" />
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#0e161d] rounded-xl border border-[#16222c] mb-4">
          <button
            type="button"
            onClick={() => handleTabSwitch('signin')}
            className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              tab === 'signin'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('signup')}
            className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              tab === 'signup'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 mb-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="p-3 mb-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                Full Name *
              </label>
              <div className="relative flex items-center">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Muhammad Usman"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(''); }}
                  className="w-full bg-[#0e161d] border border-[#1b2a36] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 transition font-medium"
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
              Email Address *
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full bg-[#0e161d] border border-[#1b2a36] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 transition font-medium"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
              Password *
              {tab === 'signup' && <span className="text-slate-500 normal-case font-normal ml-1">(min. 6 characters)</span>}
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full bg-[#0e161d] border border-[#1b2a36] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 transition font-medium"
                autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-500 hover:text-slate-300 transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {tab === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                Phone <span className="text-slate-500 normal-case font-normal">(optional)</span>
              </label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="0300 1129959"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0e161d] border border-[#1b2a36] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 transition font-medium"
                  autoComplete="tel"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-black transition cursor-pointer shadow-lg shadow-teal-900/30 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Please wait...</span>
              </>
            ) : (
              <>
                <span>{tab === 'signin' ? 'Sign In & Continue' : 'Create Account & Continue'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Admin hint */}
        {tab === 'signin' && (
          <p className="text-[9px] text-slate-600 text-center mt-3 font-mono">
            Admin? Use admin@beshopable.com / Admin@123
          </p>
        )}

        <p className="text-[10px] text-slate-500 text-center mt-3">
          By continuing, you agree to BeShopable Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
