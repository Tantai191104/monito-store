import API from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
} from '@/types/product';

export const productService = {
  async getProducts(
    params: URLSearchParams = new URLSearchParams(),
  ): Promise<ApiResponse<{ products: Product[] }>> {
    const response = await API.get(`/products?${params.toString()}`);
    return response.data;
  },

  async getProductById(id: string): Promise<ApiResponse<{ product: Product }>> {
    const response = await API.get(`/products/${id}`);
    return response.data;
  },

  async createProduct(
    data: CreateProductPayload,
  ): Promise<ApiResponse<{ product: Product }>> {
    const response = await API.post('/products', data);
    return response.data;
  },

  async updateProduct(
    id: string,
    data: UpdateProductPayload,
  ): Promise<ApiResponse<{ product: Product }>> {
    const response = await API.patch(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: string): Promise<ApiResponse> {
    const response = await API.delete(`/products/${id}`);
    return response.data;
  },
};
