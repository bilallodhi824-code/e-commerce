'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Package,
  MapPin,
  Truck,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { formatPrice } from '@/utils/formatters';
import { getWhatsAppUrl } from '@/utils/whatsapp';
import { Order, CartItem } from '@/types';
import { MARKAZ_PRODUCTS } from '@/data/markazCatalog';

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [orderId, setOrderId] = useState(initialId);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const performSearch = (id: string) => {
    setErrorMsg(null);
    if (!id.trim()) return;

    setIsLoading(true);
    const cleanId = id.trim().toUpperCase();

    // 1. Check local storage for recent and historical orders
    try {
      const lastOrderStr = localStorage.getItem('beshopable_last_order') || localStorage.getItem('daraz_last_order');
      if (lastOrderStr) {
        const lastOrder = JSON.parse(lastOrderStr);
        if (lastOrder.id?.toUpperCase() === cleanId || lastOrder.orderId?.toUpperCase() === cleanId) {
          setSearchedOrder(lastOrder);
          setIsLoading(false);
          return;
        }
      }

      const allOrdersStr = localStorage.getItem('beshopable_orders') || localStorage.getItem('daraz_orders');
      if (allOrdersStr) {
        const allOrders = JSON.parse(allOrdersStr) as Order[];
        const match = allOrders.find(
          (o) => (o.id || '').toUpperCase() === cleanId
        );
        if (match) {
          setSearchedOrder(match);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error('Error reading order storage:', err);
    }

    // 2. Realistic Simulated Order for demo/testing
    const sampleIds = ['BS-849201', 'BS-102938', 'DZ-849201', 'BS-928412'];
    if (sampleIds.includes(cleanId) || cleanId.startsWith('BS-') || cleanId.startsWith('DZ-') || cleanId.startsWith('DG-')) {
      const simulatedOrder: Order = {
        id: cleanId,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: cleanId === 'BS-849201' ? 'Dispatched' : 'Processing',
        estimatedDelivery: '2 - 3 Business Days via Leopards Express',
        courierPartner: 'Leopards Express Nationwide Courier',
        trackingNumber: 'LEO-' + Math.floor(10000000 + Math.random() * 90000000),
        shippingAddress: {
          fullName: 'Mohammad Ali',
          phone: '+92 300 1234567',
          address: 'Flat 402, Block 5, Clifton',
          city: 'Karachi',
          province: 'Sindh'
        },
        paymentMethod: 'cod',
        items: [
          {
            product: MARKAZ_PRODUCTS[0],
            quantity: 1
          },
          {
            product: MARKAZ_PRODUCTS[1],
            quantity: 1
          }
        ],
        subtotal: MARKAZ_PRODUCTS[0].price + MARKAZ_PRODUCTS[1].price,
        discountAmount: 500,
        shippingFee: 0,
        totalAmount: MARKAZ_PRODUCTS[0].price + MARKAZ_PRODUCTS[1].price - 500
      };

      setSearchedOrder(simulatedOrder);
      setIsLoading(false);
      return;
    }

    setSearchedOrder(null);
    setErrorMsg(`No record found for tracking reference "${id}". Please verify your Order ID (e.g. BS-849201) or check your confirmation SMS/email.`);
    setIsLoading(false);
  };

  useEffect(() => {
    queueMicrotask(() => {
      if (initialId) {
        performSearch(initialId);
      } else {
        try {
          const lastOrderStr = localStorage.getItem('beshopable_last_order') || localStorage.getItem('daraz_last_order');
          if (lastOrderStr) {
            const last = JSON.parse(lastOrderStr);
            if (last?.id) {
              setOrderId(last.id);
              performSearch(last.id);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    });
  }, [initialId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(orderId);
  };

  const stages = [
    { title: 'Order Placed', desc: 'Booking confirmed & logged in system' },
    { title: 'Verified', desc: 'Payment verified & inventory allocated' },
    { title: 'Dispatched', desc: 'Handed over to Leopards Express Logistics' },
    { title: 'Out for Delivery', desc: 'Courier agent on route to doorstep' },
    { title: 'Delivered', desc: 'Parcel safely delivered with COD receipt' },
  ];

  const getActiveStageIndex = (status?: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('delivered')) return 4;
    if (s.includes('out') || s.includes('route')) return 3;
    if (s.includes('dispatch') || s.includes('shipped') || s.includes('transit')) return 2;
    if (s.includes('verified') || s.includes('process')) return 1;
    return 0;
  };

  const activeStageIndex = searchedOrder ? getActiveStageIndex(searchedOrder.status) : 2;

  const whatsappInquiryUrl = getWhatsAppUrl(
    `Hello BeShopable Support! I need status updates regarding my Order ID: ${orderId || 'BS-849201'}`
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-10 animate-in fade-in duration-300 pb-16">
      
      {/* Header - Signature Cursive Headline */}
      <div className="text-center space-y-1.5">
        <span className="font-cursive text-amber-500 text-3xl sm:text-4xl block">
          Real-Time Logistics
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-950 uppercase tracking-tight">
          Order Tracking
        </h1>
        <div className="w-12 h-0.5 bg-blue-600 mx-auto mt-2" />
      </div>

      {/* Search Bar Input */}
      <div className="max-w-lg mx-auto space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter Order ID (e.g. BS-849201)"
              required
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-xs transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 sm:px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5 disabled:opacity-60 cursor-pointer"
          >
            <span>{isLoading ? 'Tracking...' : 'Track'}</span>
          </button>
        </form>

        {/* Quick Sample Button */}
        <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-500">
          <span>Quick Sample:</span>
          <button
            type="button"
            onClick={() => {
              setOrderId('BS-849201');
              performSearch('BS-849201');
            }}
            className="font-bold text-blue-600 hover:underline bg-blue-50 px-2.5 py-0.5 rounded cursor-pointer"
          >
            BS-849201
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="max-w-lg mx-auto bg-rose-50 border border-rose-200 text-rose-800 text-xs p-4 rounded-2xl flex items-start space-x-3 shadow-xs">
          <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h5 className="font-bold">Order Not Located</h5>
            <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Order Results Presentation */}
      {searchedOrder && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Progress Timeline Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Package className="w-4.5 h-4.5 text-blue-600" />
                <span>Tracking: {searchedOrder.id || searchedOrder.orderId}</span>
              </h3>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                searchedOrder.status === 'Delivered'
                  ? 'bg-emerald-100 text-emerald-800'
                  : searchedOrder.status === 'Dispatched' || searchedOrder.status === 'Out for Delivery' || searchedOrder.status === 'Shipped'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                ● {searchedOrder.status || 'Processing'}
              </span>
            </div>

            {/* Step-by-Step Progress Timeline */}
            <div className="relative pl-6 sm:pl-0 sm:flex sm:justify-between items-start pt-2">
              <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-slate-200 sm:hidden" />
              
              {stages.map((stage, idx) => {
                const isCompleted = idx < activeStageIndex;
                const isActive = idx === activeStageIndex;

                return (
                  <div
                    key={idx}
                    className="relative sm:flex sm:flex-col sm:items-center text-left sm:text-center pb-7 sm:pb-0 sm:flex-1 last:pb-0"
                  >
                    <div className="absolute left-[-21px] sm:relative sm:left-0 z-10 flex items-center justify-center">
                      {isCompleted ? (
                        <div className="p-1 bg-blue-600 rounded-full text-white shadow-xs">
                          <CheckCircle2 className="w-4 h-4 fill-current" />
                        </div>
                      ) : isActive ? (
                        <div className="w-6 h-6 rounded-full bg-blue-600 border-4 border-blue-100 flex items-center justify-center text-[8px] font-black text-white shadow-md animate-pulse">
                          ●
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-200 border-2 border-slate-100" />
                      )}
                    </div>

                    <div className="sm:mt-3 pl-3 sm:pl-0 space-y-0.5">
                      <h4 className={`text-xs font-bold uppercase tracking-wider ${
                        isActive
                          ? 'text-blue-600 font-black'
                          : isCompleted
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}>
                        {stage.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed max-w-[130px] sm:mx-auto">
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details Grid: Destination & Courier Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Delivery Destination */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Destination</span>
              </h4>
              <div className="text-xs text-slate-600 space-y-1">
                <p>
                  <strong className="text-slate-900">Recipient:</strong>{' '}
                  {searchedOrder.shippingAddress?.fullName || 'Customer'}
                </p>
                <p>
                  <strong className="text-slate-900">Address:</strong>{' '}
                  {searchedOrder.shippingAddress?.address || 'Street Address'},{' '}
                  {searchedOrder.shippingAddress?.city || 'Pakistan'},{' '}
                  {searchedOrder.shippingAddress?.province || ''}
                </p>
                <p>
                  <strong className="text-slate-900">Contact:</strong>{' '}
                  {searchedOrder.shippingAddress?.phone || '+92 300 1234567'}
                </p>
              </div>
            </div>

            {/* Courier & Dispatch Info */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center space-x-1.5">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Logistics Courier</span>
              </h4>
              <div className="text-xs text-slate-600 space-y-1">
                <p>
                  <strong className="text-slate-900">Courier Partner:</strong>{' '}
                  {searchedOrder.courierPartner || 'Leopards Express Courier (TCS / Leopard)'}
                </p>
                <p>
                  <strong className="text-slate-900">Courier Waybill:</strong>{' '}
                  <span className="font-mono text-blue-600 font-bold">
                    {searchedOrder.trackingNumber || 'LEO-7489201'}
                  </span>
                </p>
                <p>
                  <strong className="text-slate-900">Payment Mode:</strong>{' '}
                  <span className="font-semibold text-slate-800">
                    {searchedOrder.paymentMethod || 'Cash on Delivery (COD)'}
                  </span>
                </p>
              </div>
            </div>

          </div>

          {/* Package Contents */}
          {Array.isArray(searchedOrder.items) && searchedOrder.items.length > 0 && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span>Package Contents ({searchedOrder.items.length} items)</span>
                </h4>
                <span className="text-xs font-black text-slate-900">
                  Total: {formatPrice(searchedOrder.totalAmount || searchedOrder.total || 0)}
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {searchedOrder.items.map((it: CartItem, idx: number) => {
                  const product = it.product || it;
                  return (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-3 min-w-0">
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80'}
                          alt=""
                          className="w-12 h-12 object-contain rounded-xl bg-slate-50 border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-slate-900 truncate max-w-sm">
                            {product.title}
                          </h5>
                          <span className="text-[11px] text-slate-500">
                            Qty: {it.quantity || 1} • {formatPrice(product.price || 0)} each
                          </span>
                        </div>
                      </div>

                      <div className="text-xs font-bold text-slate-900 text-right shrink-0">
                        {formatPrice((product.price || 0) * (it.quantity || 1))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Inline WhatsApp Support Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md">
                <WhatsAppIcon className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-950">
                  Need Help With Your Shipment?
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Chat directly with our dispatch team on WhatsApp for real-time rider updates.
                </p>
              </div>
            </div>

            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs px-5 py-3 rounded-xl shadow-md transition self-start sm:self-auto shrink-0 cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>Message on WhatsApp</span>
            </a>
          </div>

        </div>
      )}

    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400 text-xs">Loading Order Tracking...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}
