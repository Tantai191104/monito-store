import API from '@/lib/axios';
import type { ApiResponse, Pagination } from '@/types/api';
import type {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
} from '@/types/product';

export const productService = {
  async getProducts(
    params: URLSearchParams = new URLSearchParams(),
  ): Promise<ApiResponse<{ products: Product[]; pagination: Pagination }>> {
    const response = await API.get(`/products?${params.toString()}`);
    return response.data;
  },

  async getProductById(
    id: string,
    options: { customerView?: boolean } = {},
  ): Promise<ApiResponse<{ product: Product }>> {
    const response = await API.get(`/products/${id}`, { params: options });
    return response.data;
  },

  async createProduct(
    data: CreateProductPayload,
  ): Promise<ApiResponse<{ product: Product }>> {
    const response = await API.post('/products', data);
    return response.data;
  },

  async deleteProduct(id: string): Promise<ApiResponse<any>> {
    const response = await API.delete(`/products/${id}`);
    return response.data;
  },

  // Update product (partial update)
  async updateProduct(
    id: string,
    data: UpdateProductPayload,
  ): Promise<ApiResponse<{ product: Product }>> {
    const response = await API.patch(`/products/${id}`, data);

    return response.data;
  },
};
