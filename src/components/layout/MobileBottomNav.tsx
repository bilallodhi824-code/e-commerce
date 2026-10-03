'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Heart, ShoppingBag, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();

  const isHomeActive = pathname === '/';
  const isCatalogActive = pathname.startsWith('/products');
  const isWishlistActive = pathname === '/wishlist';
  const isAccountActive = pathname === '/dashboard' || pathname === '/order-tracking';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-2">
      <div className="grid grid-cols-5 items-center justify-items-center max-w-md mx-auto">
        
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center w-full py-1 rounded-xl transition ${
            isHomeActive ? 'text-[#b08745] font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <Home className={`w-5 h-5 ${isHomeActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Home</span>
        </Link>

        {/* Catalog / Categories */}
        <Link
          href="/products"
          className={`flex flex-col items-center justify-center w-full py-1 rounded-xl transition ${
            isCatalogActive ? 'text-[#b08745] font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <LayoutGrid className={`w-5 h-5 ${isCatalogActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Catalog</span>
        </Link>

        {/* Cart Drawer Trigger (Middle Highlighted) */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center w-full py-1 rounded-xl transition text-slate-500 hover:text-[#b08745] cursor-pointer"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#090e17] flex items-center justify-center text-[#c5a059] shadow-md border border-amber-500/20">
              <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
            </div>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-[#c5a059] text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-bold tracking-tight text-slate-800">Cart</span>
        </button>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          className={`flex flex-col items-center justify-center w-full py-1 rounded-xl transition relative ${
            isWishlistActive ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-rose-600'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${isWishlistActive ? 'fill-current stroke-rose-600' : 'stroke-2'}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center ring-2 ring-white">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Saved</span>
        </Link>

        {/* Account / Tracking */}
        <Link
          href="/order-tracking"
          className={`flex flex-col items-center justify-center w-full py-1 rounded-xl transition ${
            isAccountActive ? 'text-[#b08745] font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <Package className={`w-5 h-5 ${isAccountActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Tracking</span>
        </Link>

      </div>
    </div>
  );
};
