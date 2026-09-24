'use client';

import React from 'react';
import { Package, AlertTriangle, Star, CheckCircle } from 'lucide-react';
import { Product } from '@/types/product';

export interface ProductStatsProps {
  total: number;
  products: Product[];
  isLoading?: boolean;
}

export function ProductStats({ total, products, isLoading }: ProductStatsProps) {
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock < 10).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;
  const inStockCount = products.filter((p) => p.stock >= 10).length;

  const avgRating =
    products.length > 0
      ? (products.reduce((acc, p) => acc + (p.rating || 0), 0) / products.length).toFixed(1)
      : '4.5';

  const stats = [
    {
      label: 'Total Products',
      value: isLoading ? '...' : total.toLocaleString(),
      subtext: 'Catalog items available',
      icon: Package,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/50',
    },
    {
      label: 'In Stock (Page)',
      value: isLoading ? '...' : inStockCount,
      subtext: 'Healthy inventory',
      icon: CheckCircle,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    },
    {
      label: 'Low / Out of Stock',
      value: isLoading ? '...' : lowStockCount + outOfStockCount,
      subtext: `${lowStockCount} low, ${outOfStockCount} out`,
      icon: AlertTriangle,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/50',
    },
    {
      label: 'Average Rating',
      value: isLoading ? '...' : `${avgRating} ★`,
      subtext: 'Across current products',
      icon: Star,
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-sky-950/50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {stat.label}
              </span>
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stat.value}
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                {stat.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}