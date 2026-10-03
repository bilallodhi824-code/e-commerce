'use client';

import React, { useState, useEffect } from 'react';
import { IconMarkazVerified } from '@/components/ui/CustomIcons';

export const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(20);
  const [statusText, setStatusText] = useState('Authenticating direct factory inventory...');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setProgress(55);
      setStatusText('Synchronizing Markaz wholesale catalog...');
    }, 250);

    const t2 = setTimeout(() => {
      setProgress(88);
      setStatusText('Finalizing premium boutique storefront...');
    }, 550);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Ready');
    }, 850);

    const t4 = setTimeout(() => {
      setIsFading(true);
    }, 1050);

    const t5 = setTimeout(() => {
      setIsVisible(false);
    }, 1350);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#090d16] text-white transition-opacity duration-400 ease-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ backdropFilter: 'blur(20px)' }}
    >
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center space-y-6">
        
        {/* Luxury Monogram Emblem */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-[#162032] to-[#0d1420] border border-amber-500/30 flex items-center justify-center shadow-2xl shadow-amber-900/20">
            <svg
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10"
            >
              <rect x="6" y="6" width="24" height="24" rx="6" stroke="#334155" strokeWidth="1.2" />
              <path
                d="M12 11H18C19.6569 11 21 12.3431 21 14C21 15.6569 19.6569 17 18 17H12V11Z"
                stroke="#c5a059"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 17H19C20.6569 17 22 18.3431 22 20C22 21.6569 20.6569 23 19 23H12V17Z"
                stroke="#c5a059"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M24 13C23 12 21.5 11.5 20 12C18 12.8 18 15 19.5 16L21.5 17.5C23 18.8 23 21 21 22C19.5 22.8 17.5 22 16.5 21"
                stroke="#059669"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Subdued pulsating gold ring */}
          <div className="absolute -inset-1.5 rounded-2xl border border-amber-500/20 animate-pulse pointer-events-none" />
        </div>

        {/* Brand Name & Verified Subtitle */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl font-black tracking-tight text-white font-sans">
              Be<span className="text-[#c5a059]">Shopable</span>
            </span>
          </div>
          <div className="flex items-center justify-center space-x-1.5 text-xs text-emerald-400 font-medium tracking-wide">
            <IconMarkazVerified className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold">
              Markaz Verified Wholesale Partner
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-56 space-y-2">
          <div className="w-full bg-slate-800/80 rounded-full h-1 overflow-hidden border border-slate-700/40">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400">
            <span className="truncate pr-2">{statusText}</span>
            <span className="font-mono text-slate-300">{progress}%</span>
          </div>
        </div>

      </div>

      {/* Skip Button */}
      <button
        onClick={() => {
          setIsFading(true);
          setTimeout(() => setIsVisible(false), 200);
        }}
        className="absolute bottom-8 text-[11px] text-slate-400 hover:text-white uppercase tracking-widest transition-colors cursor-pointer"
      >
        Skip intro &rarr;
      </button>
    </div>
  );
};
