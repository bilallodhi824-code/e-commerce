'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, Tag, Truck, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/formatters';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    appliedVoucher,
    applyVoucher,
    removeVoucher,
    totalItemsCount,
    freeShippingThreshold,
    remainingForFreeShipping
  } = useCart();

  const [voucherInput, setVoucherInput] = useState('');
  const [voucherMsg, setVoucherMsg] = useState<{ success: boolean; message: string } | null>(null);

  const handleVoucherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (voucherInput) {
      const res = applyVoucher(voucherInput);
      setVoucherMsg(res);
      if (res.success) setVoucherInput('');
    }
  };

  const handleQuickVoucher = (code: string) => {
    const res = applyVoucher(code);
    setVoucherMsg(res);
  };

  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 sm:p-14 text-center max-w-lg mx-auto border border-slate-200/90 shadow-xs space-y-4 my-8">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-black text-slate-950">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          You have no items in your cart. Discover active formulations, tech gadgets, and lifestyle essentials on BeShopable!
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-8 py-3 rounded-xl shadow-lg shadow-blue-600/25 transition"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-cursive text-amber-500 text-2xl block leading-none">
            Selected Items
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-950">
            Shopping Cart ({totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-500 hover:underline flex items-center space-x-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Free Shipping Meter */}
          <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-100 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
              <Truck className="w-4 h-4 text-blue-600 shrink-0" />
              {remainingForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-blue-600">{formatPrice(remainingForFreeShipping)}</strong> more to qualify for <strong>FREE Delivery!</strong>
                </span>
              ) : (
                <span className="text-blue-900 font-extrabold flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-current" />
                  <span>Congratulations! Your order qualifies for Free Nationwide Delivery.</span>
                </span>
              )}
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items Container */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs divide-y divide-slate-100">
            {cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedColor || ''}-${item.selectedSize || ''}`}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4 min-w-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain p-2 rounded-2xl bg-slate-50 border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.product.id}`}
                      className="text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 transition line-clamp-2"
                    >
                      {item.product.title}
                    </Link>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span>Brand: <strong className="text-slate-700">{item.product.brand}</strong></span>
                      {item.selectedColor && (
                        <>
                          <span>•</span>
                          <span>Color: <strong className="text-slate-700">{item.selectedColor}</strong></span>
                        </>
                      )}
                      {item.selectedSize && (
                        <>
                          <span>•</span>
                          <span>Size: <strong className="text-slate-700">{item.selectedSize}</strong></span>
                        </>
                      )}
                    </div>

                    <div className="text-xs sm:text-sm font-black text-slate-950 mt-1 sm:hidden">
                      {formatPrice(item.product.price)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end sm:space-x-6">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1, item.selectedColor, item.selectedSize)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 transition font-bold cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 py-1.5 text-xs font-black text-slate-900 w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1, item.selectedColor, item.selectedSize)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 transition font-bold cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="hidden sm:block text-right min-w-[90px]">
                    <div className="text-sm font-black text-slate-950">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {formatPrice(item.product.price)} each
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                    className="text-slate-400 hover:text-rose-500 transition p-2 rounded-xl hover:bg-rose-50 cursor-pointer"
                    title="Remove from Cart"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-5">
            <h3 className="text-base font-black text-slate-950 pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            {/* Voucher Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span>Have a Discount Coupon?</span>
              </label>

              {!appliedVoucher ? (
                <>
                  <form onSubmit={handleVoucherSubmit} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. BESHOPABLE20"
                      value={voucherInput}
                      onChange={(e) => setVoucherInput(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 uppercase text-xs px-3 py-2 rounded-xl outline-none focus:border-blue-600 font-bold"
                    />
                    <button
                      type="submit"
                      className="bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                  <button
                    type="button"
                    onClick={() => handleQuickVoucher('BESHOPABLE20')}
                    className="w-full text-left text-[11px] text-blue-600 bg-blue-50 hover:bg-blue-100/80 p-2 rounded-xl font-bold flex items-center justify-between border border-blue-200 transition cursor-pointer"
                  >
                    <span>Tap to apply: <strong>BESHOPABLE20</strong></span>
                    <span className="text-slate-950 font-black">20% OFF</span>
                  </button>
                </>
              ) : (
                <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-xl flex items-center justify-between text-xs text-blue-900 font-bold">
                  <span>Coupon &quot;{appliedVoucher}&quot; Applied!</span>
                  <button onClick={removeVoucher} className="text-rose-500 hover:underline text-[10px] cursor-pointer">
                    Remove
                  </button>
                </div>
              )}

              {voucherMsg && (
                <p className={`text-[11px] font-bold ${voucherMsg.success ? 'text-blue-800' : 'text-rose-500'}`}>
                  {voucherMsg.message}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal ({totalItemsCount} items)</span>
                <span className="font-bold text-slate-800">{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-blue-700 font-bold">
                  <span>Promo Discount ({appliedVoucher})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Nationwide Shipping</span>
                <span className="font-bold text-slate-800">
                  {shippingFee === 0 ? <span className="text-blue-700 font-bold">FREE</span> : formatPrice(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Due</span>
                <span className="text-blue-600 font-black">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm py-4 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition block text-center"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Security Guarantee */}
            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Safe &amp; Encrypted SSL Checkout</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
