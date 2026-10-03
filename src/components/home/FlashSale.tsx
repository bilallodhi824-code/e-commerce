'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types';
import { IconFlashSale } from '@/components/ui/CustomIcons';

interface FlashSaleProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

export const FlashSale: React.FC<FlashSaleProps> = ({ products, onQuickView }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.filter((p) => p.isFlashSale).slice(0, 4);

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-6">
      
      {/* Header with Countdown Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
              <IconFlashSale className="w-5 h-5 text-[#b08745]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#b08745] block">
                Direct Mill Special
              </span>
              <h3 className="text-base sm:text-xl font-black text-slate-950 tracking-tight leading-tight">
                Wholesale Flash Drops
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium text-[11px]">Factory window closes in:</span>
            <div className="flex space-x-1 text-white">
              <span className="bg-[#090e17] border border-slate-700 px-2 py-0.5 rounded-md text-xs font-mono font-bold">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span className="text-slate-400 font-bold">:</span>
              <span className="bg-[#090e17] border border-slate-700 px-2 py-0.5 rounded-md text-xs font-mono font-bold">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span className="text-slate-400 font-bold">:</span>
              <span className="bg-[#c5a059] text-slate-950 px-2 py-0.5 rounded-md text-xs font-mono font-black animate-pulse shadow-xs">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/products?flash=true"
          className="inline-flex items-center space-x-1.5 text-slate-700 hover:text-amber-800 font-bold text-xs border border-slate-200 hover:border-amber-400 px-4 py-2 rounded-xl transition self-start sm:self-auto hover:bg-amber-50/50"
        >
          <span>All Flash Deals</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {flashProducts.map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
        ))}
      </div>
    </section>
  );
};
