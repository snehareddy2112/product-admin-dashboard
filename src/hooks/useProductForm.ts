'use client';

import { useState, useCallback, useEffect } from 'react';
import { Product, ProductMutationInput, ProductValidationErrors } from '@/types/product';
import { productService } from '@/lib/api/productService';
import { useProductStore } from '@/context/ProductStoreContext';
import { toast } from 'sonner';

interface UseProductFormProps {
  initialData?: Product | null;
  onSuccess?: (product: Product) => void;
}

export function useProductForm({ initialData, onSuccess }: UseProductFormProps = {}) {
  const isEditing = !!initialData?.id;
  const { addCreatedProduct, addUpdatedProduct } = useProductStore();

  const [formData, setFormData] = useState<ProductMutationInput>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    discountPercentage: initialData?.discountPercentage || 0,
    rating: initialData?.rating || 4.5,
    stock: initialData?.stock || 0,
    brand: initialData?.brand || '',
    category: initialData?.category || '',
    thumbnail: initialData?.thumbnail || '',
    images: initialData?.images || [],
    tags: initialData?.tags || [],
    warrantyInformation: initialData?.warrantyInformation || '1 year warranty',
    shippingInformation: initialData?.shippingInformation || 'Ships in 1-2 business days',
    returnPolicy: initialData?.returnPolicy || '30 days return policy',
  });

  const [errors, setErrors] = useState<ProductValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sync initialData when editing target changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price || 0,
        discountPercentage: initialData.discountPercentage || 0,
        rating: initialData.rating || 4.5,
        stock: initialData.stock || 0,
        brand: initialData.brand || '',
        category: initialData.category || '',
        thumbnail: initialData.thumbnail || '',
        images: initialData.images || [],
        tags: initialData.tags || [],
        warrantyInformation: initialData.warrantyInformation || '1 year warranty',
        shippingInformation: initialData.shippingInformation || 'Ships in 1-2 business days',
        returnPolicy: initialData.returnPolicy || '30 days return policy',
      });
      setErrors({});
      setTouched({});
    }
  }, [initialData]);

  const validate = useCallback((data: ProductMutationInput): ProductValidationErrors => {
    const errs: ProductValidationErrors = {};

    if (!data.title.trim()) {
      errs.title = 'Product title is required';
    } else if (data.title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters';
    }

    if (!data.description.trim()) {
      errs.description = 'Description is required';
    } else if (data.description.trim().length < 10) {
      errs.description = 'Description must be at least 10 characters';
    }

    if (data.price === undefined || data.price === null || isNaN(Number(data.price))) {
      errs.price = 'Price is required';
    } else if (Number(data.price) <= 0) {
      errs.price = 'Price must be greater than $0';
    }

    if (data.discountPercentage !== undefined && (Number(data.discountPercentage) < 0 || Number(data.discountPercentage) > 100)) {
      errs.discountPercentage = 'Discount must be between 0% and 100%';
    }

    if (data.stock === undefined || data.stock === null || isNaN(Number(data.stock))) {
      errs.stock = 'Stock quantity is required';
    } else if (Number(data.stock) < 0 || !Number.isInteger(Number(data.stock))) {
      errs.stock = 'Stock must be a non-negative whole number';
    }

    if (!data.category || !data.category.trim()) {
      errs.category = 'Please select a category';
    }

    if (!data.brand || !data.brand.trim()) {
      errs.brand = 'Brand is required';
    }

    if (data.thumbnail && !data.thumbnail.startsWith('http')) {
      errs.thumbnail = 'Thumbnail must be a valid URL starting with http/https';
    }

    return errs;
  }, []);

  const handleChange = (
    field: keyof ProductMutationInput,
    value: unknown
  ) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (touched[field]) {
        const validation = validate(next);
        setErrors((prevErr) => ({ ...prevErr, [field]: validation[field as string] }));
      }
      return next;
    });
  };

  const handleBlur = (field: keyof ProductMutationInput) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validation = validate(formData);
    setErrors((prev) => ({ ...prev, [field]: validation[field as string] }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setTouched({
      title: true,
      description: true,
      price: true,
      discountPercentage: true,
      stock: true,
      brand: true,
      category: true,
      thumbnail: true,
    });

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: ProductMutationInput = {
        ...formData,
        price: Number(formData.price),
        discountPercentage: Number(formData.discountPercentage || 0),
        stock: Number(formData.stock),
        thumbnail:
          formData.thumbnail.trim() ||
          'https://placehold.co/600x400/png?text=' + encodeURIComponent(formData.title),
        images: formData.images && formData.images.length > 0 ? formData.images : [
          formData.thumbnail.trim() || 'https://placehold.co/600x400/png?text=' + encodeURIComponent(formData.title)
        ],
      };

      if (isEditing && initialData?.id) {
        const updated = await productService.updateProduct(initialData.id, payload);
        const fullUpdatedProduct: Product = {
          ...initialData,
          ...updated,
          isLocallyUpdated: true,
        };
        addUpdatedProduct(initialData.id, fullUpdatedProduct);
        toast.success('Product updated successfully!');
        if (onSuccess) onSuccess(fullUpdatedProduct);
      } else {
        const created = await productService.addProduct(payload);
        const newId = created.id || Date.now();
        const fullNewProduct: Product = {
          ...created,
          id: newId,
          isLocallyCreated: true,
        };
        addCreatedProduct(fullNewProduct);
        toast.success('Product created successfully!');
        if (onSuccess) onSuccess(fullNewProduct);
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Operation failed. Please try again.');
      setErrors((prev) => ({ ...prev, general: error.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    isEditing,
    handleChange,
    handleBlur,
    handleSubmit,
    setFormData,
  };
}