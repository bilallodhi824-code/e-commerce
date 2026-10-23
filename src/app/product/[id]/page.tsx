'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  RefreshCw,
  ChevronRight,
  CheckCircle2,
  Check
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { MARKAZ_PRODUCTS } from '@/data/markazCatalog';
import { CATEGORIES } from '@/data/categories';
import { getProductById, getRelatedProducts } from '@/services/productService';
import { Product } from '@/types';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useInventory } from '@/context/InventoryContext';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductStickyBar } from '@/components/product/ProductStickyBar';
import { formatPrice } from '@/utils/formatters';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { getProductWhatsAppUrl } from '@/utils/whatsapp';
import {
  IconFlashSale,
  IconMarkazVerified,
  IconParcelInspection,
  IconCashOnDelivery,
  IconDirectFactory
} from '@/components/ui/CustomIcons';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const decodedId = decodeURIComponent(productId || '').trim().toLowerCase();

  const initialProduct = MARKAZ_PRODUCTS.find(
    (p) =>
      p.id.toLowerCase() === decodedId ||
      p.skuCode?.toLowerCase() === decodedId ||
      p.id.replace(/^mkz-/, '').toLowerCase() === decodedId.replace(/^mkz-/, '') ||
      (p.skuCode && decodedId.includes(p.skuCode.toLowerCase()))
  ) || null;

  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [isLoading, setIsLoading] = useState(!initialProduct);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>(() =>
    initialProduct
      ? MARKAZ_PRODUCTS.filter((p) => p.category === initialProduct.category && p.id !== initialProduct.id).slice(0, 4)
      : MARKAZ_PRODUCTS.slice(0, 4)
  );

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    initialProduct?.colors ? initialProduct.colors[0] : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    initialProduct?.sizes ? initialProduct.sizes[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');

  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { getStock, isOutOfStock } = useInventory();

  const liveStock = product ? getStock(product.id) : 0;
  const outOfStock = product ? isOutOfStock(product.id) : false;

  React.useEffect(() => {
    if (productId) {
      queueMicrotask(() => {
        setIsLoading(true);
        getProductById(productId).then((found) => {
          if (found) {
            setProduct(found);
            setSelectedImage(0);
            setSelectedColor(found.colors ? found.colors[0] : undefined);
            setSelectedSize(found.sizes ? found.sizes[0] : undefined);
            getRelatedProducts(found.id, found.category).then(setRelatedProducts);
          } else {
            setProduct(null);
          }
          setIsLoading(false);
        });
      });
    }
  }, [productId]);

  const isLiked = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!product || outOfStock) return;
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
      setIsCartOpen(true);
    }, 600);
  };

  const handleBuyNow = () => {
    if (!product || outOfStock) return;
    if (!isAuthenticated) {
      openAuthModal(() => {
        addToCart(product, quantity, selectedColor, selectedSize);
        router.push('/checkout');
      });
      return;
    }

    addToCart(product, quantity, selectedColor, selectedSize);
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#c5a059] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-600 font-mono">Loading Markaz catalog product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[55vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
          <IconMarkazVerified className="w-8 h-8 text-[#b08745]" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-xl font-black text-slate-950 font-sans">Product Reference Not Found</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            No item matching reference <code className="bg-slate-100 text-[#b08745] px-2 py-0.5 rounded font-mono font-bold border border-slate-200">{productId}</code> was found in our direct wholesale catalog.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/products"
            className="bg-[#c5a059] hover:bg-[#d8b87d] text-slate-950 text-xs font-black px-6 py-3 rounded-xl shadow-md transition cursor-pointer"
          >
            Explore All 24 Products
          </Link>
          <Link
            href="/"
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-5 py-3 rounded-xl transition cursor-pointer"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 md:pb-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
        <Link href="/" className="hover:text-amber-700 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href={`/products?category=${product.category}`} className="hover:text-amber-700 transition capitalize font-semibold">
          {CATEGORIES.find(c => c.slug === product.category)?.name || product.category.replace('-', ' ')}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Container */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Image Gallery */}
        <div className="md:col-span-5 space-y-4">
          <div className="relative aspect-square w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 group">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-xl shadow-md">
                -{product.discount}% OFF
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md shadow-md transition cursor-pointer ${
                isLiked ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-700 hover:text-rose-500'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-xl border-2 overflow-hidden bg-slate-50 transition shrink-0 cursor-pointer ${
                    selectedImage === idx
                      ? 'border-amber-600 ring-2 ring-amber-500/30'
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Brand, SKU & Sourcing */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-[#b08745] uppercase tracking-wider bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-lg">
                  {product.brand}
                </span>
                {product.skuCode && (
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center space-x-1">
                    <IconMarkazVerified className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{product.skuCode}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-xs">
                {outOfStock ? (
                  <span className="text-rose-800 font-extrabold flex items-center space-x-1 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                    <span className="w-2 h-2 rounded-full bg-rose-600 mr-1 animate-pulse" />
                    <span>Out of Stock (0 Units Available)</span>
                  </span>
                ) : (
                  <span className="text-emerald-800 font-extrabold flex items-center space-x-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verified Stock ({liveStock} Units Available)</span>
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-950 leading-tight font-sans">
              {product.title}
            </h1>

            {/* Sourcing Hub & Inspection Badge */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {product.wholesaleSource && (
                <div className="flex items-center space-x-1.5 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <IconDirectFactory className="w-4 h-4 text-[#b08745]" />
                  <span>Hub: <strong className="text-slate-900">{product.wholesaleSource}</strong></span>
                </div>
              )}
              {product.isCodAvailable && (
                <div className="flex items-center space-x-1.5 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold">
                  <IconCashOnDelivery className="w-4 h-4 text-emerald-600" />
                  <span>Cash on Delivery with Open Parcel Check</span>
                </div>
              )}
            </div>

            {/* Ratings & Sold Count */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center text-amber-500 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                <Star className="w-4 h-4 fill-current mr-1" />
                <span className="text-slate-900 font-extrabold">{product.rating}</span>
                <span className="text-slate-400 font-medium ml-1">/ 5.0</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-semibold">{product.reviewsCount} Verified Customer Reviews</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-semibold">{product.soldCount} Delivered</span>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex items-baseline space-x-4">
                <span className="text-2xl sm:text-3xl font-black text-slate-950">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm sm:text-base text-slate-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="text-xs font-black text-white bg-rose-700 px-2.5 py-1 rounded-lg shadow-xs">
                    Save {formatPrice(product.originalPrice - product.price)} ({product.discount}%)
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <IconMarkazVerified className="w-3.5 h-3.5 text-emerald-600" />
                Markaz Direct Verified
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Color Variations */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">
                  Select Shade / Color: <span className="text-[#b08745] font-bold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`text-xs px-3.5 py-2 rounded-xl border font-semibold transition cursor-pointer ${
                        selectedColor === col
                          ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-xs font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size / Cutting Variations */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">
                  Select Size / Cutting: <span className="text-[#b08745] font-bold">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`text-xs px-3.5 py-2 rounded-xl border font-semibold transition cursor-pointer ${
                        selectedSize === sz
                          ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-xs font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-800 block mb-2">Select Quantity:</label>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={outOfStock || quantity <= 1}
                    className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 transition font-bold disabled:opacity-40 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-black text-slate-900">
                    {outOfStock ? 0 : quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(liveStock, quantity + 1))}
                    disabled={outOfStock || quantity >= liveStock}
                    className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 transition font-bold disabled:opacity-40 cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-500">
                  Subtotal: <strong className="text-slate-900">{formatPrice(product.price * (outOfStock ? 0 : quantity))}</strong>
                </span>
              </div>
            </div>

            {/* Value Badges */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-slate-600 text-xs">
              <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-[11px] leading-tight">Fast Express Shipping</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl">
                <IconParcelInspection className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-[11px] leading-tight">Open Parcel Check</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl">
                <RefreshCw className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-semibold text-[11px] leading-tight">7 Days Return Guarantee</span>
              </div>
            </div>

          </div>

          {/* Desktop Purchase Action Buttons */}
          <div className="hidden md:flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className={`flex-1 font-bold text-sm py-3.5 rounded-2xl transition flex items-center justify-center space-x-2 shadow-xs border ${
                outOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-slate-200'
                  : 'bg-[#090e17] hover:bg-[#162232] text-white border-white/10 cursor-pointer active:scale-[0.99]'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-[#c5a059]" />
              <span>{outOfStock ? 'Currently Sold Out' : 'Add to Cart'}</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={outOfStock}
              className={`flex-1 font-bold text-sm py-3.5 rounded-2xl transition shadow-xl border flex items-center justify-center space-x-2 ${
                outOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200'
                  : 'bg-[#0f172a] hover:bg-[#1e293b] text-amber-300 border-amber-500/30 active:scale-[0.99] cursor-pointer'
              }`}
            >
              <IconFlashSale className="w-4 h-4 text-[#c5a059]" />
              <span>{outOfStock ? 'Unavailable' : 'Direct Wholesale Checkout'}</span>
            </button>
          </div>

          {/* Direct WhatsApp Quick Order */}
          <div className="pt-2">
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
              className="w-full bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-xs flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>Order via WhatsApp (0300 1129959) - Nationwide COD</span>
            </a>
          </div>

          {/* Success notice */}
          {addedNotice && (
            <div className="bg-emerald-50 text-emerald-900 p-3 rounded-xl text-center text-xs font-bold flex items-center justify-center space-x-2 border border-emerald-200 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Item added to your cart! Opening drawer...</span>
            </div>
          )}

        </div>

      </div>

      {/* Product Details Tabs (Specs & Reviews) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex space-x-4 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-xs sm:text-sm font-extrabold transition border-b-2 cursor-pointer ${
              activeTab === 'specs'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-xs sm:text-sm font-extrabold transition border-b-2 flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Customer Reviews</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">
              {product.reviews ? product.reviews.length : 0}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'specs' && (
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Product Highlights</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {product.specs ? (
                Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="p-3 bg-slate-50 rounded-xl flex justify-between border border-slate-200/60">
                    <span className="text-slate-500 font-medium">{k}</span>
                    <span className="text-slate-900 font-bold">{v}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">Standard specifications apply.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-3">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-slate-950 text-blue-400 flex items-center justify-center font-bold text-xs">
                          {rev.userName[0]}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                            <span>{rev.userName}</span>
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No customer reviews yet. Be the first to review!</p>
            )}
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <span className="font-cursive text-amber-500 text-2xl block">Recommended</span>
          <h3 className="text-base sm:text-xl font-black text-slate-950">Similar Curated Models</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile Sticky Bottom Action Bar */}
      <ProductStickyBar
        product={product}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        quantity={quantity}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Structured SEO Schema (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://beshopable.com',
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: CATEGORIES.find(c => c.slug === product.category)?.name || product.category,
                    item: `https://beshopable.com/products?category=${product.category}`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: product.title,
                    item: `https://beshopable.com/product/${product.id}`,
                  },
                ],
              },
              {
                '@type': 'Product',
                name: product.title,
                image: product.images,
                description: product.description,
                sku: product.skuCode || product.id,
                brand: {
                  '@type': 'Brand',
                  name: product.brand,
                },
                offers: {
                  '@type': 'Offer',
                  priceCurrency: 'PKR',
                  price: product.price,
                  itemCondition: 'https://schema.org/NewCondition',
                  availability: outOfStock
                    ? 'https://schema.org/OutOfStock'
                    : 'https://schema.org/InStock',
                  seller: {
                    '@type': 'Organization',
                    name: 'BeShopable',
                  },
                },
                aggregateRating: product.rating
                  ? {
                      '@type': 'AggregateRating',
                      ratingValue: product.rating,
                      reviewCount: product.reviewsCount || 12,
                    }
                  : undefined,
              },
            ],
          }),
        }}
      />

    </div>
  );
}
