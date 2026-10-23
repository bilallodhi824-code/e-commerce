export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  userAvatar?: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number; // Percentage
  rating: number; // e.g. 4.8
  reviewsCount: number;
  stock: number;
  soldCount: number;
  category: string;
  brand: string;
  isFlashSale?: boolean;
  isTrending?: boolean;
  images: string[];
  specs?: Record<string, string>;
  colors?: string[];
  sizes?: string[];
  warranty?: string;
  shippingFee: number;
  freeShipping: boolean;
  reviews?: Review[];
  skuCode?: string; // e.g. MKZ-8821
  resellerMargin?: number; // e.g. 750 (Rs. profit)
  isCodAvailable?: boolean;
  wholesaleSource?: string; // e.g. 'Faisalabad Textile Hub', 'Lahore Wholesale'
  fabricType?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  iconName: string;
  itemCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface FilterOptions {
  category: string;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  brand: string;
  inStockOnly: boolean;
  sortBy: 'popular' | 'price-low' | 'price-high' | 'rating' | 'newest';
}

export type FilterState = FilterOptions;

export interface Order {
  id: string;
  orderId?: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  total?: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    province: string;
  };
  paymentMethod: 'cod' | 'card' | 'wallet';
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Dispatched' | 'Out for Delivery';
  estimatedDelivery: string;
  courierPartner?: string;
  trackingNumber?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  memberSince: string;
  role?: 'customer' | 'admin';
}
