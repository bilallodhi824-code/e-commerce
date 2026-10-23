'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, Eye, Heart, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useInventory } from '@/context/InventoryContext';
import { formatPrice } from '@/utils/formatters';
import { IconFlashSale, IconCashOnDelivery, IconMarkazVerified } from '@/components/ui/CustomIcons';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { getStock, isOutOfStock, isLowStock } = useInventory();
  const [isAdded, setIsAdded] = useState(false);

  const liveStock = getStock(product.id);
  const outOfStock = isOutOfStock(product.id);
  const lowStock = isLowStock(product.id);

  const isLiked = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (outOfStock) return;

    if (!isAuthenticated) {
      openAuthModal(() => {
        addToCart(product, 1);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
      });
      return;
    }

    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="luxury-card group flex flex-col justify-between overflow-hidden bg-white rounded-2xl relative border border-slate-200 shadow-xs">
      
      {/* Image Container with crisp soft porcelain backdrop */}
      <div className="relative aspect-square w-full bg-slate-50/80 overflow-hidden">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col space-y-1 z-10 pointer-events-none">
          {outOfStock ? (
            <span className="bg-rose-700 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-xs tracking-wider animate-pulse">
              Sold Out
            </span>
          ) : lowStock ? (
            <span className="bg-amber-500 text-slate-950 text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-xs tracking-wider">
              Only {liveStock} Left
            </span>
          ) : null}
          {product.skuCode && (
            <span className="bg-[#090e17] text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center space-x-1 border border-white/10">
              <IconMarkazVerified className="w-2.5 h-2.5 text-emerald-400" />
              <span>{product.skuCode}</span>
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-rose-700 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
              -{product.discount}%
            </span>
          )}
          {product.isCodAvailable && (
            <span className="bg-emerald-950 text-emerald-300 text-[8.5px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-1 border border-emerald-800 shadow-xs">
              <IconCashOnDelivery className="w-2.5 h-2.5 text-emerald-400" />
              <span>COD</span>
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isLiked
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/95 text-slate-600 hover:text-rose-500 hover:bg-white shadow-xs'
          }`}
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Desktop Action */}
        {onQuickView && (
          <div className="hidden sm:flex absolute inset-0 bg-[#090e17]/25 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center pointer-events-none z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="pointer-events-auto bg-[#090e17] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xl hover:bg-[#162232] border border-white/10 transition flex items-center space-x-1.5 transform translate-y-2 group-hover:translate-y-0 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Inspect Details</span>
            </button>
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between space-y-2">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black text-[#b08745] uppercase tracking-wider block">
              {product.brand}
            </span>
          </div>

          <Link href={`/product/${product.id}`} className="block">
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug">
              {product.title}
            </h4>
          </Link>

          {/* Sourcing Hub or Fabric Line */}
          {(product.wholesaleSource || product.fabricType) && (
            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
              {product.fabricType || product.wholesaleSource}
            </p>
          )}

          {/* Rating & Sold count */}
          <div className="flex items-center space-x-1.5 mt-2 text-[11px]">
            <div className="flex items-center text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-current" />
              <span className="ml-1 text-slate-900 font-extrabold">{product.rating}</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium text-[10px]">{product.soldCount} orders</span>
          </div>

          {/* Flash Stock Bar */}
          {product.isFlashSale && (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                <span className="flex items-center text-amber-700">
                  <IconFlashSale className="w-3 h-3 text-amber-600 mr-1" />
                  Limited Factory Stock
                </span>
                <span className={outOfStock ? 'text-rose-600 font-extrabold' : ''}>
                  {outOfStock ? '0 left (Out of stock)' : `${liveStock} left`}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full ${
                    outOfStock
                      ? 'bg-rose-500'
                      : 'bg-gradient-to-r from-amber-500 to-amber-700'
                  }`}
                  style={{ width: `${Math.min(100, (liveStock / 60) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
          <div>
            <div className="text-xs sm:text-sm font-black text-slate-950 leading-tight">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice > product.price && (
              <div className="text-[10px] text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={outOfStock}
            className={`p-2 sm:p-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center ${
              outOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
                : isAdded
                ? 'bg-emerald-700 text-white cursor-pointer'
                : 'bg-[#090e17] text-white hover:bg-[#1c2838] border border-white/10 active:scale-95 cursor-pointer'
            }`}
            title={outOfStock ? 'Currently Out of Stock' : 'Add to Cart'}
            aria-label={outOfStock ? 'Out of stock' : 'Add to cart'}
          >
            {outOfStock ? (
              <span className="text-[9px] font-black uppercase px-0.5 text-slate-500">OOS</span>
            ) : isAdded ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : (
              <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
            )}
          </button>
        </div>
      </div>

    </div>
  );
};
