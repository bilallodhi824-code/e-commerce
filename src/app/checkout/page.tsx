'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Truck,
  CreditCard,
  ShieldCheck,
  Lock,
  Smartphone,
  ChevronLeft,
  AlertCircle
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useInventory } from '@/context/InventoryContext';
import { formatPrice } from '@/utils/formatters';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, discountAmount, shippingFee, total, clearCart } = useCart();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { deductStock } = useInventory();

  const [formData, setFormData] = useState({
    fullName: user?.name || 'Mohammad Ali',
    phone: user?.phone || '0300 1234567',
    address: 'Flat 402, Block 5, Clifton',
    city: 'Karachi',
    province: 'Sindh'
  });

  React.useEffect(() => {
    if (user) {
      queueMicrotask(() => {
        setFormData(prev => ({
          ...prev,
          fullName: user.name || prev.fullName,
          phone: user.phone || prev.phone,
        }));
      });
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'wallet'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) setFormError(null);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isAuthenticated) {
      openAuthModal(() => {
        // Retry placing order after sign in
        const btn = document.getElementById('submit-order-btn');
        if (btn) btn.click();
      });
      return;
    }

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setFormError('Please complete your full name, phone number, and delivery street address.');
      return;
    }

    setIsSubmitting(true);

    const orderId = 'BS-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: cart,
      subtotal,
      discountAmount,
      shippingFee,
      totalAmount: total,
      shippingAddress: formData,
      paymentMethod,
      status: 'Processing',
      estimatedDelivery: '2 - 3 Business Days'
    };

    try {
      localStorage.setItem('beshopable_last_order', JSON.stringify(newOrder));
      localStorage.setItem('daraz_last_order', JSON.stringify(newOrder));
      const existingOrders = JSON.parse(localStorage.getItem('beshopable_orders') || localStorage.getItem('daraz_orders') || '[]');
      localStorage.setItem('beshopable_orders', JSON.stringify([newOrder, ...existingOrders]));
      localStorage.setItem('daraz_orders', JSON.stringify([newOrder, ...existingOrders]));
      // ── LIVE INVENTORY DEDUCTION ──────────────────────────────────────
      deductStock(cart);
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      clearCart();
      router.push(`/order-success?orderId=${orderId}`);
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-200/90 shadow-xs space-y-4 my-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center mx-auto">
          <Truck className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-slate-950">Your Cart is Empty</h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Please add items to your cart before proceeding to the checkout portal.
        </p>
        <Link
          href="/products"
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      
      {/* Checkout Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link href="/cart" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-amber-700 transition">
          <ChevronLeft className="w-4 h-4" />
          <span>Return to Cart Review</span>
        </Link>
      </div>

      {/* Guest Sign-In Notice Banner */}
      {!isAuthenticated && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090e17] border border-amber-500/30 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-[#c5a059] border border-amber-500/20 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white font-sans">Customer Sign In Required</h4>
              <p className="text-xs text-slate-400">Please sign in to confirm order placement and enable real-time tracking.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openAuthModal()}
            className="px-5 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d8b87d] text-slate-950 text-xs font-black shrink-0 transition shadow-md cursor-pointer"
          >
            Sign In / Register
          </button>
        </div>
      )}

      {/* Error Alert Message */}
      {formError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
          <button
            onClick={() => setFormError(null)}
            className="text-rose-600 hover:text-rose-800 font-black text-xs ml-4 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Shipping Address & Payment Selection */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Step 1: Shipping Address */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-xl bg-[#090e17] text-[#c5a059] border border-white/10 text-xs font-black flex items-center justify-center">
                1
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-950 font-sans">
                Delivery &amp; Shipping Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Recipient Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-300 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-amber-600 font-semibold text-slate-900 transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Active Mobile Number *</label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-300 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-amber-600 font-semibold text-slate-900 transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Street Address / House / Flat *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-300 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-amber-600 font-semibold text-slate-900 transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">City *</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-300 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-amber-600 font-semibold text-slate-900 transition cursor-pointer"
                >
                  <option value="Karachi">Karachi</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Peshawar">Peshawar</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Province / State *</label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-300 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-amber-600 font-semibold text-slate-900 transition cursor-pointer"
                >
                  <option value="Sindh">Sindh</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Islamabad Capital">Islamabad Capital</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-xl bg-[#090e17] text-[#c5a059] border border-white/10 text-xs font-black flex items-center justify-center">
                2
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-950 font-sans">
                Select Payment Method
              </h3>
            </div>

            <div className="space-y-3">
              {/* Option 1: Cash on Delivery */}
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition ${
                  paymentMethod === 'cod'
                    ? 'border-amber-600 bg-amber-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full border-2 border-amber-600 flex items-center justify-center">
                    {paymentMethod === 'cod' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center space-x-2">
                      <span>Cash on Delivery (COD)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded">
                        Most Popular • Open-Parcel Check
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Inspect your package before payment at your doorstep anywhere in Pakistan
                    </p>
                  </div>
                </div>
                <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
              </label>

              {/* Option 2: Credit / Debit Card */}
              <label
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition ${
                  paymentMethod === 'card'
                    ? 'border-amber-600 bg-amber-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full border-2 border-amber-600 flex items-center justify-center">
                    {paymentMethod === 'card' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">
                      Credit / Debit Card
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Visa, MasterCard, PayPak, UnionPay (Instant 256-bit SSL encrypted)
                    </p>
                  </div>
                </div>
                <CreditCard className="w-5 h-5 text-[#b08745] shrink-0" />
              </label>

              {/* Option 3: Mobile Wallet */}
              <label
                onClick={() => setPaymentMethod('wallet')}
                className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition ${
                  paymentMethod === 'wallet'
                    ? 'border-amber-600 bg-amber-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full border-2 border-amber-600 flex items-center justify-center">
                    {paymentMethod === 'wallet' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">
                      Easypaisa / JazzCash Mobile Wallet
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Fast mobile checkout via Easypaisa or JazzCash direct payment
                    </p>
                  </div>
                </div>
                <Smartphone className="w-5 h-5 text-[#b08745] shrink-0" />
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Order Review & Submit */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4 sticky top-24">
            <h3 className="text-base font-black text-slate-950 pb-3 border-b border-slate-100">
              Order Summary ({cart.length} items)
            </h3>

            {/* Item Previews */}
            <div className="space-y-3 max-h-48 overflow-y-auto divide-y divide-slate-100 pr-1">
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.selectedColor || ''}-${item.selectedSize || ''}`} className="pt-2 first:pt-0 flex items-center space-x-3">
                  <img
                    src={item.product.images[0]}
                    alt=""
                    className="w-10 h-10 object-contain rounded-lg bg-slate-50 border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-bold text-slate-800 truncate">{item.product.title}</p>
                    <div className="flex flex-wrap items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                      {item.selectedColor && (
                        <span className="bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 font-medium">
                          {item.selectedColor}
                        </span>
                      )}
                      {item.selectedSize && (
                        <span className="bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 font-medium">
                          {item.selectedSize}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px] mt-0.5">
                      <span>Qty: {item.quantity}</span>
                      <span className="font-bold text-slate-900">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Voucher Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-slate-900">
                  {shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-slate-200">
                <span>Total Due</span>
                <span className="text-slate-950 font-black text-lg">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Validation Error Banner */}
            {formError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-bold flex items-start space-x-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              id="submit-order-btn"
              disabled={isSubmitting}
              className="w-full bg-[#090e17] hover:bg-[#162232] text-[#c5a059] hover:text-[#d8b87d] font-black text-sm py-4 rounded-2xl shadow-xl shadow-slate-950/20 flex items-center justify-center space-x-2 transition disabled:opacity-50 cursor-pointer active:scale-[0.98] border border-amber-500/30"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#c5a059]" />
                  <span>Place Order Now ({formatPrice(total)})</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Genuine Items • Open-Parcel Inspection Guarantee</span>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
