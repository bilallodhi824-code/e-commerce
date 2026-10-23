'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Minus,
  Edit3,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Boxes,
  BadgeCheck,
  Zap,
  BarChart3,
  XCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useInventory } from '@/context/InventoryContext';
import { MARKAZ_PRODUCTS } from '@/data/markazCatalog';
import { CATEGORIES } from '@/data/categories';
import { formatPrice } from '@/utils/formatters';
import { Order } from '@/types';

// ─── Admin Tabs ───────────────────────────────────────────────────────────────
type AdminTab = 'overview' | 'inventory' | 'categories' | 'orders';

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const {
    stock,
    getStock,
    setProductStock,
    addStock,
    lowStockProducts,
    outOfStockProducts,
    totalProducts,
  } = useInventory();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockEdits, setStockEdits] = useState<Record<string, string>>({});
  const [stockAdjust, setStockAdjust] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<'name' | 'stock-low' | 'stock-high'>('name');
  const [orders, setOrders] = useState<Order[]>([]);

  // ── Category Management State ──────────────────────────────────────────────
  const [catList, setCatList] = useState(() =>
    CATEGORIES.map((c) => ({ ...c, active: true }))
  );
  const [newCatName, setNewCatName] = useState('');
  const [catAddMsg, setCatAddMsg] = useState('');

  // ── Redirect non-admins ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
    }
  }, [isAdmin, router]);

  // ── Load orders ────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw =
        localStorage.getItem('beshopable_orders') ||
        localStorage.getItem('daraz_orders') ||
        '[]';
      setOrders(JSON.parse(raw));
    } catch {
      setOrders([]);
    }
  }, []);

  if (!isAdmin) return null;

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalOrderValue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const processingOrders = orders.filter((o) => o.status === 'Processing').length;

  // ── Product filtering ──────────────────────────────────────────────────────
  const filteredProducts = MARKAZ_PRODUCTS.filter((p) => {
    const matchQuery =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skuCode?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchQuery && matchCat;
  }).sort((a, b) => {
    if (sortBy === 'stock-low') return getStock(a.id) - getStock(b.id);
    if (sortBy === 'stock-high') return getStock(b.id) - getStock(a.id);
    return a.title.localeCompare(b.title);
  });

  // ── Helpers ────────────────────────────────────────────────────────────────
  const handleStockSave = (productId: string) => {
    const val = parseInt(stockEdits[productId] ?? '', 10);
    if (isNaN(val) || val < 0) return;
    setProductStock(productId, val);
    setSaveSuccess((prev) => ({ ...prev, [productId]: true }));
    setStockEdits((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
    setTimeout(() => setSaveSuccess((prev) => ({ ...prev, [productId]: false })), 2000);
  };

  const handleQuickAdjust = (productId: string, delta: number) => {
    const adj = parseInt(stockAdjust[productId] ?? '1', 10);
    const amount = isNaN(adj) ? 1 : Math.abs(adj);
    const current = getStock(productId);
    setProductStock(productId, Math.max(0, current + delta * amount));
    setSaveSuccess((prev) => ({ ...prev, [productId]: true }));
    setTimeout(() => setSaveSuccess((prev) => ({ ...prev, [productId]: false })), 1500);
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const slug = newCatName.trim().toLowerCase().replace(/\s+/g, '-');
    if (catList.find((c) => c.slug === slug)) {
      setCatAddMsg('Category already exists!');
      return;
    }
    setCatList((prev) => [
      ...prev,
      {
        id: slug,
        name: newCatName.trim(),
        slug,
        image: '',
        iconName: 'Tag',
        itemCount: 0,
        active: true,
      },
    ]);
    setNewCatName('');
    setCatAddMsg('Category added successfully!');
    setTimeout(() => setCatAddMsg(''), 3000);
  };

  const toggleCatActive = (slug: string) => {
    setCatList((prev) =>
      prev.map((c) => (c.slug === slug ? { ...c, active: !c.active } : c))
    );
  };

  const deleteCategory = (slug: string) => {
    setCatList((prev) => prev.filter((c) => c.slug !== slug));
  };

  // ─── Tab buttons ──────────────────────────────────────────────────────────
  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'inventory', label: 'Inventory', icon: <Boxes className="w-4 h-4" /> },
    { id: 'categories', label: 'Categories', icon: <Tag className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 pb-20">

      {/* Admin Header */}
      <div className="bg-gradient-to-r from-[#1a0a00] via-[#2d1500] to-[#3d1f00] rounded-3xl p-5 sm:p-7 border border-amber-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/40">
              <BarChart3 className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black text-white">Admin Control Panel</h1>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded-full font-black uppercase">
                  BeShopable
                </span>
              </div>
              <p className="text-xs text-amber-400/70 mt-0.5">
                Logged in as <strong className="text-amber-300">{user?.name}</strong> — Full admin access
              </p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 text-xs font-bold text-amber-300/70 hover:text-amber-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { label: 'Total Products', value: totalProducts, icon: <Package className="w-4 h-4" />, color: 'text-blue-400' },
            { label: 'Low Stock', value: lowStockProducts.length, icon: <AlertTriangle className="w-4 h-4" />, color: 'text-amber-400' },
            { label: 'Out of Stock', value: outOfStockProducts.length, icon: <XCircle className="w-4 h-4" />, color: 'text-rose-400' },
            { label: 'Total Orders', value: orders.length, icon: <ShoppingCart className="w-4 h-4" />, color: 'text-emerald-400' },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
              <div className={`${s.color} flex justify-center mb-1.5`}>{s.icon}</div>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === t.id
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-400'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW TAB ─────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Sales Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-950">{formatPrice(totalOrderValue)}</div>
              <div className="text-[11px] text-slate-400 mt-1">{orders.length} orders placed</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Processing Orders</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-600">{processingOrders}</div>
              <div className="text-[11px] text-slate-400 mt-1">Need dispatch action</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Categories</span>
                <Tag className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-blue-600">{catList.filter((c) => c.active).length}</div>
              <div className="text-[11px] text-slate-400 mt-1">of {catList.length} total categories</div>
            </div>
          </div>

          {/* Low Stock Alerts */}
          {lowStockProducts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-black text-amber-800">Low Stock Alerts ({lowStockProducts.length})</h3>
              </div>
              <div className="space-y-2">
                {lowStockProducts.map((id) => {
                  const p = MARKAZ_PRODUCTS.find((x) => x.id === id);
                  if (!p) return null;
                  return (
                    <div key={id} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-amber-100 text-xs">
                      <span className="font-semibold text-slate-800 truncate max-w-xs">{p.title}</span>
                      <div className="flex items-center space-x-3 shrink-0 ml-3">
                        <span className="font-black text-amber-700">{getStock(id)} left</span>
                        <button
                          onClick={() => { setActiveTab('inventory'); }}
                          className="text-blue-600 hover:underline font-bold"
                        >
                          Restock →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Out of Stock */}
          {outOfStockProducts.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <XCircle className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-black text-rose-800">Out of Stock ({outOfStockProducts.length})</h3>
              </div>
              <div className="space-y-2">
                {outOfStockProducts.map((id) => {
                  const p = MARKAZ_PRODUCTS.find((x) => x.id === id);
                  if (!p) return null;
                  return (
                    <div key={id} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-rose-100 text-xs">
                      <span className="font-semibold text-slate-800 truncate max-w-xs">{p.title}</span>
                      <span className="text-[10px] font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">OUT OF STOCK</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── INVENTORY TAB ────────────────────────────────────────────────── */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search product or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 font-medium"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 font-medium"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 font-medium"
            >
              <option value="name">Sort by Name</option>
              <option value="stock-low">Stock: Low → High</option>
              <option value="stock-high">Stock: High → Low</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing {filteredProducts.length} of {MARKAZ_PRODUCTS.length} products
          </div>

          {/* Product Inventory Table */}
          <div className="space-y-3">
            {filteredProducts.map((p) => {
              const currentStock = getStock(p.id);
              const isOut = currentStock <= 0;
              const isLow = currentStock > 0 && currentStock <= 5;
              const saved = saveSuccess[p.id];

              return (
                <div
                  key={p.id}
                  className={`bg-white rounded-2xl border shadow-xs overflow-hidden transition ${
                    isOut
                      ? 'border-rose-200'
                      : isLow
                      ? 'border-amber-200'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Product Info */}
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <img
                          src={p.images[1] || p.images[0]}
                          alt=""
                          className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-100 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = p.images[0];
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{p.title}</h4>
                          <div className="flex items-center space-x-2 mt-0.5">
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {p.skuCode}
                            </span>
                            <span className="text-[10px] text-slate-400">{p.category}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stock Badge */}
                      <div className="flex items-center space-x-3 shrink-0">
                        <div
                          className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1.5 ${
                            isOut
                              ? 'bg-rose-100 text-rose-700 border border-rose-200'
                              : isLow
                              ? 'bg-amber-100 text-amber-700 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {isOut ? (
                            <XCircle className="w-3.5 h-3.5" />
                          ) : isLow ? (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          <span>{currentStock} units</span>
                        </div>

                        {saved && (
                          <span className="text-[10px] text-emerald-600 font-black flex items-center space-x-1 animate-in fade-in">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Saved!</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stock Controls */}
                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                      {/* Quick Adjust */}
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Quick Adjust</span>
                        <input
                          type="number"
                          min="1"
                          value={stockAdjust[p.id] ?? '1'}
                          onChange={(e) =>
                            setStockAdjust((prev) => ({ ...prev, [p.id]: e.target.value }))
                          }
                          className="w-14 text-center text-xs bg-slate-50 border border-slate-200 rounded-lg py-1.5 outline-none focus:border-amber-400 font-bold"
                        />
                        <button
                          onClick={() => handleQuickAdjust(p.id, -1)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                          title="Deduct stock"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleQuickAdjust(p.id, 1)}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 transition cursor-pointer"
                          title="Add stock"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Set Exact Value */}
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Set Exact</span>
                        <input
                          type="number"
                          min="0"
                          placeholder={String(currentStock)}
                          value={stockEdits[p.id] ?? ''}
                          onChange={(e) =>
                            setStockEdits((prev) => ({ ...prev, [p.id]: e.target.value }))
                          }
                          className="w-20 text-center text-xs bg-slate-50 border border-slate-200 rounded-lg py-1.5 outline-none focus:border-amber-400 font-bold"
                        />
                        <button
                          onClick={() => handleStockSave(p.id)}
                          disabled={!stockEdits[p.id]}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white text-xs font-bold transition cursor-pointer flex items-center space-x-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Update</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── CATEGORIES TAB ───────────────────────────────────────────────── */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          {/* Add New Category */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <h3 className="text-sm font-black text-slate-950 mb-3 flex items-center space-x-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Add New Category</span>
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Category name, e.g. Men's Fragrances"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-400 font-medium"
              />
              <button
                onClick={handleAddCategory}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition cursor-pointer flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
            {catAddMsg && (
              <p
                className={`mt-2 text-xs font-bold ${
                  catAddMsg.includes('already') ? 'text-rose-500' : 'text-emerald-600'
                }`}
              >
                {catAddMsg}
              </p>
            )}
          </div>

          {/* Category List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-950">
                All Categories ({catList.length})
              </h3>
              <span className="text-xs text-slate-500">
                {catList.filter((c) => c.active).length} active
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {catList.map((cat) => {
                const productCount = MARKAZ_PRODUCTS.filter(
                  (p) => p.category === cat.slug
                ).length;
                return (
                  <div
                    key={cat.slug}
                    className={`flex items-center justify-between p-4 hover:bg-slate-50 transition ${
                      !cat.active ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          cat.active
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <Tag className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{cat.name}</h4>
                        <div className="text-[10px] text-slate-400 flex items-center space-x-2">
                          <span className="font-mono">{cat.slug}</span>
                          <span>•</span>
                          <span>{productCount} products</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Active / Inactive Toggle */}
                      <button
                        onClick={() => toggleCatActive(cat.slug)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition cursor-pointer ${
                          cat.active
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-rose-100 hover:text-rose-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-emerald-100 hover:text-emerald-700 border border-slate-200'
                        }`}
                      >
                        {cat.active ? 'Active' : 'Inactive'}
                      </button>

                      {/* Delete — only if no products */}
                      {productCount === 0 && (
                        <button
                          onClick={() => deleteCategory(cat.slug)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer border border-transparent hover:border-rose-200"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── ORDERS TAB ───────────────────────────────────────────────────── */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3">
              <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-500">No orders received yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Bar */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Total Orders: </span>
                  <strong className="text-slate-900">{orders.length}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Total Revenue: </span>
                  <strong className="text-emerald-700">{formatPrice(totalOrderValue)}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Processing: </span>
                  <strong className="text-amber-700">{processingOrders}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Delivered: </span>
                  <strong className="text-emerald-700">{orders.filter(o => o.status === 'Delivered').length}</strong>
                </div>
              </div>

              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-xs">
                      <span className="font-bold text-slate-500">Order:</span>{' '}
                      <strong className="font-mono text-slate-900">{order.id}</strong>
                      <span className="mx-2 text-slate-300">•</span>
                      <span className="text-slate-500">{order.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : order.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-sm font-black text-slate-950">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    {/* Shipping info */}
                    <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3">
                      <strong>{order.shippingAddress?.fullName}</strong>
                      {' — '}{order.shippingAddress?.phone}
                      {' — '}{order.shippingAddress?.address}, {order.shippingAddress?.city}
                    </div>

                    {/* Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 text-xs bg-slate-50 rounded-xl p-2.5 border border-slate-100"
                        >
                          <img
                            src={item.product.images[0]}
                            alt=""
                            className="w-10 h-10 object-contain rounded-lg bg-white border border-slate-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 truncate">{item.product.title}</p>
                            <p className="text-slate-500">
                              Qty: {item.quantity} × {formatPrice(item.product.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
