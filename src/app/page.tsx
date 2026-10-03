'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Truck } from 'lucide-react';
import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FlashSale } from '@/components/home/FlashSale';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { getProducts } from '@/services/productService';
import { MARKAZ_PRODUCTS } from '@/data/markazCatalog';
import { Product } from '@/types';
import {
  IconMarkazVerified,
  IconCashOnDelivery,
  IconParcelInspection,
  IconVoucherTicket,
  IconDirectFactory
} from '@/components/ui/CustomIcons';

export default function HomePage() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(MARKAZ_PRODUCTS);

  React.useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Banner Carousel */}
      <HeroBanner />

      {/* Trust Proposition Pillars - Markaz Certified Wholesale Trust */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center space-x-3.5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
            <IconMarkazVerified className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-950 leading-tight font-sans">Direct Mill Sourcing</h4>
            <span className="text-[10px] text-slate-500 font-medium">Markaz verified wholesale</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center space-x-3.5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-100">
            <IconCashOnDelivery className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-950 leading-tight font-sans">Cash on Delivery</h4>
            <span className="text-[10px] text-slate-500 font-medium">Nationwide across Pakistan</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center space-x-3.5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 border border-slate-200">
            <IconParcelInspection className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-950 leading-tight font-sans">Open-Parcel Check</h4>
            <span className="text-[10px] text-slate-500 font-medium">Inspect before you pay</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center space-x-3.5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#090e17] text-[#c5a059] flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5 text-[#c5a059]" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-950 leading-tight font-sans">Express Dispatch</h4>
            <span className="text-[10px] text-slate-500 font-medium">TCS, Trax &amp; Call Courier</span>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <CategoryGrid />

      {/* Flash Sale Section */}
      <FlashSale products={products} onQuickView={setQuickViewProduct} />

      {/* Executive Wholesale Privilege Card */}
      <div className="bg-gradient-to-r from-[#090e17] via-[#121a24] to-[#182332] rounded-3xl p-6 sm:p-9 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

        <div className="flex items-center space-x-5 z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c5a059] to-[#936b37] flex items-center justify-center shrink-0 shadow-lg shadow-amber-950/40 text-slate-950 border border-amber-300/40">
            <IconVoucherTicket className="w-8 h-8 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#c5a059] block">
                Official Reseller &amp; Member Privilege
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1 font-sans">
              Enjoy 20% Direct Savings On Your Entire Catalog Order
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
              Use VIP promo code <strong className="bg-[#05090f] text-[#c5a059] px-2.5 py-0.5 rounded font-mono font-bold border border-amber-500/30">BESHOPABLE20</strong> at checkout for instantaneous wholesale margin discount.
            </p>
          </div>
        </div>

        <Link
          href="/products"
          className="bg-[#c5a059] hover:bg-[#d8b87d] text-slate-950 font-black text-xs sm:text-sm px-7 py-3.5 rounded-xl shadow-xl shadow-amber-950/30 hover:scale-102 active:scale-98 transition shrink-0 z-10 cursor-pointer"
        >
          Claim Privilege Now
        </Link>
      </div>

      {/* Trending Markaz Catalog Section */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <IconDirectFactory className="w-4 h-4 text-[#b08745]" />
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                Factory Masterpieces
              </span>
            </div>
            <h3 className="text-base sm:text-xl font-black text-slate-950 tracking-tight font-sans">
              Curated Markaz Wholesale Flagship Picks
            </h3>
            <p className="text-xs text-slate-500">
              High-demand Pakistani unstitched lawn, pure leather footwear, and artisan home linen
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-amber-800 transition"
          >
            <span>Explore Entire Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
          ))}
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
