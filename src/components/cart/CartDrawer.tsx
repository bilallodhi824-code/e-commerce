'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck, Sparkles } from 'lucide-react';
import { IconVoucherTicket } from '@/components/ui/CustomIcons';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/formatters';

interface CartDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen: propIsOpen, onClose: propOnClose }) => {
  const router = useRouter();
  const {
    cart,
    isCartOpen: contextIsOpen,
    setIsCartOpen: contextSetIsOpen,
    removeFromCart,
    updateQuantity,
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

  const isOpen = propIsOpen !== undefined ? propIsOpen : contextIsOpen;
  
  const handleClose = () => {
    if (propOnClose) propOnClose();
    contextSetIsOpen(false);
  };

  if (!isOpen) return null;

  const handleQuickCoupon = (code: string) => {
    applyVoucher(code);
  };

  const handleProceedToCheckout = () => {
    handleClose();
    router.push('/checkout');
  };

  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-[#070a12]/70 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900 leading-none">
                  Shopping Cart
                </h2>
                <span className="text-[11px] font-bold text-slate-500">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} selected
                </span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Banner */}
          <div className="bg-blue-50/80 p-3.5 border-b border-blue-100">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
              <Truck className="w-4 h-4 text-blue-600 shrink-0" />
              {remainingForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-blue-600">{formatPrice(remainingForFreeShipping)}</strong> more for <strong>FREE Delivery!</strong>
                </span>
              ) : (
                <span className="text-blue-900 font-extrabold flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-current" />
                  <span>Congratulations! Free Delivery Unlocked</span>
                </span>
              )}
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Your cart is empty</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Explore our flagship tech gear, luxury watches, and signature lifestyle collections.
                  </p>
                </div>
                <Link
                  href="/products"
                  onClick={handleClose}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-md transition"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.product.id}-${item.selectedColor || ''}-${item.selectedSize || ''}`} className="pt-3 first:pt-0 flex space-x-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-16 h-16 object-contain rounded-xl bg-slate-50 border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.product.id}`}
                          onClick={handleClose}
                          className="text-xs font-bold text-slate-900 hover:text-blue-600 transition line-clamp-1"
                        >
                          {item.product.title}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                          className="text-slate-400 hover:text-rose-500 transition p-0.5 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[10px] text-slate-500 font-medium">
                        {item.selectedColor && (
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            Color: <strong className="text-slate-800">{item.selectedColor}</strong>
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            Size: <strong className="text-slate-800">{item.selectedSize}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1.5 bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1, item.selectedColor, item.selectedSize)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-white rounded transition cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black text-slate-900 w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1, item.selectedColor, item.selectedSize)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-white rounded transition cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-slate-950">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 space-y-3">
              
              {/* Quick Coupon Codes */}
              <div>
                <div className="flex items-center justify-between mb-1.5 text-[11px]">
                  <span className="font-bold text-slate-600 flex items-center space-x-1">
                    <Tag className="w-3 h-3 text-blue-600" />
                    <span>Promo Vouchers</span>
                  </span>
                  {appliedVoucher ? (
                    <button
                      onClick={removeVoucher}
                      className="text-rose-500 hover:underline font-bold text-[10px] cursor-pointer"
                    >
                      Remove ({appliedVoucher})
                    </button>
                  ) : null}
                </div>

                {!appliedVoucher ? (
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleQuickCoupon('BESHOPABLE20')}
                      className="bg-white border border-blue-300 text-blue-600 hover:bg-blue-50 px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center space-x-1 shadow-xs transition cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500 fill-current" />
                      <span>BESHOPABLE20 (20% OFF)</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg p-2 text-[11px] font-bold flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <IconVoucherTicket className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Privilege Code {appliedVoucher} Applied</span>
                    </span>
                    <span className="text-emerald-800 font-extrabold">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
              </div>

              {/* Price Summary Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-blue-700 font-bold">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-slate-800">
                    {shippingFee === 0 ? <strong className="text-blue-700">FREE</strong> : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-slate-950 text-base font-black">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm py-3.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition cursor-pointer active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
