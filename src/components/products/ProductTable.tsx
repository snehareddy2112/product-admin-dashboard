'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Product, SortField, SortOrder } from '@/types/product';
import { formatCurrency, getStockStatus } from '@/lib/utils';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';

export interface ProductTableProps {
  products: Product[];
  sortBy: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({
  products,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const renderSortIcon = (field: SortField) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:text-slate-600 dark:group-hover:text-slate-400" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
    );
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-950/50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <th className="py-3.5 px-4 sm:px-6">Product</th>
            <th className="py-3.5 px-4">Category</th>
            <th className="py-3.5 px-4 cursor-pointer select-none group" onClick={() => onSort('price')}>
              <div className="flex items-center gap-1.5">
                <span>Price</span>
                {renderSortIcon('price')}
              </div>
            </th>
            <th className="py-3.5 px-4 cursor-pointer select-none group" onClick={() => onSort('rating')}>
              <div className="flex items-center gap-1.5">
                <span>Rating</span>
                {renderSortIcon('rating')}
              </div>
            </th>
            <th className="py-3.5 px-4 cursor-pointer select-none group" onClick={() => onSort('stock')}>
              <div className="flex items-center gap-1.5">
                <span>Stock</span>
                {renderSortIcon('stock')}
              </div>
            </th>
            <th className="py-3.5 px-4 text-right pr-6">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {products.map((product) => {
            const stockStatus = getStockStatus(product.stock);

            return (
              <tr
                key={product.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
              >
                {/* Product Info & Thumbnail */}
                <td className="py-3 px-4 sm:px-6">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                      <img
                        src={product.thumbnail || (product.images && product.images[0]) || 'https://placehold.co/100x100/png?text=Product'}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/png?text=Product';
                        }}
                      />
                    </div>
                    <div className="min-w-0 max-w-xs">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate block"
                          title={product.title}
                        >
                          {product.title}
                        </Link>
                        {product.isLocallyCreated && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            NEW
                          </span>
                        )}
                        {product.isLocallyUpdated && !product.isLocallyCreated && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                            UPDATED
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {product.brand ? `${product.brand} • ` : ''}SKU: {product.sku || `PRD-${product.id}`}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3 px-4">
                  <Badge variant="secondary" size="sm" className="capitalize font-medium">
                    {product.category}
                  </Badge>
                </td>

                {/* Price */}
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatCurrency(product.price)}
                  </div>
                  {product.discountPercentage > 0 && (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {product.discountPercentage}% OFF
                    </div>
                  )}
                </td>

                {/* Rating */}
                <td className="py-3 px-4">
                  <StarRating rating={product.rating} size="sm" />
                </td>

                {/* Stock Status */}
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${stockStatus.color}`}
                  >
                    {stockStatus.label}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right pr-6">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/products/${product.id}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300 transition-colors"
                      title="View Details"
                      aria-label={`View details for ${product.title}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 dark:hover:text-amber-300 transition-colors cursor-pointer"
                      title="Edit Product"
                      aria-label={`Edit ${product.title}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 transition-colors cursor-pointer"
                      title="Delete Product"
                      aria-label={`Delete ${product.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}