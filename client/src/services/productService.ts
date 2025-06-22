import API from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { Product, CreateProductPayload } from '@/types/product';

export const productService = {
  async createProduct(data: CreateProductPayload): Promise<ApiResponse<Product>> {
    const response = await API.post<ApiResponse<Product>>('/products', data);
    return response.data;
  },
  async getProducts(): Promise<ApiResponse<Product[]>> {
    const response = await API.get<ApiResponse<Product[]>>('/products');
    return response.data;
  },
  async getProductById(id: string): Promise<ApiResponse<Product>> {
    const response = await API.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },
  async updateProduct(id: string, data: Partial<CreateProductPayload>): Promise<ApiResponse<Product>> {
    const response = await API.put<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data;
  },
  async deleteProduct(id: string): Promise<ApiResponse<null>> {
    const response = await API.delete<ApiResponse<null>>(`/products/${id}`);
    return response.data;
  },
}; 