'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { BESHOPABLE_BANNERS } from '@/data/banners';
import { IconMarkazVerified } from '@/components/ui/CustomIcons';

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BESHOPABLE_BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-800 group">
      <div className="relative h-72 sm:h-88 md:h-[430px] w-full">
        {BESHOPABLE_BANNERS.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Deep Obsidian Gradient Vignette for crisp text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#070b12] via-[#090f19]/90 to-transparent z-10" />
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover object-center transform scale-102 transition-transform duration-7000"
            />

            {/* Banner Content */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-2xl">
              <div className="space-y-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center space-x-1.5 bg-[#0b1420]/80 backdrop-blur-md text-[#c5a059] border border-amber-500/30 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
                    <IconMarkazVerified className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{banner.badge}</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest hidden sm:inline">
                    • {banner.eyebrow}
                  </span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-sm font-sans">
                {banner.title}
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-slate-300 font-medium mt-3 mb-6 line-clamp-2 max-w-lg leading-relaxed">
                {banner.subtitle}
              </p>

              <div>
                <Link
                  href={banner.ctaLink || '/products'}
                  className="inline-flex items-center space-x-2 bg-[#c5a059] hover:bg-[#d8b87d] text-slate-950 font-black text-xs sm:text-sm px-6 sm:px-8 py-3.5 rounded-xl shadow-xl shadow-amber-950/30 hover:scale-102 active:scale-98 transition-all cursor-pointer"
                >
                  <span>{banner.ctaText}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev === 0 ? BESHOPABLE_BANNERS.length - 1 : prev - 1))}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/60 hover:bg-[#c5a059] hover:text-slate-950 text-white backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
      </button>

      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % BESHOPABLE_BANNERS.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/60 hover:bg-[#c5a059] hover:text-slate-950 text-white backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {BESHOPABLE_BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1.5 rounded-full transition-all ${
              idx === currentSlide ? 'w-8 bg-[#c5a059]' : 'w-2 bg-white/40 hover:bg-white/80'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
