'use client';

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProductStats } from '@/components/products/ProductStats';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductTable } from '@/components/products/ProductTable';
import { ProductCardList } from '@/components/products/ProductCardList';
import { ProductFormModal } from '@/components/products/ProductFormModal';
import { DeleteConfirmModal } from '@/components/products/DeleteConfirmModal';
import { Pagination } from '@/components/ui/Pagination';
import { TableSkeleton, CardSkeletonList } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import { Product, ProductFilterParams, SortField, SortOrder } from '@/types/product';
import { useProducts } from '@/hooks/useProducts';
import { useDebounce } from '@/hooks/useDebounce';
import { sanitizePageNumber, sanitizePageSize } from '@/lib/utils';
import { Plus, Package, PackageSearch } from 'lucide-react';

function ProductsDashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read URL query parameters safely with robust fallback sanitization
  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || '';
  const rawSortBy = searchParams.get('sortBy');
  const rawOrder = searchParams.get('order');
  const validSortFields: SortField[] = ['id', 'title', 'price', 'rating', 'stock', 'discountPercentage'];
  const urlSortBy: SortField = validSortFields.includes(rawSortBy as SortField) ? (rawSortBy as SortField) : 'id';
  const urlOrder: SortOrder = rawOrder === 'desc' ? 'desc' : 'asc';
  const urlPage = sanitizePageNumber(searchParams.get('page'), 1);
  const urlLimit = sanitizePageSize(searchParams.get('limit'), [10, 20, 50], 10);

  // Local state for debounced search input
  const [searchInput, setSearchInput] = useState<string>(urlSearch);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const updateUrlParams = useCallback(
    (newParams: Partial<{
      search: string;
      category: string;
      sortBy: SortField;
      order: SortOrder;
      page: number;
      limit: number;
    }>) => {
      const params = new URLSearchParams(searchParams.toString());

      const search = newParams.search !== undefined ? newParams.search : urlSearch;
      const category = newParams.category !== undefined ? newParams.category : urlCategory;
      const sortBy = newParams.sortBy !== undefined ? newParams.sortBy : urlSortBy;
      const order = newParams.order !== undefined ? newParams.order : urlOrder;
      const page = newParams.page !== undefined ? newParams.page : urlPage;
      const limit = newParams.limit !== undefined ? newParams.limit : urlLimit;

      if (search && search.trim()) {
        params.set('search', search.trim());
      } else {
        params.delete('search');
      }

      if (category) {
        params.set('category', category);
      } else {
        params.delete('category');
      }

      if (sortBy && sortBy !== 'id') {
        params.set('sortBy', sortBy);
      } else {
        params.delete('sortBy');
      }

      if (order && order !== 'asc') {
        params.set('order', order);
      } else {
        params.delete('order');
      }

      if (page && page > 1) {
        params.set('page', String(page));
      } else {
        params.delete('page');
      }

      if (limit && limit !== 10) {
        params.set('limit', String(limit));
      } else {
        params.delete('limit');
      }

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [searchParams, pathname, router, urlSearch, urlCategory, urlSortBy, urlOrder, urlPage, urlLimit]
  );

  // Sync debounced search to URL query params
  useEffect(() => {
    if (debouncedSearch !== urlSearch) {
      updateUrlParams({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch, urlSearch, updateUrlParams]);

  // Sync state if URL changes externally (e.g. browser back/forward)
  useEffect(() => {
    if (urlSearch !== searchInput) {
      setSearchInput(urlSearch);
    }
  }, [urlSearch, searchInput]);

  const filterParams: ProductFilterParams = useMemo(
    () => ({
      search: debouncedSearch,
      category: urlCategory,
      sortBy: urlSortBy,
      order: urlOrder,
      page: urlPage,
      limit: urlLimit,
    }),
    [debouncedSearch, urlCategory, urlSortBy, urlOrder, urlPage, urlLimit]
  );

  const {
    products,
    total,
    totalPages,
    isLoading,
    isError,
    error,
    categories,
    isLoadingCategories,
    refetch,
    isCategoryLimitationActive,
  } = useProducts(filterParams);

  const handleCategoryChange = (category: string) => {
    updateUrlParams({ category, page: 1 });
  };

  const handleSortChange = (sortBy: SortField, order: SortOrder) => {
    updateUrlParams({ sortBy, order, page: 1 });
  };

  const handleColumnSort = (field: SortField) => {
    if (urlSortBy === field) {
      const nextOrder: SortOrder = urlOrder === 'asc' ? 'desc' : 'asc';
      updateUrlParams({ sortBy: field, order: nextOrder, page: 1 });
    } else {
      updateUrlParams({ sortBy: field, order: 'asc', page: 1 });
    }
  };

  const handlePageChange = (page: number) => {
    updateUrlParams({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (limit: number) => {
    updateUrlParams({ limit, page: 1 });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    router.push(pathname, { scroll: false });
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (product: Product) => {
    setDeletingProduct(product);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Products
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage inventory, pricing, stock levels, and catalog items.
          </p>
        </div>

        <Button
          onClick={handleOpenAddModal}
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-sm shadow-indigo-500/20"
        >
          Add Product
        </Button>
      </div>

      {/* Product Metric Stat Cards */}
      <ProductStats total={total} products={products} isLoading={isLoading} />

      {/* Filters Bar: Search, Category, Sorting, Reset */}
      <ProductFilters
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        selectedCategory={urlCategory}
        onCategoryChange={handleCategoryChange}
        sortBy={urlSortBy}
        sortOrder={urlOrder}
        onSortChange={handleSortChange}
        categories={categories}
        isLoadingCategories={isLoadingCategories}
        onReset={handleResetFilters}
        isCategoryLimitationActive={isCategoryLimitationActive}
      />

      {/* Content View: Table / Cards / Skeletons / Empty / Error */}
      {isLoading ? (
        <div>
          <div className="hidden md:block">
            <TableSkeleton rows={urlLimit > 10 ? 10 : urlLimit} />
          </div>
          <div className="md:hidden">
            <CardSkeletonList count={6} />
          </div>
        </div>
      ) : isError ? (
        <ErrorState
          title="Failed to fetch products"
          message={error?.message || 'There was an error communicating with the DummyJSON API.'}
          error={error}
          onRetry={refetch}
        />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          description={
            searchInput || urlCategory
              ? 'No catalog items match your active search or category filters. Try adjusting your query or resetting filters.'
              : 'No products are currently available in the catalog.'
          }
          actionLabel={searchInput || urlCategory ? 'Clear All Filters' : undefined}
          onAction={searchInput || urlCategory ? handleResetFilters : undefined}
          icon={<PackageSearch className="w-8 h-8" />}
        />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <ProductTable
              products={products}
              sortBy={urlSortBy}
              sortOrder={urlOrder}
              onSort={handleColumnSort}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            <ProductCardList
              products={products}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />
          </div>

          {/* Server Pagination */}
          <Pagination
            currentPage={urlPage}
            totalPages={totalPages}
            pageSize={urlLimit}
            totalItems={total}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[10, 20, 50]}
          />
        </div>
      )}

      {/* Add & Edit Product Modal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        categories={categories}
        onSuccess={() => refetch()}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        product={deletingProduct}
        onSuccess={() => refetch()}
      />
    </div>
  );
}

export default function ProductsDashboardPage() {
  return (
    <AppLayout
      title={
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Product Inventory</span>
        </div>
      }
    >
      <Suspense fallback={<TableSkeleton rows={10} />}>
        <ProductsDashboardContent />
      </Suspense>
    </AppLayout>
  );
}