'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RefreshCw, Headphones, Mail, Phone, MapPin, Package } from 'lucide-react';
import { BSLogo } from '@/components/ui/BSLogo';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { getWhatsAppUrl, WHATSAPP_DISPLAY_NUMBER } from '@/utils/whatsapp';

export const Footer: React.FC = () => {
  const whatsappUrl = getWhatsAppUrl(
    'Hello BeShopable Support! I need assistance with an order or product inquiry.'
  );

  return (
    <footer className="bg-[#070a0e] text-slate-300 pt-14 pb-8 border-t border-[#16212b]">
      
      {/* Top Value Propositions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#16212b]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-[#0b1016] border border-[#16212b] hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-slate-200 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-sans">100% Authentic</h4>
              <p className="text-xs text-slate-400">Guaranteed original products</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-[#0b1016] border border-[#16212b] hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-slate-200 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-sans">Express Nationwide</h4>
              <p className="text-xs text-slate-400">Doorstep courier across Pakistan</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-[#0b1016] border border-[#16212b] hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-sans">7 Days Return</h4>
              <p className="text-xs text-slate-400">Instant refund guarantee</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-[#0b1016] border border-[#16212b] hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-sans">24/7 VIP Support</h4>
              <p className="text-xs text-slate-400">WhatsApp &amp; Live Phone Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <BSLogo size="md" showText={true} />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              BeShopable is Pakistan&apos;s premier store delivering flagship tech innovations, precision luxury timepieces, lifestyle electronics, and essentials with swift nationwide logistics.
            </p>
            
            <div className="space-y-2 pt-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>Headquarters: BeShopable Tower, Main Boulevard, Clifton, Karachi</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-rose-400" />
                <span>VIP Helpline / WhatsApp: {WHATSAPP_DISPLAY_NUMBER}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-rose-400" />
                <span>Email: support@beshopable.com</span>
              </div>
            </div>

            {/* Direct WhatsApp Chat Action */}
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-black px-4 py-2.5 rounded-xl transition shadow-md cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current" />
                <span>Chat with Us on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Shopping */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 font-sans">
              Markaz Wholesale Aisles
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/products?category=womens-unstitched-pret" className="hover:text-amber-400 transition">Women&apos;s Lawn &amp; Pret</Link></li>
              <li><Link href="/products?category=mens-eastern-wear" className="hover:text-amber-400 transition">Men&apos;s Eastern Wear</Link></li>
              <li><Link href="/products?category=bedding-home-linen" className="hover:text-amber-400 transition">Bedding &amp; Home Linen</Link></li>
              <li><Link href="/products?category=attar-fragrances" className="hover:text-amber-400 transition">Pure Attar &amp; Perfume Oils</Link></li>
              <li><Link href="/products?category=smart-tech-wearables" className="hover:text-amber-400 transition">Smart Wearables &amp; Tech</Link></li>
              <li><Link href="/products?category=leather-footwear" className="hover:text-amber-400 transition">Handcrafted Leather &amp; Shoes</Link></li>
              <li><Link href="/products?category=kitchen-smart-living" className="hover:text-amber-400 transition">Kitchen &amp; Home Tools</Link></li>
              <li><Link href="/products?flash=true" className="hover:text-amber-400 text-amber-400 font-bold transition">Flash Drops &amp; Limited Deals</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 font-sans">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/order-tracking" className="hover:text-teal-400 transition font-bold text-white flex items-center space-x-1">
                  <Package className="w-3.5 h-3.5 text-teal-400" />
                  <span>Real-Time Order Tracking</span>
                </Link>
              </li>
              <li><Link href="/dashboard" className="hover:text-teal-400 transition">My Account &amp; Past Orders</Link></li>
              <li><Link href="/wishlist" className="hover:text-teal-400 transition">Saved Wishlist</Link></li>
              <li><Link href="/checkout" className="hover:text-teal-400 transition">Secure Checkout Process</Link></li>
              <li><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 text-emerald-400 transition">24/7 WhatsApp Support</a></li>
            </ul>
          </div>

          {/* Payment Methods & Newsletter */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4">
              Accepted Payments
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-bold mb-6">
              <span className="px-3 py-1.5 rounded-lg bg-[#0f172a] text-center text-slate-300 border border-[#1e293b]">Cash on Delivery</span>
              <span className="px-3 py-1.5 rounded-lg bg-[#0f172a] text-center text-slate-300 border border-[#1e293b]">Visa / Master</span>
              <span className="px-3 py-1.5 rounded-lg bg-[#0f172a] text-center text-slate-300 border border-[#1e293b]">EasyPaisa</span>
              <span className="px-3 py-1.5 rounded-lg bg-[#0f172a] text-center text-slate-300 border border-[#1e293b]">JazzCash</span>
            </div>

            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-2">
              Newsletter Subscription
            </h4>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center">
              <input
                type="email"
                placeholder="Enter email..."
                className="w-full bg-[#0f172a] text-xs px-3 py-2.5 text-white placeholder-slate-500 rounded-l-xl outline-none border border-[#1e293b] focus:border-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-r-xl transition cursor-pointer">
                Join
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#1e293b] text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          &copy; {new Date().getFullYear()} BeShopable Pakistan Inc. All Rights Reserved.
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/order-tracking" className="hover:text-slate-300 transition">Order Tracking</Link>
          <Link href="/dashboard" className="hover:text-slate-300 transition">Privacy Policy</Link>
          <Link href="/dashboard" className="hover:text-slate-300 transition">Terms of Service</Link>
        </div>
      </div>

    </footer>
  );
};
