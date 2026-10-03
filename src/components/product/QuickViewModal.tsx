'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X, Star, ShoppingBag, CheckCircle2, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/utils/formatters';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { getProductWhatsAppUrl } from '@/utils/whatsapp';
import { IconFlashSale, IconMarkazVerified, IconParcelInspection } from '@/components/ui/CustomIcons';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors ? product.colors[0] : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.sizes ? product.sizes[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    if (product) {
      queueMicrotask(() => {
        setSelectedImage(0);
        setSelectedColor(product.colors ? product.colors[0] : undefined);
        setSelectedSize(product.sizes ? product.sizes[0] : undefined);
        setQuantity(1);
      });
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      openAuthModal(() => {
        addToCart(product, quantity, selectedColor, selectedSize);
        setAddedNotice(true);
        setTimeout(() => {
          setAddedNotice(false);
          setIsCartOpen(true);
        }, 600);
      });
      return;
    }

    addToCart(product, quantity, selectedColor, selectedSize);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
      setIsCartOpen(true);
    }, 600);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    onClose();
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#070a12]/70 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 border border-slate-200">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Gallery Column */}
            <div className="p-6 bg-slate-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100">
              <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden bg-white border border-slate-200">
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-contain p-4"
                />
                {product.discount > 0 && (
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow-xs">
                    -{product.discount}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 mt-4 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-14 h-14 rounded-xl border-2 overflow-hidden bg-white transition cursor-pointer ${
                        selectedImage === idx ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Column */}
            <div className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black text-[#b08745] uppercase tracking-wider bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded">
                      {product.brand}
                    </span>
                    {product.skuCode && (
                      <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {product.skuCode}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-emerald-800 font-bold flex items-center space-x-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <IconMarkazVerified className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Direct Sourced</span>
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-950 leading-snug">
                  {product.title}
                </h3>

                {/* Sourcing & COD Badge */}
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  {product.wholesaleSource && (
                    <span className="text-slate-600 font-medium">
                      Hub: <strong className="text-slate-800">{product.wholesaleSource}</strong>
                    </span>
                  )}
                  {product.isCodAvailable && (
                    <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                      <IconParcelInspection className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Open-Parcel Check Before Payment</span>
                    </span>
                  )}
                </div>

                {/* Rating & Sold count */}
                <div className="flex items-center space-x-2 text-xs">
                  <div className="flex items-center text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-slate-900">{product.rating}</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{product.reviewsCount} Reviews</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{product.soldCount} Delivered</span>
                </div>

                {/* Price Display */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 flex items-baseline justify-between">
                  <div className="flex items-baseline space-x-3">
                    <span className="text-2xl font-black text-slate-950">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {product.resellerMargin && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-2 py-0.5 rounded">
                      Wholesale Margin: Rs. {product.resellerMargin}
                    </span>
                  )}
                </div>

                {/* Color Variations */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Select Color: <span className="text-blue-600">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setSelectedColor(col)}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition cursor-pointer ${
                            selectedColor === col
                              ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Variations */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Select Size: <span className="text-blue-600">{selectedSize}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition cursor-pointer ${
                            selectedSize === sz
                              ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Quantity:</label>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 transition font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-4 py-1.5 text-xs font-black text-slate-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 transition font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-slate-400">
                      {product.stock} items available
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                {addedNotice ? (
                  <div className="bg-emerald-50 text-emerald-900 p-3 rounded-xl text-center text-xs font-bold flex items-center justify-center space-x-2 border border-emerald-200 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Item added to your cart!</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="bg-[#090e17] hover:bg-[#162232] text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs border border-white/10 active:scale-[0.98]"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#c5a059]" />
                      <span>Add to Cart</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="bg-[#0f172a] hover:bg-[#1e293b] text-amber-300 font-bold text-xs py-3 rounded-xl transition shadow-md flex items-center justify-center space-x-1.5 active:scale-[0.98] cursor-pointer border border-amber-500/30"
                    >
                      <IconFlashSale className="w-4 h-4 text-[#c5a059]" />
                      <span>Instant Checkout</span>
                    </button>
                  </div>
                )}

                {/* Direct WhatsApp Quick Order */}
                <a
                  href={getProductWhatsAppUrl(
                    product.title,
                    product.id,
                    product.price * quantity,
                    selectedColor,
                    selectedSize,
                    product.skuCode
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-xs flex items-center justify-center space-x-2 transition active:scale-[0.98] cursor-pointer"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                  <span>Order via WhatsApp (0300 1129959)</span>
                </a>

                <div className="text-center pt-1">
                  <Link
                    href={`/product/${product.id}`}
                    onClick={onClose}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-amber-700 transition"
                  >
                    <span>View full wholesale specs &amp; certifications</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
