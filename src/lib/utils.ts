import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function calculateOriginalPrice(discountedPrice: number, discountPercentage: number): number {
  if (!discountPercentage || discountPercentage <= 0) return discountedPrice;
  return discountedPrice / (1 - discountPercentage / 100);
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getStockStatus(stock: number): {
  label: string;
  variant: 'success' | 'warning' | 'danger';
  color: string;
} {
  if (stock <= 0) {
    return {
      label: 'Out of Stock',
      variant: 'danger',
      color: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
    };
  }
  if (stock < 10) {
    return {
      label: 'Low Stock (' + stock + ')',
      variant: 'warning',
      color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    };
  }
  return {
    label: 'In Stock (' + stock + ')',
    variant: 'success',
    color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
  };
}

export function getCategoryLabel(category: string): string {
  if (!category) return '';
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function sanitizePageNumber(val: unknown, fallback: number = 1): number {
  const num = Number(val);
  if (isNaN(num) || num < 1 || !Number.isInteger(num)) return fallback;
  return num;
}

export function sanitizePageSize(val: unknown, allowed: number[] = [10, 20, 50], fallback: number = 10): number {
  const num = Number(val);
  if (isNaN(num) || !allowed.includes(num)) return fallback;
  return num;
}
