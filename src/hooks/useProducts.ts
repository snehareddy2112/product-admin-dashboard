'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  CategoryItem,
  Product,
  ProductFilterParams,
  ProductsResponse,
} from '@/types/product';
import { productService } from '@/lib/api/productService';
import { useProductStore } from '@/context/ProductStoreContext';

interface UseProductsResult {
  products: Product[];
  total: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  categories: CategoryItem[];
  isLoadingCategories: boolean;
  refetch: () => void;
  isCategoryLimitationActive: boolean;
}

export function useProducts(filters: ProductFilterParams): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);

  const { applyOverridesToList } = useProductStore();

  // Track monotonic request ID & abort controller to prevent stale race conditions
  const requestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 1. Fetch categories list once on mount
  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        setIsLoadingCategories(true);
        const data = await productService.getCategories();
        if (isMounted) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        if (isMounted) {
          setIsLoadingCategories(false);
        }
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Determine if search and category are combined (DummyJSON limitation)
  const isCategoryLimitationActive = !!(filters.search && filters.search.trim() && filters.category);

  // 2. Main data fetching function
  const fetchProducts = useCallback(async () => {
    // Cancel previous inflight request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const currentReqId = ++requestIdRef.current;
    setIsLoading(true);
    setIsError(false);
    setError(null);

    const { search, category, sortBy, order, page, limit } = filters;
    const skip = (page - 1) * limit;

    try {
      let data: ProductsResponse;

      if (search && search.trim()) {
        const query = search.trim();
        if (category) {
          // DummyJSON limitation: Search endpoint does not support category filter natively.
          // Strategy: Fetch search results and filter by category client-side
          const searchData = await productService.searchProducts({
            q: query,
            limit: 100,
            skip: 0,
            sortBy,
            order,
            signal: controller.signal,
          });

          const filteredByCategory = searchData.products.filter(
            (p) => p.category.toLowerCase() === category.toLowerCase()
          );

          const paginated = filteredByCategory.slice(skip, skip + limit);
          data = {
            products: paginated,
            total: filteredByCategory.length,
            skip,
            limit,
          };
        } else {
          data = await productService.searchProducts({
            q: query,
            limit,
            skip,
            sortBy,
            order,
            signal: controller.signal,
          });
        }
      } else if (category) {
        data = await productService.getProductsByCategory({
          category,
          limit,
          skip,
          sortBy,
          order,
          signal: controller.signal,
        });
      } else {
        data = await productService.getProducts({
          limit,
          skip,
          sortBy,
          order,
          signal: controller.signal,
        });
      }

      if (currentReqId === requestIdRef.current) {
        const mergedList = applyOverridesToList(data.products);
        setProducts(mergedList);
        setTotal(data.total);
        setIsLoading(false);
      }
    } catch (err: unknown) {
      if ((err as Error).name === 'CanceledError' || (err as Error).name === 'AbortError') {
        return;
      }
      if (currentReqId === requestIdRef.current) {
        setIsError(true);
        setError(err as Error);
        setIsLoading(false);
      }
    }
  }, [filters, applyOverridesToList]);

  useEffect(() => {
    fetchProducts();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  const totalPages = Math.max(1, Math.ceil(total / (filters.limit || 10)));

  return {
    products,
    total,
    totalPages,
    isLoading,
    isError,
    error,
    categories,
    isLoadingCategories,
    refetch: fetchProducts,
    isCategoryLimitationActive,
  };
}