'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types/product';
import { productService } from '@/lib/api/productService';
import { useProductStore } from '@/context/ProductStoreContext';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess?: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { addDeletedProduct } = useProductStore();

  if (!product) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Call DummyJSON DELETE simulation
      await productService.deleteProduct(product.id);
      // Remove in client optimistic layer
      addDeletedProduct(product.id);
      toast.success(`Product "${product.title}" has been deleted.`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Failed to delete product.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>Confirm Product Deletion</span>
        </div>
      }
      description="This action will permanently delete the product from your catalog."
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete Product
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <img
            src={product.thumbnail || 'https://placehold.co/100x100/png?text=Product'}
            alt={product.title}
            className="w-12 h-12 rounded-lg object-cover bg-white shrink-0 border"
          />
          <div className="min-w-0">
            <h5 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
              {product.title}
            </h5>
            <p className="text-xs text-slate-500 truncate">
              ID: #{product.id} • SKU: {product.sku || `PRD-${product.id}`}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Are you sure you want to proceed? Because this is a DummyJSON simulated backend, this item will be removed from your active dashboard session and persisted locally.
        </p>
      </div>
    </Modal>
  );
}