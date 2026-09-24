'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ProductImageGallery } from '@/components/products/ProductImageGallery';
import { ProductReviewList } from '@/components/products/ProductReviewList';
import { ProductFormModal } from '@/components/products/ProductFormModal';
import { DeleteConfirmModal } from '@/components/products/DeleteConfirmModal';
import { ProductDetailSkeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { useProductDetails } from '@/hooks/useProductDetails';
import { formatCurrency, calculateOriginalPrice, getStockStatus } from '@/lib/utils';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  PackageX,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { product, isLoading, isError, error, isNotFound, refetch } = useProductDetails(id);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (isLoading) {
    return (
      <AppLayout>
        <ProductDetailSkeleton />
      </AppLayout>
    );
  }

  if (isNotFound || !product) {
    return (
      <AppLayout>
        <div className="max-w-xl mx-auto my-12 text-center p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <PackageX className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Product Not Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            We could not locate product #{id}. It may have been deleted, moved, or the URL is invalid.
          </p>
          <div className="pt-2">
            <Link href="/products">
              <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Return to Products List
              </Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (isError) {
    return (
      <AppLayout>
        <div className="max-w-xl mx-auto my-12">
          <ErrorState
            title="Failed to load product details"
            message={error?.message || 'Could not fetch data for this item.'}
            error={error}
            onRetry={refetch}
          />
        </div>
      </AppLayout>
    );
  }

  const stockStatus = getStockStatus(product.stock);
  const originalPrice = calculateOriginalPrice(product.price, product.discountPercentage);
  const savings = originalPrice - product.price;

  const breadcrumbs = [
    { label: 'Products', href: '/products' },
    { label: product.category, href: `/products?category=${encodeURIComponent(product.category)}` },
    { label: product.title },
  ];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Actions Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Breadcrumb items={breadcrumbs} />

          <div className="flex items-center gap-2">
            <Link href="/products">
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back to List
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              leftIcon={<Edit2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
            >
              Edit
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
              leftIcon={<Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6">
            <ProductImageGallery
              images={product.images || []}
              thumbnail={product.thumbnail}
              title={product.title}
            />
          </div>

          {/* Right Column: Key Details, Pricing, Inventory & Logistics */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              {/* Category, Brand, Badges */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="default" size="md" className="capitalize font-semibold">
                  {product.category}
                </Badge>
                {product.brand && (
                  <Badge variant="secondary" size="md">
                    {product.brand}
                  </Badge>
                )}
                {product.isLocallyCreated && (
                  <Badge variant="success" size="md">
                    Newly Added
                  </Badge>
                )}
                {product.isLocallyUpdated && !product.isLocallyCreated && (
                  <Badge variant="info" size="md">
                    Updated
                  </Badge>
                )}
              </div>

              {/* Title & SKU */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {product.title}
              </h1>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                SKU: <span className="font-mono font-medium">{product.sku || `PRD-${product.id}`}</span> • ID: #{product.id}
              </div>
            </div>

            {/* Rating & Review summary */}
            <div className="flex items-center gap-3">
              <StarRating rating={product.rating} size="md" />
              <span className="text-xs text-slate-400">•</span>
              <a href="#reviews" className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                {product.reviews?.length || 0} Customer Reviews
              </a>
            </div>

            {/* Price Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-100/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
                  {formatCurrency(product.price)}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="text-base text-slate-400 line-through">
                    {formatCurrency(originalPrice)}
                  </span>
                )}
                {product.discountPercentage > 0 && (
                  <Badge variant="success" size="md" className="font-bold">
                    {product.discountPercentage}% OFF
                  </Badge>
                )}
              </div>
              {product.discountPercentage > 0 && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  You save {formatCurrency(savings)} on this product!
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Description
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Level Card */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Inventory Status</span>
                <span className={`px-2.5 py-0.5 rounded-full font-medium border ${stockStatus.color}`}>
                  {stockStatus.label}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    product.stock <= 0
                      ? 'bg-rose-500 w-0'
                      : product.stock < 10
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Minimum order quantity: {product.minimumOrderQuantity || 1} unit(s)
              </p>
            </div>

            {/* Logistics & Policy Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" /> Warranty
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  {product.warrantyInformation || '1 year standard'}
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Truck className="w-4 h-4" /> Shipping
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  {product.shippingInformation || 'Standard dispatch'}
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                  <RotateCcw className="w-4 h-4" /> Returns
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  {product.returnPolicy || '30 days policy'}
                </p>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {product.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Specifications & Dimensions Grid */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
            Technical Specifications & Dimensions
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">Width</span>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                {product.dimensions?.width ? `${product.dimensions.width} cm` : 'N/A'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">Height</span>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                {product.dimensions?.height ? `${product.dimensions.height} cm` : 'N/A'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">Depth</span>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                {product.dimensions?.depth ? `${product.dimensions.depth} cm` : 'N/A'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">Weight</span>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                {product.weight ? `${product.weight} kg` : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div id="reviews" className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Customer Reviews & Ratings
          </h2>
          <ProductReviewList reviews={product.reviews} averageRating={product.rating} />
        </div>

        {/* Edit Modal */}
        <ProductFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          product={product}
          categories={[{ slug: product.category, name: product.category, url: '' }]}
          onSuccess={() => refetch()}
        />

        {/* Delete Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          product={product}
          onSuccess={() => router.push('/products')}
        />
      </div>
    </AppLayout>
  );
}