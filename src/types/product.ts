export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductMeta {
  createdAt?: string;
  updatedAt?: string;
  barcode?: string;
  qrCode?: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: ProductDimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: ProductReview[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: ProductMeta;
  images: string[];
  thumbnail: string;
  isLocallyCreated?: boolean;
  isLocallyUpdated?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CategoryItem {
  slug: string;
  name: string;
  url: string;
}

export type Category = string | CategoryItem;

export type SortField = 'title' | 'price' | 'rating' | 'stock' | 'discountPercentage' | 'id';
export type SortOrder = 'asc' | 'desc';

export interface ProductFilterParams {
  search?: string;
  category?: string;
  sortBy?: SortField;
  order?: SortOrder;
  page: number;
  limit: number;
}

export interface ProductMutationInput {
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images?: string[];
  tags?: string[];
  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
  sku?: string;
  weight?: number;
  minimumOrderQuantity?: number;
}

export interface ProductValidationErrors {
  title?: string;
  description?: string;
  price?: string;
  discountPercentage?: string;
  rating?: string;
  stock?: string;
  brand?: string;
  category?: string;
  thumbnail?: string;
  tags?: string;
  general?: string;
  [key: string]: string | undefined;
}