'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (productId: string, selectedColor?: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, delta: number, selectedColor?: string, selectedSize?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalItemsCount: number;
  subtotal: number;
  discount: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  voucherCode: string;
  appliedVoucher: string;
  applyVoucher: (code: string) => { success: boolean; message: string };
  removeVoucher: () => void;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('beshopable_cart');
        return savedCart ? JSON.parse(savedCart) : [];
      } catch (e) {
        console.error('Failed to load cart', e);
        return [];
      }
    }
    return [];
  });
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const freeShippingThreshold = 2000;

  // Sync with local storage
  useEffect(() => {
    try {
      localStorage.setItem('beshopable_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity = 1, selectedColor?: string, selectedSize?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, { product, quantity, selectedColor, selectedSize }];
    });
  };

  const removeFromCart = (productId: string, selectedColor?: string, selectedSize?: string) => {
    setCart((prev) =>
      prev.filter((item) => {
        const matchesProduct = item.product.id === productId;
        if (!matchesProduct) return true;
        if (selectedColor !== undefined && item.selectedColor !== selectedColor) return true;
        if (selectedSize !== undefined && item.selectedSize !== selectedSize) return true;
        return false;
      })
    );
  };

  const updateQuantity = (productId: string, delta: number, selectedColor?: string, selectedSize?: string) => {
    setCart((prev) =>
      prev
        .map((item) => {
          const matches =
            item.product.id === productId &&
            (selectedColor === undefined || item.selectedColor === selectedColor) &&
            (selectedSize === undefined || item.selectedSize === selectedSize);

          if (matches) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setVoucherCode('');
    setDiscountPercent(0);
  };

  const applyVoucher = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'BESHOPABLE20' || cleanCode === 'WELCOME20') {
      setVoucherCode(cleanCode);
      setDiscountPercent(20);
      return { success: true, message: '20% Privilege Discount Applied Successfully' };
    } else if (cleanCode === 'BESHOPABLE10' || cleanCode === 'FLASH10') {
      setVoucherCode(cleanCode);
      setDiscountPercent(10);
      return { success: true, message: '10% Discount Applied Successfully' };
    }
    return { success: false, message: 'Invalid or Expired Code. Try "BESHOPABLE20"' };
  };

  const removeVoucher = () => {
    setVoucherCode('');
    setDiscountPercent(0);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = Math.round((subtotal * discountPercent) / 100);
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 150;
  const total = Math.max(0, subtotal - discount + shippingFee);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalItemsCount: totalItems,
        subtotal,
        discount,
        discountAmount: discount,
        shippingFee,
        total,
        voucherCode,
        appliedVoucher: voucherCode,
        applyVoucher,
        removeVoucher,
        freeShippingThreshold,
        remainingForFreeShipping,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
