'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Product } from '@/types/product';
import { toast } from 'sonner';

interface ProductStoreState {
  createdProducts: Product[];
  updatedProducts: Record<number, Product>;
  deletedProductIds: number[];
}

interface ProductStoreContextType extends ProductStoreState {
  addCreatedProduct: (product: Product) => void;
  addUpdatedProduct: (id: number, product: Product) => void;
  addDeletedProduct: (id: number) => void;
  resetLocalOverrides: () => void;
  applyOverridesToProduct: (product: Product) => Product | null;
  applyOverridesToList: (products: Product[]) => Product[];
  hasLocalChanges: boolean;
}

const STORAGE_KEY = 'pad_product_mutations_store';

const ProductStoreContext = createContext<ProductStoreContextType | undefined>(undefined);

export function ProductStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProductStoreState>({
    createdProducts: [],
    updatedProducts: {},
    deletedProductIds: [],
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setState(JSON.parse(stored));
      }
    } catch (_e) {
      // ignore
    }
  }, []);

  const saveState = (newState: ProductStoreState) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (_e) {
      // ignore
    }
  };

  const addCreatedProduct = useCallback((product: Product) => {
    setState((prev) => {
      const next: ProductStoreState = {
        ...prev,
        createdProducts: [
          { ...product, isLocallyCreated: true },
          ...prev.createdProducts.filter((p) => p.id !== product.id),
        ],
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (_e) {}
      return next;
    });
  }, []);

  const addUpdatedProduct = useCallback((id: number, product: Product) => {
    setState((prev) => {
      const next: ProductStoreState = {
        ...prev,
        createdProducts: prev.createdProducts.map((p) => (p.id === id ? { ...product, isLocallyCreated: true } : p)),
        updatedProducts: {
          ...prev.updatedProducts,
          [id]: { ...product, isLocallyUpdated: true },
        },
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (_e) {}
      return next;
    });
  }, []);

  const addDeletedProduct = useCallback((id: number) => {
    setState((prev) => {
      const next: ProductStoreState = {
        ...prev,
        createdProducts: prev.createdProducts.filter((p) => p.id !== id),
        deletedProductIds: Array.from(new Set([...prev.deletedProductIds, id])),
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (_e) {}
      return next;
    });
  }, []);

  const resetLocalOverrides = useCallback(() => {
    const emptyState: ProductStoreState = {
      createdProducts: [],
      updatedProducts: {},
      deletedProductIds: [],
    };
    saveState(emptyState);
    toast.success('Local mock modifications reset to server state');
  }, []);

  const applyOverridesToProduct = useCallback(
    (product: Product): Product | null => {
      if (state.deletedProductIds.includes(product.id)) {
        return null;
      }
      if (state.updatedProducts[product.id]) {
        return {
          ...product,
          ...state.updatedProducts[product.id],
          isLocallyUpdated: true,
        };
      }
      return product;
    },
    [state]
  );

  const applyOverridesToList = useCallback(
    (serverProducts: Product[]): Product[] => {
      const filtered = serverProducts
        .filter((p) => !state.deletedProductIds.includes(p.id))
        .map((p) => {
          if (state.updatedProducts[p.id]) {
            return {
              ...p,
              ...state.updatedProducts[p.id],
              isLocallyUpdated: true,
            };
          }
          return p;
        });

      const activeCreated = state.createdProducts.filter((p) => !state.deletedProductIds.includes(p.id));
      return [...activeCreated, ...filtered];
    },
    [state]
  );

  const hasLocalChanges =
    state.createdProducts.length > 0 ||
    Object.keys(state.updatedProducts).length > 0 ||
    state.deletedProductIds.length > 0;

  return (
    <ProductStoreContext.Provider
      value={{
        ...state,
        addCreatedProduct,
        addUpdatedProduct,
        addDeletedProduct,
        resetLocalOverrides,
        applyOverridesToProduct,
        applyOverridesToList,
        hasLocalChanges,
      }}
    >
      {children}
    </ProductStoreContext.Provider>
  );
}

export function useProductStore(): ProductStoreContextType {
  const context = useContext(ProductStoreContext);
  if (!context) {
    throw new Error('useProductStore must be used within a ProductStoreProvider');
  }
  return context;
}