'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '@/types/product';
import { productService } from '@/lib/api/productService';
import { useProductStore } from '@/context/ProductStoreContext';

interface UseProductDetailsResult {
  product: Product | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isNotFound: boolean;
  refetch: () => void;
}

export function useProductDetails(id: string | number): UseProductDetailsResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const { applyOverridesToProduct, createdProducts, deletedProductIds } = useProductStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchProduct = useCallback(async () => {
    const numId = Number(id);
    if (!id || isNaN(numId) || numId <= 0) {
      setIsLoading(false);
      setIsNotFound(true);
      return;
    }

    // Check if deleted locally
    if (deletedProductIds.includes(numId)) {
      setIsLoading(false);
      setIsNotFound(true);
      setProduct(null);
      return;
    }

    // Check if created locally
    const locallyCreated = createdProducts.find((p) => p.id === numId);
    if (locallyCreated) {
      setProduct(locallyCreated);
      setIsLoading(false);
      setIsNotFound(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setIsError(false);
    setIsNotFound(false);
    setError(null);

    try {
      const serverProduct = await productService.getProductById(numId, controller.signal);
      const merged = applyOverridesToProduct(serverProduct);
      if (!merged) {
        setIsNotFound(true);
        setProduct(null);
      } else {
        setProduct(merged);
      }
    } catch (err: unknown) {
      const e = err as Error & { status?: number };
      if (e.name === 'CanceledError' || e.name === 'AbortError') {
        return;
      }
      if (e.status === 404 || e.message?.toLowerCase().includes('not found')) {
        setIsNotFound(true);
      } else {
        setIsError(true);
        setError(e);
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, applyOverridesToProduct, createdProducts, deletedProductIds]);

  useEffect(() => {
    fetchProduct();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProduct]);

  return {
    product,
    isLoading,
    isError,
    error,
    isNotFound,
    refetch: fetchProduct,
  };
}
