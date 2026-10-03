'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Lock, Mail, User as UserIcon, Phone, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalAction, login, register, quickDemoLogin } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup'>(authModalAction);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync tab when modal opens
  React.useEffect(() => {
    queueMicrotask(() => {
      setTab(authModalAction);
      setError('');
    });
  }, [authModalAction, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'signin') {
        if (!email.trim() || !password.trim()) {
          setError('Please enter your email and password.');
          setLoading(false);
          return;
        }
        await login(email, password);
      } else {
        if (!name.trim() || !email.trim() || !password.trim()) {
          setError('Please fill in all required fields.');
          setLoading(false);
          return;
        }
        await register(name, email, password, phone);
      }
    } catch {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#080c10] border border-[#16222c] rounded-3xl p-6 sm:p-8 shadow-2xl text-white overflow-hidden ring-1 ring-teal-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center space-x-1.5 bg-teal-500/15 text-teal-300 border border-teal-500/30 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-400 fill-current" />
            <span>Customer Authentication</span>
          </div>
          <h3 className="text-2xl font-black tracking-tight text-white font-sans">
            {tab === 'signin' ? 'Sign In to Your Account' : 'Create Customer Account'}
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Please sign in to add products to your cart, place orders, and track deliveries.
          </p>
        </div>

        {/* Instant 1-Click Demo Login (Fast testing for reviewers) */}
        <button
          type="button"
          onClick={quickDemoLogin}
          className="w-full mb-5 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 hover:from-teal-500 hover:to-cyan-500 text-white text-xs font-black flex items-center justify-center space-x-2 shadow-lg shadow-teal-950/50 hover:scale-101 active:scale-99 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300 fill-current" />
          <span>Quick 1-Click Customer Sign In</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

        <div className="flex items-center space-x-3 my-4">
          <div className="flex-1 h-px bg-[#1e2b37]" />
          <span className="text-[11px] font-bold text-slate-500 uppercase">Or Continue with Email</span>
          <div className="flex-1 h-px bg-[#1e2b37]" />
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#0e161d] rounded-xl border border-[#16222c] mb-5">
          <button
            type="button"
            onClick={() => setTab('signin')}
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
            onClick={() => setTab('signup')}
            className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              tab === 'signup'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                Full Name
              </label>
              <div className="relative flex items-center">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Muhammad Usman"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0e161d] border border-[#1b2a36] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 transition font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0e161d] border border-[#1b2a36] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 transition font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0e161d] border border-[#1b2a36] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 transition font-medium"
              />
            </div>
          </div>

          {tab === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                Phone (Optional for SMS updates)
              </label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="0300 1129959"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0e161d] border border-[#1b2a36] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 transition font-medium"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black transition cursor-pointer shadow-lg shadow-teal-900/30 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{tab === 'signin' ? 'Sign In & Continue' : 'Create Account & Continue'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-[10px] text-slate-500 text-center mt-5">
          By continuing, you agree to BeShopable Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
