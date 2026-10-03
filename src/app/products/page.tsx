'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, ArrowUpDown, X, RotateCcw } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { MARKAZ_PRODUCTS } from '@/data/markazCatalog';
import { getProducts } from '@/services/productService';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { Product } from '@/types';
import { formatPrice } from '@/utils/formatters';
import { IconFlashSale, IconMarkazVerified } from '@/components/ui/CustomIcons';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const flashParam = searchParams.get('flash') === 'true';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [isFlashOnly, setIsFlashOnly] = useState(flashParam);
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>(MARKAZ_PRODUCTS);

  useEffect(() => {
    getProducts().then(setAllProducts);
  }, []);

  // Sync state when URL query parameters change
  useEffect(() => {
    queueMicrotask(() => {
      setSelectedCategory(categoryParam);
    });
  }, [categoryParam]);

  useEffect(() => {
    queueMicrotask(() => {
      setSearchQuery(searchParam);
    });
  }, [searchParam]);

  useEffect(() => {
    queueMicrotask(() => {
      setIsFlashOnly(flashParam);
    });
  }, [flashParam]);

  // Extract unique brands
  const brands = useMemo(() => {
    const set = new Set(allProducts.map((p) => p.brand));
    return Array.from(set);
  }, [allProducts]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      if (isFlashOnly && !product.isFlashSale) {
        return false;
      }
      if (
        searchQuery &&
        !product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.category.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (product.price > priceRange) {
        return false;
      }
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }
      if (inStockOnly && product.stock <= 0) {
        return false;
      }
      if (selectedBrand !== 'all' && product.brand !== selectedBrand) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.soldCount - a.soldCount; // Popular
    });
  }, [allProducts, selectedCategory, searchQuery, priceRange, minRating, inStockOnly, selectedBrand, sortBy, isFlashOnly]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setIsFlashOnly(false);
    setPriceRange(10000);
    setMinRating(0);
    setInStockOnly(false);
    setSelectedBrand('all');
    setSortBy('popular');
  };

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0) +
    (isFlashOnly ? 1 : 0) +
    (priceRange < 60000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (selectedBrand !== 'all' ? 1 : 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Catalog Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <IconMarkazVerified className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Direct Wholesale Catalog
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-950 font-sans">
            {isFlashOnly
              ? 'Wholesale Flash Drops'
              : selectedCategory !== 'all'
              ? CATEGORIES.find((c) => c.slug === selectedCategory)?.name || 'Product Catalog'
              : 'All Products & Wholesale Collections'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> verified factory items
          </p>

          {/* Active Filter Chips */}
          {(searchQuery || selectedCategory !== 'all' || isFlashOnly) && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Active:</span>
              {searchQuery && (
                <span className="inline-flex items-center space-x-1 text-[11px] bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-md border border-slate-200">
                  <span>Search: &quot;{searchQuery}&quot;</span>
                  <button onClick={() => setSearchQuery('')} className="hover:text-slate-950 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center space-x-1 text-[11px] bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-md border border-slate-200">
                  <span>Category: {CATEGORIES.find((c) => c.slug === selectedCategory)?.name || selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('all')} className="hover:text-slate-950 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {isFlashOnly && (
                <span className="inline-flex items-center space-x-1 text-[11px] bg-amber-50 text-amber-900 font-bold px-2 py-0.5 rounded-md border border-amber-200">
                  <IconFlashSale className="w-3 h-3 text-amber-600" />
                  <span>Flash Drops Only</span>
                  <button onClick={() => setIsFlashOnly(false)} className="hover:text-amber-950 cursor-pointer ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Controls Bar */}
        <div className="flex items-center space-x-3">
          {/* Mobile Filter Drawer Trigger */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition border border-slate-200 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'popular' | 'price-low' | 'price-high' | 'rating')}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Product Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 font-black text-slate-900 text-sm">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span>Filters</span>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-rose-500 hover:underline font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider">Categories</h4>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Categories
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold transition truncate cursor-pointer ${
                      selectedCategory === cat.slug
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs font-bold text-slate-900">
                <span>Max Price:</span>
                <span className="text-blue-600">{formatPrice(priceRange)}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={10000}
                step={250}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Brands Filter */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider">Brands</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1 text-xs">
                <button
                  onClick={() => setSelectedBrand('all')}
                  className={`w-full text-left px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    selectedBrand === 'all'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Brands
                </button>
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`w-full text-left px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                      selectedBrand === b
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Only Toggle */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">In Stock Only</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Filter className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-950">No products match your filters</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try adjusting or resetting your category, price range, or search criteria.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filter Slide-Over Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-[#070a12]/70 backdrop-blur-xs transition-opacity animate-in fade-in"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-2xl flex flex-col justify-between p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2 font-black text-slate-900 text-sm">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <span>Filters ({activeFiltersCount})</span>
                </div>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Content */}
              <div className="flex-1 overflow-y-auto space-y-5 pr-1 text-xs">
                {/* Categories */}
                <div>
                  <h4 className="font-bold text-slate-900 mb-2 uppercase">Category</h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold cursor-pointer ${
                        selectedCategory === 'all' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'
                      }`}
                    >
                      All
                    </button>
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCategory(c.slug)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold truncate cursor-pointer ${
                          selectedCategory === c.slug ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <div className="flex justify-between font-bold text-slate-900 mb-1">
                    <span>Max Price:</span>
                    <span className="text-blue-600">{formatPrice(priceRange)}</span>
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={60000}
                    step={1000}
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                {/* In stock */}
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>In Stock Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400 text-xs">Loading Catalog...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}
