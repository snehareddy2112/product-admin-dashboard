import apiClient from './axiosInstance';
import {
  CategoryItem,
  Product,
  ProductMutationInput,
  ProductsResponse,
  SortField,
  SortOrder,
} from '@/types/product';

export interface FetchProductsOptions {
  limit?: number;
  skip?: number;
  sortBy?: SortField;
  order?: SortOrder;
  signal?: AbortSignal;
}

export interface SearchProductsOptions extends FetchProductsOptions {
  q: string;
}

export interface CategoryProductsOptions extends FetchProductsOptions {
  category: string;
}

export const productService = {
  async getProducts(options: FetchProductsOptions = {}): Promise<ProductsResponse> {
    const { limit = 10, skip = 0, sortBy, order, signal } = options;
    const params: Record<string, string | number> = { limit, skip };
    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;

    const response = await apiClient.get<ProductsResponse>('/products', {
      params,
      signal,
    });
    return response.data;
  },

  async searchProducts(options: SearchProductsOptions): Promise<ProductsResponse> {
    const { q, limit = 10, skip = 0, sortBy, order, signal } = options;
    const params: Record<string, string | number> = { q, limit, skip };
    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;

    const response = await apiClient.get<ProductsResponse>('/products/search', {
      params,
      signal,
    });
    return response.data;
  },

  async getProductsByCategory(options: CategoryProductsOptions): Promise<ProductsResponse> {
    const { category, limit = 10, skip = 0, sortBy, order, signal } = options;
    const params: Record<string, string | number> = { limit, skip };
    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;

    const response = await apiClient.get<ProductsResponse>(
      '/products/category/' + encodeURIComponent(category),
      {
        params,
        signal,
      }
    );
    return response.data;
  },

  async getProductById(id: number | string, signal?: AbortSignal): Promise<Product> {
    const response = await apiClient.get<Product>('/products/' + id, { signal });
    return response.data;
  },

  async getCategories(): Promise<CategoryItem[]> {
    const response = await apiClient.get<CategoryItem[] | string[]>('/products/categories');
    if (Array.isArray(response.data) && response.data.length > 0) {
      if (typeof response.data[0] === 'string') {
        return (response.data as string[]).map((cat) => ({
          slug: cat,
          name: cat
            .split('-')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' '),
          url: 'https://dummyjson.com/products/category/' + cat,
        }));
      }
      return response.data as CategoryItem[];
    }
    return [];
  },

  async addProduct(product: ProductMutationInput): Promise<Product> {
    const response = await apiClient.post<Product>('/products/add', product);
    return {
      ...response.data,
      isLocallyCreated: true,
    };
  },

  async updateProduct(id: number, updates: Partial<ProductMutationInput>): Promise<Product> {
    const response = await apiClient.put<Product>('/products/' + id, updates);
    return {
      ...response.data,
      isLocallyUpdated: true,
    };
  },

  async deleteProduct(id: number): Promise<{ id: number; isDeleted: boolean; deletedOn: string }> {
    const response = await apiClient.delete<{ id: number; isDeleted: boolean; deletedOn: string }>(
      '/products/' + id
    );
    return response.data;
  },
};
