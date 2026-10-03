import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/data/categories';
import { ArrowRight } from 'lucide-react';
import {
  IconLawnSuits,
  IconMensEastern,
  IconBeddingLinen,
  IconAttarOudh,
  IconSmartTech,
  IconLeatherCraft,
  IconKitchenPro,
  IconMarkazVerified
} from '@/components/ui/CustomIcons';

const iconMap: Record<string, React.ElementType> = {
  IconLawnSuits,
  IconMensEastern,
  IconBeddingLinen,
  IconAttarOudh,
  IconSmartTech,
  IconLeatherCraft,
  IconKitchenPro
};

export const CategoryGrid: React.FC = () => {
  return (
    <section className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <IconMarkazVerified className="w-4 h-4 text-emerald-600" />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-sans">
              Wholesale Sourced Departments
            </span>
          </div>
          <h3 className="text-lg sm:text-2xl font-black text-slate-950 tracking-tight font-sans">
            Explore Markaz Verified Aisles
          </h3>
          <p className="text-xs text-slate-500">
            Factory-direct Pakistani lawn, pure leather footwear, artisanal attar, bridal bedding &amp; smart tech
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs font-bold text-slate-700 hover:text-amber-700 flex items-center space-x-1.5 self-start sm:self-auto transition-colors"
        >
          <span>All Departments</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-3.5">
        {CATEGORIES.map((cat) => {
          const IconComponent = iconMap[cat.iconName] || IconLawnSuits;
          return (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group p-3.5 rounded-2xl bg-slate-50/70 hover:bg-amber-50/40 border border-slate-200 hover:border-amber-400/70 transition-all flex flex-col items-center text-center space-y-2.5 cursor-pointer hover:shadow-sm"
            >
              <div className="w-13 h-13 rounded-2xl bg-white group-hover:bg-[#090e17] text-slate-800 group-hover:text-[#c5a059] shadow-xs border border-slate-200/80 group-hover:border-[#090e17] flex items-center justify-center transition-all group-hover:scale-105">
                <IconComponent className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div className="w-full">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-2 leading-snug font-sans">
                  {cat.name}
                </h4>
                <span className="text-[10px] text-slate-500 font-medium mt-1 block">
                  {cat.itemCount}+ Items
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
