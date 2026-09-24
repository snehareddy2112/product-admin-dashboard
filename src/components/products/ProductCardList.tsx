'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { Product } from '@/types/product';
import { formatCurrency, getStockStatus } from '@/lib/utils';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface ProductCardListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductCardList({ products, onEdit, onDelete }: ProductCardListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map((product) => {
        const stockStatus = getStockStatus(product.stock);

        return (
          <div
            key={product.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors"
          >
            {/* Top row: Thumbnail + Details */}
            <div className="flex items-start gap-3.5">
              <div className="relative w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <img
                  src={product.thumbnail || (product.images && product.images[0]) || 'https://placehold.co/150x150/png?text=Product'}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/150x150/png?text=Product';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <Badge variant="secondary" size="sm" className="capitalize">
                    {product.category}
                  </Badge>
                  {product.isLocallyCreated && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      NEW
                    </span>
                  )}
                  {product.isLocallyUpdated && !product.isLocallyCreated && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                      UPDATED
                    </span>
                  )}
                </div>

                <Link
                  href={`/products/${product.id}`}
                  className="font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1 block text-sm"
                >
                  {product.title}
                </Link>

                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {product.brand ? `${product.brand} • ` : ''}SKU: {product.sku || `PRD-${product.id}`}
                </div>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(product.price)}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {product.discountPercentage}% off
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Middle row: Rating + Stock */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
              <StarRating rating={product.rating} size="sm" />
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${stockStatus.color}`}
              >
                {stockStatus.label}
              </span>
            </div>

            {/* Bottom row: Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <Link href={`/products/${product.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                  View Details
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(product)}
                aria-label={`Edit ${product.title}`}
              >
                <Edit2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onDelete(product)}
                aria-label={`Delete ${product.title}`}
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}