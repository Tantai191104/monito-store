/**
 * Lib
 */
import API from '@/lib/axios';

/**
 * Types
 */
import type { ApiResponse } from '@/types/api';
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from '@/types/category';

export const categoryService = {
  // Get all categories
  async getCategories(
    params: URLSearchParams = new URLSearchParams(),
  ): Promise<ApiResponse<{ categories: Category[] }>> {
    const response = await API.get(`/categories?${params.toString()}`);
    return response.data;
  },

  // Get category by ID
  async getCategoryById(
    id: string,
  ): Promise<ApiResponse<{ category: Category }>> {
    const response = await API.get<ApiResponse<{ category: Category }>>(
      `/categories/${id}`,
    );
    return response.data;
  },

  // Create new category
  async createCategory(
    data: CreateCategoryPayload,
  ): Promise<ApiResponse<{ category: Category }>> {
    const response = await API.post<ApiResponse<{ category: Category }>>(
      '/categories',
      data,
    );
    return response.data;
  },

  // Update category
  async updateCategory(
    id: string,
    data: UpdateCategoryPayload,
  ): Promise<ApiResponse<{ category: Category }>> {
    const response = await API.patch<ApiResponse<{ category: Category }>>(
      `/categories/${id}`,
      data,
    );
    return response.data;
  },

  // Delete category
  async deleteCategory(id: string): Promise<ApiResponse> {
    const response = await API.delete<ApiResponse>(`/categories/${id}`);
    return response.data;
  },
};
