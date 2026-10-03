'use client';

import React from 'react';

interface BSLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const BSLogo: React.FC<BSLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  };

  return (
    <div className={`flex items-center space-x-2.5 shrink-0 group select-none ${className}`}>
      {/* Clean Minimalist Vector Emblem */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-[#0e1620] border border-white/10 group-hover:border-teal-500/50 shadow-sm transition-all duration-200 shrink-0`}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 sm:w-7 sm:h-7"
        >
          {/* Minimalist Geometric "B" & "S" Precision Line Mark */}
          <rect x="7" y="7" width="22" height="22" rx="6" stroke="#1e293b" strokeWidth="1.5" />
          {/* Continuous modern B stem and loop */}
          <path
            d="M12 11H18C19.6569 11 21 12.3431 21 14C21 15.6569 19.6569 17 18 17H12V11Z"
            stroke="#0d9488"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 17H19C20.6569 17 22 18.3431 22 20C22 21.6569 20.6569 23 19 23H12V17Z"
            stroke="#0d9488"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Clean overlapping S ribbon in refined champagne gold */}
          <path
            d="M24 13C23 12 21.5 11.5 20 12C18 12.8 18 15 19.5 16L21.5 17.5C23 18.8 23 21 21 22C19.5 22.8 17.5 22 16.5 21"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Modern Typographic Wordmark */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center space-x-1">
            <span className={`${textSizes[size]} font-black tracking-tight text-white leading-none font-sans`}>
              Be<span className="text-teal-400 font-extrabold group-hover:text-teal-300 transition-colors">Shopable</span>
            </span>
          </div>
          <div className="flex items-center space-x-1.5 mt-0.5">
            <span className="font-luxury text-[8px] sm:text-[9px] tracking-[0.22em] text-slate-400 uppercase font-semibold">
              SIGNATURE STORE
            </span>
            <span className="w-1 h-1 rounded-full bg-teal-400/80" />
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">
              EST. 2026
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
