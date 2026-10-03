'use client';

import React, { useState } from 'react';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { getWhatsAppUrl } from '@/utils/whatsapp';

export const WhatsAppButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const whatsappUrl = getWhatsAppUrl('Hello BeShopable Support! I would like to inquire about products and place an order.');

  return (
    <div className="fixed bottom-[74px] md:bottom-7 right-3.5 sm:right-6 z-40 flex items-center group">
      
      {/* Tooltip on Desktop */}
      <div
        className={`hidden sm:flex items-center space-x-2 bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-2xl shadow-xl border border-slate-800 mr-3 pointer-events-none transition-all duration-300 transform ${
          isHovered
            ? 'opacity-100 translate-x-0 scale-100'
            : 'opacity-0 translate-x-3 scale-95'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Chat with Us on WhatsApp</span>
      </div>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-[0_6px_20px_rgba(37,211,102,0.45)] hover:bg-[#20ba59] hover:scale-108 active:scale-95 transition-all duration-300"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulse Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />

        {/* WhatsApp Icon */}
        <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 relative z-10 fill-current" />

        {/* Status indicator dot */}
        <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full z-20 shadow-xs" />
      </a>
    </div>
  );
};
