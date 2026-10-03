'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  PhoneCall,
  Package,
  ArrowRight,
  TrendingUp,
  LogOut,
  LayoutGrid
} from 'lucide-react';
import { IconFlashSale } from '@/components/ui/CustomIcons';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { CATEGORIES } from '@/data/categories';
import { MARKAZ_PRODUCTS as PRODUCTS } from '@/data/markazCatalog';
import { BSLogo } from '@/components/ui/BSLogo';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { formatPrice } from '@/utils/formatters';
import { getWhatsAppUrl, WHATSAPP_DISPLAY_NUMBER } from '@/utils/whatsapp';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const whatsappInquiryUrl = getWhatsAppUrl(
    'Hello BeShopable Support! I would like to inquire about products and order delivery.'
  );

  // Filter search suggestions
  const searchSuggestions = searchQuery.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const mobileSuggestions = mobileSearchQuery.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(mobileSearchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(mobileSearchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(mobileSearchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      setIsMobileMenuOpen(false);
      router.push(`/products?search=${encodeURIComponent(mobileSearchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#060b0f] shadow-xl border-b border-[#121e28]">
      
      {/* Top Announcement Bar - Obsidian & Champagne Gold */}
      <div className="bg-[#04070a] text-slate-300 text-xs py-2 px-4 border-b border-[#121e28]/70">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 bg-teal-500/15 text-teal-300 border border-teal-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-400 fill-current" />
              <span>Privilege Sale</span>
            </span>
            <span className="hidden md:inline text-slate-300 text-[11px] font-medium">
              Free Nationwide Express Courier on all orders over Rs. 2,000 | Use Voucher{' '}
              <strong className="text-amber-400 font-mono font-bold">BESHOPABLE20</strong> for 20% OFF
            </span>
            <span className="md:hidden text-slate-300 text-[11px] font-medium">
              Free Delivery over Rs. 2,000 • Code: <strong className="text-amber-400 font-bold">BESHOPABLE20</strong>
            </span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] sm:text-xs">
            {/* Direct WhatsApp in Announcement Bar */}
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:text-emerald-400 transition flex items-center space-x-1 font-bold"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">WhatsApp Chat</span>
            </a>

            <span className="text-[#334155]">|</span>

            {/* Direct Order Tracking */}
            <Link
              href="/order-tracking"
              className="hover:text-teal-400 transition font-bold flex items-center space-x-1 text-slate-300"
            >
              <Package className="w-3.5 h-3.5 text-teal-400" />
              <span>Track Order</span>
            </Link>

            <span className="text-[#334155]">|</span>

            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal-400 transition flex items-center space-x-1 text-slate-300"
              title="Call or WhatsApp Helpline"
            >
              <PhoneCall className="w-3 h-3 text-teal-400" />
              <span>{WHATSAPP_DISPLAY_NUMBER}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav Section - Deep Slate Midnight */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Brand Logo with New "BS" Monogram Badge */}
          <Link href="/" className="shrink-0">
            <BSLogo size="md" showText={true} />
          </Link>
          
          {/* Desktop Live Search Bar */}
          <div ref={searchRef} className="hidden md:block flex-1 max-w-xl relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search smart electronics, active formulas, luxury watches, audio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-[#0b141b] border border-[#162733] rounded-xl pl-11 pr-24 py-2.5 text-xs text-white placeholder-slate-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 shadow-inner transition-all font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-20 text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="submit"
                className="absolute right-1.5 bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 hover:from-teal-500 hover:to-cyan-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-md shadow-teal-950/40 transition-all cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Live Search Auto-suggestions Dropdown */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span className="flex items-center space-x-1.5 text-slate-700">
                    <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                    <span>Instant Matches</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{searchSuggestions.length} products found</span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {searchSuggestions.map((prod) => (
                    <Link
                      key={prod.id}
                      href={`/product/${prod.id}`}
                      onClick={() => setIsSearchFocused(false)}
                      className="p-3 flex items-center space-x-3 hover:bg-teal-50/60 transition group"
                    >
                      <img
                        src={prod.images[0]}
                        alt={prod.title}
                        className="w-11 h-11 object-contain rounded-xl bg-slate-100 p-1 border border-slate-200 group-hover:scale-105 transition-transform shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-black text-teal-600 uppercase tracking-wider block">
                          {prod.brand}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-teal-600 transition-colors">
                          {prod.title}
                        </h4>
                        <span className="text-xs font-black text-slate-950 mt-0.5 block">
                          {formatPrice(prod.price)}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transform group-hover:translate-x-1 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>

                <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    onClick={handleSearchSubmit}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center space-x-1 cursor-pointer"
                  >
                    <span>View all matching items</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-[#101f29] transition group"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-teal-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#060b0f]">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Account / User Authentication Trigger */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="hidden sm:flex items-center space-x-2 p-1.5 pr-3 rounded-xl bg-[#0b141b] border border-[#162733] hover:border-teal-500/40 text-slate-300 hover:text-white transition cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden lg:block leading-none">
                    <span className="text-[10px] text-teal-400 font-bold block uppercase">VIP Member</span>
                    <span className="text-xs font-black text-white">{user.name.split(' ')[0]}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#060b0f] border border-[#162733] rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in">
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition mt-1"
                    >
                      <Package className="w-4 h-4 text-teal-400" />
                      <span>My Orders &amp; Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal()}
                className="hidden sm:flex items-center space-x-2 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#101f29] transition cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-[#0b141b] border border-[#162733] flex items-center justify-center text-teal-400">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left hidden lg:block">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block leading-none">
                    Welcome
                  </span>
                  <span className="text-xs font-bold text-white">Sign In / Register</span>
                </div>
              </button>
            )}

            {/* Cart Drawer Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-gradient-to-r from-[#1c2838] to-[#121c27] hover:from-[#243347] hover:to-[#1a2736] border border-white/10 hover:border-[#c5a059]/50 text-white rounded-xl shadow-lg transition flex items-center space-x-2 cursor-pointer active:scale-95"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-[#c5a059]" />
              <span className="hidden sm:inline text-xs font-black">Cart</span>
              {totalItems > 0 && (
                <span className="bg-[#c5a059] text-slate-950 text-[11px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#101f29] transition cursor-pointer"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>

        {/* Mobile Search Input below Header */}
        <div className="md:hidden mt-3 pt-2 border-t border-[#121e28]">
          <form onSubmit={handleMobileSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search products, brands, models..."
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              className="w-full bg-[#0b141b] border border-[#162733] rounded-xl pl-10 pr-16 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-teal-500 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-[11px] font-bold px-3 py-1 rounded-lg cursor-pointer"
            >
              Go
            </button>
          </form>
        </div>
      </div>

      {/* Desktop Sub-Navigation Bar */}
      <div className="hidden md:block bg-[#04080b] border-t border-[#121e28]/70 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          
          {/* Minimal Professional Departments Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-white font-bold text-xs px-3.5 py-2 rounded-xl border border-white/10 hover:border-teal-500/40 transition-all cursor-pointer font-sans"
            >
              <LayoutGrid className="w-4 h-4 text-teal-400" />
              <span>All Departments</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180 text-teal-400' : ''}`} />
            </button>

            {isCategoryOpen && (
              <div className="absolute top-full left-0 mt-2.5 w-72 bg-[#090e13] rounded-2xl shadow-2xl border border-[#16222c] py-2 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-3.5 py-2 border-b border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest font-sans">
                  Store Aisles &amp; Collections
                </div>
                <div className="p-1 space-y-0.5">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setIsCategoryOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-slate-300 hover:bg-white/5 hover:text-teal-300 font-medium transition group"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform">{cat.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{cat.itemCount}+</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Core Desktop Navigation Links - Markaz Wholesale Aisles */}
          <nav className="flex items-center space-x-5 text-xs font-semibold text-slate-300">
            <Link
              href="/"
              className={`hover:text-white transition py-1 ${pathname === '/' ? 'text-[#c5a059] font-bold' : ''}`}
            >
              Home
            </Link>
            <Link
              href="/products?category=womens-unstitched-pret"
              className="hover:text-amber-200 transition py-1"
            >
              Lawn &amp; Pret
            </Link>
            <Link
              href="/products?category=mens-eastern-wear"
              className="hover:text-amber-200 transition py-1"
            >
              Men&apos;s Eastern
            </Link>
            <Link
              href="/products?category=bedding-home-linen"
              className="hover:text-amber-200 transition py-1"
            >
              Bedding &amp; Linen
            </Link>
            <Link
              href="/products?category=leather-footwear"
              className="hover:text-amber-200 transition py-1"
            >
              Leather &amp; Footwear
            </Link>
            <Link
              href="/products?category=attar-fragrances"
              className="hover:text-amber-200 transition py-1"
            >
              Pure Attar
            </Link>
            <Link
              href="/products?flash=true"
              className="text-[#c5a059] hover:text-amber-300 flex items-center space-x-1.5 transition py-1 font-bold"
            >
              <IconFlashSale className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Flash Drops</span>
            </Link>
          </nav>

          {/* Quick Support Badge */}
          <div className="flex items-center space-x-3 text-slate-400">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-slate-300">Express Delivery Active</span>
            </span>
          </div>

        </div>
      </div>

      {/* Mobile Application Sidebar Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden overflow-hidden">
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-[#070a12]/80 backdrop-blur-xs transition-opacity animate-in fade-in"
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
            <div className="w-screen max-w-xs bg-[#0f172a] text-white shadow-2xl flex flex-col justify-between p-5 space-y-6 border-r border-[#1e293b] animate-in slide-in-from-left duration-300">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#1e293b]">
                <BSLogo size="sm" showText={true} />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#1e293b] cursor-pointer"
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Search Input */}
              <div ref={mobileSearchRef}>
                <form onSubmit={handleMobileSearchSubmit} className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    value={mobileSearchQuery}
                    onChange={(e) => setMobileSearchQuery(e.target.value)}
                    className="w-full bg-[#1e293b] border border-[#334155] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none focus:border-blue-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
                </form>

                {mobileSuggestions.length > 0 && (
                  <div className="mt-2 bg-[#1e293b] rounded-xl p-2 border border-[#334155] space-y-1">
                    {mobileSuggestions.map((s) => (
                      <Link
                        key={s.id}
                        href={`/product/${s.id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-xs font-semibold text-slate-200 hover:text-blue-400 py-1 px-2 rounded truncate"
                      >
                        {s.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Nav Links */}
              <div className="flex-1 overflow-y-auto space-y-5 pr-1">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                    Departments &amp; Categories
                  </h4>
                  <div className="space-y-1">
                    {CATEGORIES.map((c) => (
                      <Link
                        key={c.id}
                        href={`/products?category=${c.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between text-xs font-bold text-slate-200 hover:text-blue-400 hover:bg-[#1e293b] p-2 rounded-xl transition"
                      >
                        <span>{c.name}</span>
                        <span className="text-[10px] bg-[#1e293b] text-slate-400 px-2 py-0.5 rounded-full">
                          {c.itemCount}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1e293b] space-y-2 text-xs font-bold">
                  <Link
                    href="/products?flash=true"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-[#c5a059] hover:text-amber-300 p-2 rounded-xl"
                  >
                    <IconFlashSale className="w-4 h-4 text-[#c5a059]" />
                    <span>Flash Drops &amp; Specials</span>
                  </Link>
                  <Link
                    href="/order-tracking"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-slate-200 hover:text-blue-400 p-2 rounded-xl"
                  >
                    <Package className="w-4 h-4 text-blue-400" />
                    <span>Real-Time Order Tracking</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-slate-200 hover:text-blue-400 p-2 rounded-xl"
                  >
                    <User className="w-4 h-4 text-blue-400" />
                    <span>My Account &amp; Past Orders</span>
                  </Link>
                </div>
              </div>

              {/* Drawer Footer with Direct WhatsApp */}
              <div className="pt-4 border-t border-[#1e293b] space-y-2">
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs py-2.5 rounded-xl shadow-md flex items-center justify-center space-x-2 transition"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current" />
                  <span>WhatsApp Live Support</span>
                </a>
              </div>

            </div>
          </div>
        </div>
      )}

    </header>
  );
};
