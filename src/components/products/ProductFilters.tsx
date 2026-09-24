'use client';

import React from 'react';
import { Search, X, RotateCcw, Info } from 'lucide-react';
import { CategoryItem, SortField, SortOrder } from '@/types/product';
import { Button } from '@/components/ui/Button';

export interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  sortBy: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
  categories: CategoryItem[];
  isLoadingCategories?: boolean;
  onReset: () => void;
  isCategoryLimitationActive?: boolean;
}

export function ProductFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  sortOrder,
  onSortChange,
  categories,
  onReset,
  isCategoryLimitationActive = false,
}: ProductFiltersProps) {
  const sortOptions = [
    { value: 'id-asc', label: 'Default (ID: Low to High)', field: 'id' as SortField, order: 'asc' as SortOrder },
    { value: 'title-asc', label: 'Title: A to Z', field: 'title' as SortField, order: 'asc' as SortOrder },
    { value: 'title-desc', label: 'Title: Z to A', field: 'title' as SortField, order: 'desc' as SortOrder },
    { value: 'price-asc', label: 'Price: Low to High', field: 'price' as SortField, order: 'asc' as SortOrder },
    { value: 'price-desc', label: 'Price: High to Low', field: 'price' as SortField, order: 'desc' as SortOrder },
    { value: 'rating-desc', label: 'Rating: High to Low', field: 'rating' as SortField, order: 'desc' as SortOrder },
    { value: 'stock-desc', label: 'Stock: High to Low', field: 'stock' as SortField, order: 'desc' as SortOrder },
  ];

  const currentSortValue = `${sortBy}-${sortOrder}`;

  const handleSortSelect = (val: string) => {
    const selected = sortOptions.find((opt) => opt.value === val);
    if (selected) {
      onSortChange(selected.field, selected.order);
    }
  };

  const hasActiveFilters = !!(searchQuery.trim() || selectedCategory || sortBy !== 'id' || sortOrder !== 'asc');

  return (
    <div className="space-y-3 mb-6">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input with Debounce & Clear */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search products by title, brand, tag..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-9 pr-9 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters Group: Category & Sort */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Category Dropdown */}
          <div className="w-full sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full h-10 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => {
                const slug = typeof cat === 'string' ? cat : cat.slug;
                const name = typeof cat === 'string' ? cat : cat.name;
                return (
                  <option key={slug} value={slug}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full sm:w-56">
            <select
              value={currentSortValue}
              onChange={(e) => handleSortSelect(e.target.value)}
              className="w-full h-10 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="md"
              onClick={onReset}
              className="h-10 text-xs shrink-0"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              title="Reset all filters"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* DummyJSON search + category limitation notice */}
      {isCategoryLimitationActive && (
        <div className="p-2.5 px-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 text-xs text-indigo-800 dark:text-indigo-300 flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <span>
            <strong>Search + Category Active:</strong> Filtered search results by category &ldquo;{selectedCategory}&rdquo; client-side (handling DummyJSON API query combination limitation).
          </span>
        </div>
      )}
    </div>
  );
}