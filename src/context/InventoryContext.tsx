'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MARKAZ_PRODUCTS } from '@/data/markazCatalog';
import { CartItem } from '@/types';

interface StockMap {
  [productId: string]: number;
}

interface InventoryContextType {
  stock: StockMap;
  getStock: (productId: string) => number;
  deductStock: (items: CartItem[]) => void;
  addStock: (productId: string, qty: number) => void;
  setProductStock: (productId: string, qty: number) => void;
  isOutOfStock: (productId: string) => boolean;
  isLowStock: (productId: string, threshold?: number) => boolean;
  totalProducts: number;
  lowStockProducts: string[];
  outOfStockProducts: string[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const STORAGE_KEY = 'beshopable_inventory';

function buildInitialStock(): StockMap {
  const map: StockMap = {};
  MARKAZ_PRODUCTS.forEach((p) => {
    map[p.id] = p.stock;
  });
  return map;
}

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stock, setStock] = useState<StockMap>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as StockMap;
          // Merge with any new products added to catalog
          const initial = buildInitialStock();
          return { ...initial, ...parsed };
        }
      } catch {
        // ignore
      }
    }
    return buildInitialStock();
  });

  // Persist to localStorage whenever stock changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stock));
    } catch {
      // ignore
    }
  }, [stock]);

  const getStock = (productId: string): number => {
    return stock[productId] ?? 0;
  };

  /**
   * Called after a successful order — deducts ordered quantities from inventory.
   */
  const deductStock = (items: CartItem[]) => {
    setStock((prev) => {
      const updated = { ...prev };
      items.forEach(({ product, quantity }) => {
        const current = updated[product.id] ?? 0;
        updated[product.id] = Math.max(0, current - quantity);
      });
      return updated;
    });
  };

  const addStock = (productId: string, qty: number) => {
    setStock((prev) => ({
      ...prev,
      [productId]: (prev[productId] ?? 0) + qty,
    }));
  };

  const setProductStock = (productId: string, qty: number) => {
    setStock((prev) => ({
      ...prev,
      [productId]: Math.max(0, qty),
    }));
  };

  const isOutOfStock = (productId: string): boolean => getStock(productId) <= 0;

  const isLowStock = (productId: string, threshold = 5): boolean => {
    const s = getStock(productId);
    return s > 0 && s <= threshold;
  };

  const lowStockProducts = Object.entries(stock)
    .filter(([, qty]) => qty > 0 && qty <= 5)
    .map(([id]) => id);

  const outOfStockProducts = Object.entries(stock)
    .filter(([, qty]) => qty <= 0)
    .map(([id]) => id);

  return (
    <InventoryContext.Provider
      value={{
        stock,
        getStock,
        deductStock,
        addStock,
        setProductStock,
        isOutOfStock,
        isLowStock,
        totalProducts: Object.keys(stock).length,
        lowStockProducts,
        outOfStockProducts,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider');
  return ctx;
};
