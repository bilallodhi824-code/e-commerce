'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Trash2, ShoppingBag, CheckCircle2, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { Product } from '@/types';

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [bulkNotice, setBulkNotice] = useState<string | null>(null);

  const handleAddAllToCart = () => {
    const available = wishlist.filter((p) => p.stock > 0);
    if (available.length === 0) return;

    available.forEach((p) => {
      addToCart(p, 1, p.colors?.[0], p.sizes?.[0]);
    });

    setBulkNotice(`Added ${available.length} ${available.length === 1 ? 'item' : 'items'} to your cart!`);
    setTimeout(() => {
      setBulkNotice(null);
      setIsCartOpen(true);
    }, 1200);
  };

  if (wishlist.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 sm:p-14 text-center max-w-lg mx-auto border border-slate-200/90 shadow-xs space-y-4 my-8">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-black text-slate-950">Your Wishlist is Empty</h2>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Save your favorite products by tapping the heart icon on any product card!
        </p>
        <Link
          href="/products"
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-8 py-3 rounded-xl shadow-lg shadow-blue-600/25 transition cursor-pointer"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  const inStockCount = wishlist.filter((p) => p.stock > 0).length;

  return (
    <div className="space-y-6 pb-16 md:pb-12">
      {/* Header with Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-cursive text-amber-500 text-2xl block leading-none">
            Saved Gear
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-950">My Wishlist</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            You have <strong className="text-blue-600">{wishlist.length}</strong> saved items ({inStockCount} in stock)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {inStockCount > 0 && (
            <button
              onClick={handleAddAllToCart}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/25 flex items-center space-x-1.5 transition cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add All to Cart</span>
            </button>
          )}

          <button
            onClick={clearWishlist}
            className="text-xs font-bold text-rose-500 hover:underline flex items-center space-x-1 cursor-pointer px-2 py-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Bulk Add Feedback Notice */}
      {bulkNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{bulkNotice}</span>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-emerald-700 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>View Cart</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Wishlist Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {wishlist.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={setQuickViewProduct}
          />
        ))}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
