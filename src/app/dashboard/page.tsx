'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  Truck,
  ChevronRight,
  Settings,
  LogOut,
  ShieldCheck,
  User,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';
import { Order } from '@/types';
import { formatPrice } from '@/utils/formatters';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();

  const [orders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedOrders =
          localStorage.getItem('beshopable_orders') || localStorage.getItem('daraz_orders');
        return savedOrders ? JSON.parse(savedOrders) : [];
      } catch (e) {
        console.error(e);
        return [];
      }
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<'all' | 'processing' | 'shipped' | 'delivered'>(
    'all'
  );

  // Redirect if not logged in
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'all') return true;
    return o.status.toLowerCase() === activeTab;
  });

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const avatarLetter = user?.name?.[0]?.toUpperCase() || 'U';

  return (
    <div className="space-y-6 pb-16 md:pb-12">

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#070a12] via-[#0f172a] to-[#1e293b] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-blue-600/30">
                {avatarLetter}
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h2 className="text-xl font-black">{user?.name || 'Customer'}</h2>
                {isAdmin ? (
                  <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/40 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Admin</span>
                  </span>
                ) : (
                  <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/40">
                    VIP Member
                  </span>
                )}
              </div>
              <div className="mt-1 space-y-0.5">
                <p className="text-xs text-slate-300 flex items-center space-x-1.5">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{user?.email}</span>
                </p>
                {user?.phone && (
                  <p className="text-xs text-slate-300 flex items-center space-x-1.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{user.phone}</span>
                  </p>
                )}
                <p className="text-xs text-slate-400 flex items-center space-x-1.5">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>Member since {user?.memberSince}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Stats & Actions */}
          <div className="flex items-center space-x-4 text-xs text-slate-300 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-around md:justify-start flex-wrap gap-4">
            <div className="text-center">
              <span className="text-xl font-black text-blue-400 block">{orders.length}</span>
              <span className="text-[11px] text-slate-400 font-medium">Total Orders</span>
            </div>
            <div className="text-center">
              <span className="text-xl font-black text-amber-400 block">
                {orders.filter((o) => o.status === 'Processing').length}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">In Transit</span>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/order-tracking"
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1 shadow-sm transition"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Track Orders</span>
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center space-x-1 shadow-sm transition"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-xl bg-slate-700 hover:bg-rose-600 text-white font-bold text-xs flex items-center space-x-1 shadow-sm transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Quick Link */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-amber-900/40 to-amber-800/20 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-black text-amber-200">Admin Access Enabled</h4>
              <p className="text-xs text-amber-400/70">Manage inventory, categories & orders</p>
            </div>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-black rounded-xl transition"
          >
            Go to Admin Panel →
          </Link>
        </div>
      )}

      {/* Orders Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-black text-slate-950">
              {user?.name ? `${user.name}'s Orders` : 'Order History'} & Tracking
            </h3>
          </div>

          {/* Status Tabs */}
          <div className="flex space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto">
            {(['all', 'processing', 'shipped', 'delivered'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize transition cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black text-slate-800">No orders found</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {activeTab === 'all'
                ? "You haven't placed any orders yet."
                : `No ${activeTab} orders found.`}
            </p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-xs transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50 space-y-4 hover:border-blue-400 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/60 gap-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-500">Order:</span>{' '}
                    <strong className="text-slate-900 font-mono">{order.id}</strong>
                    <span className="mx-2 text-slate-300">•</span>
                    <span className="text-slate-500">{order.date}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="font-black text-slate-950">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-3 bg-white p-2.5 rounded-xl border border-slate-200/60"
                    >
                      <img
                        src={item.product.images[0]}
                        alt=""
                        className="w-12 h-12 object-contain rounded-lg bg-slate-50 shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <h5 className="font-bold text-slate-900 truncate">{item.product.title}</h5>
                        <div className="flex justify-between text-slate-500 text-[11px] mt-0.5">
                          <span>Qty: {item.quantity}</span>
                          <span className="font-bold text-slate-800">
                            {formatPrice(item.product.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking Footer */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                  <div className="flex items-center space-x-1.5">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    <span>
                      Est. Delivery:{' '}
                      <strong className="text-slate-800">{order.estimatedDelivery}</strong>
                    </span>
                  </div>
                  <Link
                    href={`/order-tracking?id=${order.id}`}
                    className="text-blue-600 hover:underline font-bold flex items-center space-x-1"
                  >
                    <span>Track Live</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Info Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
        <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-100">
          <User className="w-5 h-5 text-slate-600" />
          <h3 className="text-sm font-black text-slate-950">Account Information</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 block mb-0.5">Full Name</span>
            <span className="font-bold text-slate-900">{user?.name || '—'}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 block mb-0.5">Email</span>
            <span className="font-bold text-slate-900">{user?.email || '—'}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 block mb-0.5">Phone</span>
            <span className="font-bold text-slate-900">{user?.phone || 'Not provided'}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 block mb-0.5">Account Type</span>
            <span className={`font-bold ${isAdmin ? 'text-amber-600' : 'text-blue-600'}`}>
              {isAdmin ? 'Administrator' : 'Customer'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
