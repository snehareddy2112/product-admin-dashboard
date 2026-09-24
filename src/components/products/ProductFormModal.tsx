'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CategoryItem, Product } from '@/types/product';
import { useProductForm } from '@/hooks/useProductForm';
import { Sparkles } from 'lucide-react';

export interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  categories: CategoryItem[];
  onSuccess?: (product: Product) => void;
}

export function ProductFormModal({
  isOpen,
  onClose,
  product,
  categories,
  onSuccess,
}: ProductFormModalProps) {
  const {
    formData,
    errors,
    isSubmitting,
    isEditing,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useProductForm({
    initialData: product,
    onSuccess: (savedProduct) => {
      if (onSuccess) onSuccess(savedProduct);
      onClose();
    },
  });

  const categoryOptions = categories.map((c) => ({
    value: typeof c === 'string' ? c : c.slug,
    label: typeof c === 'string' ? c : c.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <span>{isEditing ? `Edit Product (#${product?.id})` : 'Add New Product'}</span>
        </div>
      }
      description={
        isEditing
          ? 'Update product attributes. Changes will be optimistically applied to your dashboard.'
          : 'Create a new product catalog item with instant client-side validation.'
      }
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSubmit()}
            isLoading={isSubmitting}
          >
            {isEditing ? 'Save Changes' : 'Create Product'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {errors.general}
          </div>
        )}

        {/* Section 1: Basic Info */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Basic Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Product Title"
                required
                placeholder="e.g. Wireless Noise-Canceling Headphones"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                onBlur={() => handleBlur('title')}
                error={errors.title}
              />
            </div>

            <Input
              label="Brand"
              required
              placeholder="e.g. Sony, Apple, Samsung"
              value={formData.brand}
              onChange={(e) => handleChange('brand', e.target.value)}
              onBlur={() => handleBlur('brand')}
              error={errors.brand}
            />

            <Select
              label="Category"
              required
              placeholder="Select category..."
              options={categoryOptions}
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              onBlur={() => handleBlur('category')}
              error={errors.category}
            />

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase block mb-1.5">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Detailed description of features, materials, specifications..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                onBlur={() => handleBlur('description')}
                className={`w-full p-3 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.description
                    ? 'border-rose-400 focus:ring-rose-500'
                    : 'border-slate-300 dark:border-slate-700 hover:border-slate-400'
                }`}
              />
              {errors.description && (
                <p className="text-xs font-medium text-rose-600 dark:text-rose-400 mt-1">
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Inventory */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Pricing & Inventory
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Price ($ USD)"
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="99.99"
              value={formData.price || ''}
              onChange={(e) => handleChange('price', e.target.value)}
              onBlur={() => handleBlur('price')}
              error={errors.price}
            />

            <Input
              label="Discount (%)"
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="10"
              value={formData.discountPercentage !== undefined ? formData.discountPercentage : ''}
              onChange={(e) => handleChange('discountPercentage', e.target.value)}
              onBlur={() => handleBlur('discountPercentage')}
              error={errors.discountPercentage}
            />

            <Input
              label="Stock Quantity"
              type="number"
              step="1"
              min="0"
              required
              placeholder="50"
              value={formData.stock !== undefined ? formData.stock : ''}
              onChange={(e) => handleChange('stock', e.target.value)}
              onBlur={() => handleBlur('stock')}
              error={errors.stock}
            />
          </div>
        </div>

        {/* Section 3: Media & Logistics */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Media & Shipping Info
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Thumbnail Image URL"
                placeholder="https://..."
                value={formData.thumbnail}
                onChange={(e) => handleChange('thumbnail', e.target.value)}
                onBlur={() => handleBlur('thumbnail')}
                error={errors.thumbnail}
                helperText="Leave empty to use automatic placeholder image"
              />

              {formData.thumbnail && (
                <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <img
                    src={formData.thumbnail}
                    alt="Preview"
                    className="w-14 h-14 rounded-lg object-cover bg-white"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className="text-xs text-slate-500">Image Preview</span>
                </div>
              )}
            </div>

            <Input
              label="Warranty Information"
              placeholder="e.g. 1 year limited warranty"
              value={formData.warrantyInformation || ''}
              onChange={(e) => handleChange('warrantyInformation', e.target.value)}
            />

            <Input
              label="Shipping Information"
              placeholder="e.g. Ships in 1-2 business days"
              value={formData.shippingInformation || ''}
              onChange={(e) => handleChange('shippingInformation', e.target.value)}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}