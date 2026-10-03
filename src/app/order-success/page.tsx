'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, Truck, ShoppingBag, Clock } from 'lucide-react';
import { Order } from '@/types';
import { formatPrice } from '@/utils/formatters';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'BS-849201';
  const [order] = useState<Order | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('beshopable_last_order') || localStorage.getItem('daraz_last_order');
        return saved ? JSON.parse(saved) : null;
      } catch (e) {
        console.error(e);
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6 my-6 sm:my-10 pb-16">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl text-center space-y-5">
        
        {/* Success Icon */}
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto border border-blue-200 shadow-xs animate-bounce">
          <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
        </div>

        <div>
          <span className="font-cursive text-amber-500 text-3xl block">
            Booking Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
            Thank You For Your Order!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Order Reference Code: <strong className="text-slate-900 font-mono font-bold">{orderId}</strong>
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 text-left text-xs space-y-3">
          <div className="flex justify-between border-b border-slate-200/60 pb-2.5">
            <span className="text-slate-500 font-medium">Estimated Arrival:</span>
            <span className="font-bold text-slate-900 flex items-center space-x-1">
              <Truck className="w-3.5 h-3.5 text-blue-600" />
              <span>{order?.estimatedDelivery || '2 - 3 Business Days'}</span>
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-200/60 pb-2.5">
            <span className="text-slate-500 font-medium">Delivery Method:</span>
            <span className="font-bold text-slate-900 uppercase">
              {order?.paymentMethod === 'cod'
                ? 'Cash on Delivery'
                : order?.paymentMethod === 'card'
                ? 'Credit / Debit Card'
                : 'Mobile Wallet'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Total Amount:</span>
            <span className="font-black text-blue-600 text-sm">
              {formatPrice(order?.totalAmount || 0)}
            </span>
          </div>
        </div>

        {/* Delivery Progress Steps */}
        <div className="pt-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left mb-3">
            Shipment Timeline
          </h4>
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-900 border border-blue-200">
              <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-blue-600" />
              <span>Order Placed</span>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="w-4 h-4 mx-auto mb-1 text-amber-600" />
              <span>Processing</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 text-slate-400 border border-slate-200">
              <Truck className="w-4 h-4 mx-auto mb-1" />
              <span>Dispatched</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 text-slate-400 border border-slate-200">
              <Package className="w-4 h-4 mx-auto mb-1" />
              <span>Delivered</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            href={`/order-tracking?id=${orderId}`}
            className="flex-1 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs py-3.5 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <Package className="w-4 h-4" />
            <span>Track Order Live</span>
          </Link>

          <Link
            href="/"
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3.5 rounded-xl transition shadow-md shadow-blue-600/30 flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 text-sm">Processing Confirmation...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
