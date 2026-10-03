'use client';

import React from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import { Product } from '@/types';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice } from '@/utils/formatters';
import { IconFlashSale } from '@/components/ui/CustomIcons';

interface ProductStickyBarProps {
  product: Product;
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export const ProductStickyBar: React.FC<ProductStickyBarProps> = ({
  product,
  onAddToCart,
  onBuyNow
}) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isLiked = isInWishlist(product.id);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] p-3 px-4">
      <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
        
        {/* Wishlist quick action */}
        <button
          onClick={() => toggleWishlist(product)}
          className={`p-2.5 rounded-xl border transition cursor-pointer ${
            isLiked
              ? 'bg-rose-50 border-rose-200 text-rose-500'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Price display */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-black text-slate-950 leading-tight">
            {formatPrice(product.price)}
          </div>
          {product.originalPrice > product.price && (
            <span className="text-[10px] text-slate-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onAddToCart}
            className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center space-x-1.5 transition border border-slate-200 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Add</span>
          </button>

          <button
            onClick={onBuyNow}
            className="bg-[#090e17] hover:bg-[#162232] text-amber-300 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md border border-amber-500/30 flex items-center space-x-1.5 transition active:scale-95 cursor-pointer"
          >
            <IconFlashSale className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Buy Now</span>
          </button>
        </div>

      </div>
    </div>
  );
};
