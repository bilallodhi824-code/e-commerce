import { Product, Category, FilterState } from '@/types';
import { MARKAZ_PRODUCTS } from '@/data/markazCatalog';
import { CATEGORIES } from '@/data/categories';
import { BESHOPABLE_BANNERS, ShopableBanner } from '@/data/banners';

/**
 * Product & Catalog Service Layer (Data Access Layer)
 *
 * This layer abstracts all data fetching operations across the store.
 *
 * BACKEND INTEGRATION READY:
 * When you connect Sanity CMS or Firebase Firestore:
 * - Sanity: Replace the internal resolvers with:
 *     return await sanityClient.fetch(`*[_type == "product"]...`);
 * - Firebase: Replace with:
 *     const snapshot = await getDocs(collection(db, "products"));
 *
 * All page components call this service and will automatically receive data
 * from your remote database without needing any changes to UI code.
 */

export interface ProductQueryOptions {
  category?: string;
  search?: string;
  sortBy?: FilterState['sortBy'];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  brand?: string;
  inStockOnly?: boolean;
  limit?: number;
}

/**
 * Retrieve all products with optional filters and sorting
 */
export async function getProducts(options?: ProductQueryOptions): Promise<Product[]> {
  // Simulates asynchronous query resolution (e.g. Sanity GROQ / Firebase Firestore)
  let results = [...MARKAZ_PRODUCTS];

  if (!options) return results;

  if (options.category && options.category !== 'all') {
    results = results.filter(p => p.category.toLowerCase() === options.category?.toLowerCase());
  }

  if (options.search) {
    const q = options.search.toLowerCase().trim();
    results = results.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.skuCode?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (options.brand && options.brand !== 'all') {
    results = results.filter(p => p.brand.toLowerCase() === options.brand?.toLowerCase());
  }

  if (typeof options.minPrice === 'number') {
    results = results.filter(p => p.price >= (options.minPrice ?? 0));
  }

  if (typeof options.maxPrice === 'number' && options.maxPrice > 0) {
    results = results.filter(p => p.price <= (options.maxPrice ?? Infinity));
  }

  if (typeof options.minRating === 'number' && options.minRating > 0) {
    results = results.filter(p => p.rating >= (options.minRating ?? 0));
  }

  if (options.inStockOnly) {
    results = results.filter(p => p.stock > 0);
  }

  if (options.sortBy) {
    switch (options.sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        results.reverse();
        break;
      case 'popular':
      default:
        results.sort((a, b) => b.soldCount - a.soldCount);
        break;
    }
  }

  if (options.limit && options.limit > 0) {
    results = results.slice(0, options.limit);
  }

  return results;
}

/**
 * Retrieve a single product by its unique ID or Markaz SKU
 */
export async function getProductById(id: string): Promise<Product | null> {
  if (!id) return null;
  const clean = decodeURIComponent(id).trim().toLowerCase();

  // 1. Exact match by product ID or SKU
  let match = MARKAZ_PRODUCTS.find(
    p => p.id.toLowerCase() === clean || p.skuCode?.toLowerCase() === clean
  );
  if (match) return match;

  // 2. Match without 'mkz-' prefix
  match = MARKAZ_PRODUCTS.find(
    p => p.id.replace(/^mkz-/, '').toLowerCase() === clean.replace(/^mkz-/, '')
  );
  if (match) return match;

  // 3. Typo resilience: match by category SKU prefix digits (e.g. MKZ-7183 matches MKZ-7103)
  const cleanDigits = clean.replace(/\D/g, '');
  if (cleanDigits.length >= 2) {
    match = MARKAZ_PRODUCTS.find(p => {
      const pDigits = p.skuCode?.replace(/\D/g, '') || '';
      return pDigits.startsWith(cleanDigits.substring(0, 2));
    });
    if (match) return match;
  }

  return null;
}

/**
 * Retrieve products flagged for flash sales
 */
export async function getFlashSaleProducts(): Promise<Product[]> {
  return MARKAZ_PRODUCTS.filter(p => p.isFlashSale);
}

/**
 * Retrieve trending wholesale products
 */
export async function getTrendingProducts(limit = 8): Promise<Product[]> {
  return MARKAZ_PRODUCTS.filter(p => p.isTrending).slice(0, limit);
}

/**
 * Retrieve related products for a product detail view
 */
export async function getRelatedProducts(productId: string, category: string, limit = 4): Promise<Product[]> {
  return MARKAZ_PRODUCTS
    .filter(p => p.id !== productId && p.category === category)
    .slice(0, limit);
}

/**
 * Retrieve all wholesale categories
 */
export async function getCategories(): Promise<Category[]> {
  return CATEGORIES;
}

/**
 * Retrieve a category by its slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const match = CATEGORIES.find(c => c.slug === slug || c.id === slug);
  return match || null;
}

/**
 * Retrieve curated homepage banners
 */
export async function getBanners(): Promise<ShopableBanner[]> {
  return BESHOPABLE_BANNERS;
}
